// Wordvoya skor tablosu API'si (wordvoya.com/api/v1). Bağımlılıksız: node:http + node:sqlite.
// Oyuncu kendi seçtiği adla görünür; kimlik cihazda üretilen gizli belirteçtir (sunucuda yalnız özeti tutulur).
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { readFileSync } from 'node:fs'
import { BOARDS, type Board, Store } from './db.ts'
import { cleanName, parseSnapshot } from './validate.ts'
import { type Admin, AdminStore, isSort } from './admin.ts'
import { createIntegrityChecker, failClosedChecker, INTEGRITY_MODES, type IntegrityChecker, type IntegrityMode } from './integrity.ts'

const PACKAGE_NAME = 'com.cranked.wordvoya'

// nginx'teki client_max_body_size 8k ile aynı (bölüm listesiyle skor gövdesi ~3 KB)
const MAX_BODY = 8192
const TOP_ROWS = 25
const NEAR_ABOVE = 5
const NEAR_ROWS = 11

type Json = Record<string, unknown>

class HttpError extends Error {
  readonly status: number
  readonly code: string
  constructor(status: number, code: string) {
    super(code)
    this.status = status
    this.code = code
  }
}

/**
 * Anahtar başına kayan pencereli sınır (tek süreç, bellekte). Eski anahtarlar dakikada bir süpürülür; tablo dolarsa
 * hepsi silinmez (saldırgan sayaçları sıfırlayamasın), yeni anahtar reddedilir.
 */
class Limiter {
  private hits = new Map<string, { list: number[]; windowMs: number }>()
  private now: () => number
  private swept = 0
  constructor(now: () => number) { this.now = now }
  allow(key: string, max: number, windowMs: number): boolean {
    const t = this.now()
    if (t - this.swept > 60_000) this.sweep(t)
    const entry = this.hits.get(key)
    if (!entry && this.hits.size >= MAX_LIMITER_KEYS) return false
    const list = (entry?.list ?? []).filter((x) => t - x < windowMs)
    if (list.length >= max) { this.hits.set(key, { list, windowMs }); return false }
    list.push(t)
    this.hits.set(key, { list, windowMs })
    return true
  }
  private sweep(t: number) {
    this.swept = t
    for (const [k, e] of this.hits) if (!e.list.some((x) => t - x < e.windowMs)) this.hits.delete(k)
  }
}

const MAX_LIMITER_KEYS = 200_000

/** IPv6 adresleri /64 ağına göre gruplanır: tek abonelik binlerce adresle sınırı aşamasın. */
function clientKey(ip: string): string {
  const v6 = ip.replace(/^::ffff:/, '')
  if (!v6.includes(':')) return v6
  return v6.split(':').slice(0, 4).join(':') + '::/64'
}

async function readRaw(req: IncomingMessage): Promise<Buffer> {
  let size = 0
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    size += (chunk as Buffer).length
    if (size > MAX_BODY) throw new HttpError(413, 'too_large')
    chunks.push(chunk as Buffer)
  }
  return Buffer.concat(chunks)
}

function parseJson(raw: Buffer): unknown {
  if (raw.length === 0) return {}
  let value: unknown
  try { value = JSON.parse(raw.toString('utf8')) } catch { throw new HttpError(400, 'json') }
  // Gövde hep nesne: dizi, sayı ya da null alan adlarıyla okunurken yanlış anlaşılmasın
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new HttpError(400, 'json')
  return value
}

const readJson = async (req: IncomingMessage) => parseJson(await readRaw(req))

function send(res: ServerResponse, status: number, body: Json, headers: Record<string, string> = {}) {
  const text = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(text),
    'X-Content-Type-Options': 'nosniff',
    ...headers,
  })
  res.end(text)
}

// Panel sayfası: tek HTML, betik ve stil (api/admin/). Dış kaynak yok, sıkı CSP.
const PANEL_FILES: Record<string, { file: string; type: string }> = {
  '/api/admin/': { file: 'index.html', type: 'text/html; charset=utf-8' },
  '/api/admin/app.js': { file: 'app.js', type: 'text/javascript; charset=utf-8' },
  '/api/admin/style.css': { file: 'style.css', type: 'text/css; charset=utf-8' },
}
const PANEL_HEADERS = {
  'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'X-Robots-Tag': 'noindex, nofollow',
  'Cache-Control': 'no-cache',
}
const panelCache = new Map<string, Buffer>()
function panelFile(file: string): Buffer | null {
  if (!panelCache.has(file)) {
    try { panelCache.set(file, readFileSync(new URL(`../admin/${file}`, import.meta.url))) } catch { return null }
  }
  return panelCache.get(file)!
}

const SESSION_COOKIE = 'wv_admin'
function cookie(req: IncomingMessage, name: string): string | null {
  for (const part of (req.headers.cookie ?? '').split(';')) {
    const i = part.indexOf('=')
    if (i > 0 && part.slice(0, i).trim() === name) {
      try { return decodeURIComponent(part.slice(i + 1).trim()) } catch { return null }   // bozuk % kodlaması
    }
  }
  return null
}

const MAX_GRANT = 100_000
const NOTE_MAX = 120

export function createApp(
  store: Store,
  opts: {
    now?: () => number
    perMinute?: number
    playersPerHour?: number
    loginsPer15Min?: number
    loginsPerUserHour?: number
    secureCookie?: boolean
    origin?: string
    integrity?: IntegrityChecker
  } = {},
) {
  const now = opts.now ?? Date.now
  const limiter = new Limiter(now)
  const admins = new AdminStore(store)
  const integrity = opts.integrity ?? createIntegrityChecker({ mode: 'off', packageName: PACKAGE_NAME })
  const loginsPer15Min = opts.loginsPer15Min ?? 10
  const loginsPerUserHour = opts.loginsPerUserHour ?? 30
  let loginsInFlight = 0
  const secure = opts.secureCookie ?? true
  const origin = opts.origin ?? 'https://wordvoya.com'
  // Mobil operatörler çok kullanıcıyı tek IP'den çıkarır (CGNAT): sınırlar yalnız kötüye kullanımı kesecek kadar
  const perMinute = opts.perMinute ?? 300
  const playersPerHour = opts.playersPerHour ?? 60

  const auth = (req: IncomingMessage, required: boolean) => {
    const header = req.headers.authorization ?? ''
    const token = header.startsWith('Bearer ') ? header.slice(7).trim() : ''
    const player = token ? store.playerByToken(token) : undefined
    if (required && !player) throw new HttpError(401, 'auth')
    return player
  }

  async function handle(req: IncomingMessage, res: ServerResponse) {
    // X-Real-IP'yi host nginx yazar; konteyner portu yalnız 127.0.0.1'e açık olduğu için dışarıdan uydurulamaz
    const ip = clientKey((req.headers['x-real-ip'] as string | undefined) ?? req.socket.remoteAddress ?? '?')
    const url = new URL(req.url ?? '/', 'http://local')
    const path = url.pathname.replace(/\/+$/, '')
    const method = req.method ?? 'GET'

    if (path === '/api/v1/health') return send(res, 200, { ok: true })
    if (!limiter.allow(ip, perMinute, 60_000)) throw new HttpError(429, 'rate')

    if (path === '/api/admin' && method === 'GET' && !url.pathname.endsWith('/')) {
      res.writeHead(301, { Location: '/api/admin/' })
      return res.end()
    }
    const panel = PANEL_FILES[url.pathname]
    if (panel && method === 'GET') {
      const body = panelFile(panel.file)
      if (!body) throw new HttpError(404, 'not_found')
      res.writeHead(200, { 'Content-Type': panel.type, 'Content-Length': body.length, ...PANEL_HEADERS })
      return res.end(body)
    }
    if (path.startsWith('/api/v1/admin/')) return adminRoute(req, res, url, path.slice('/api/v1/admin'.length), method, ip)

    if (path === '/api/v1/players' && method === 'POST') {
      if (!limiter.allow(`new:${ip}`, playersPerHour, 3_600_000)) throw new HttpError(429, 'rate')
      const raw = await readRaw(req)
      const body = parseJson(raw) as Json
      const name = cleanName(body.name)
      if (!name) throw new HttpError(422, 'name')
      // Play Integrity: jeton bu gövdenin özetine bağlı (bkz. integrity.ts)
      const token = req.headers['x-integrity-token']
      const verdict = await integrity.check(typeof token === 'string' ? token : undefined, raw)
      if (!verdict.ok && integrity.mode === 'enforce') throw new HttpError(403, 'integrity')
      const player = store.createPlayer(name)
      if (!player) throw new HttpError(409, 'name_taken')
      return send(res, 201, player)
    }

    if (path === '/api/v1/players/me' && method === 'PATCH') {
      const me = auth(req, true)!
      const body = (await readJson(req)) as Json
      const name = cleanName(body.name)
      if (!name) throw new HttpError(422, 'name')
      if (!store.rename(me.id, name)) throw new HttpError(409, 'name_taken')
      return send(res, 200, { name })
    }

    if (path === '/api/v1/players/me' && method === 'DELETE') {
      const me = auth(req, true)!
      store.deletePlayer(me.id)
      return send(res, 200, { ok: true })
    }

    if (path === '/api/v1/players/me/scores' && method === 'PUT') {
      const me = auth(req, true)!
      const snapshot = parseSnapshot(await readJson(req))
      if (typeof snapshot === 'string') throw new HttpError(422, snapshot)
      store.saveScores(me.id, snapshot)
      return send(res, 200, { ok: true, grants: store.pendingGrants(me.id) })
    }

    if (path === '/api/v1/players/me/grants/ack' && method === 'POST') {
      const me = auth(req, true)!
      const ids = ((await readJson(req)) as Json).ids
      if (!Array.isArray(ids) || ids.length > 100 || !ids.every((i) => Number.isSafeInteger(i))) throw new HttpError(422, 'ids')
      store.claimGrants(me.id, ids as number[])
      return send(res, 200, { ok: true })
    }

    const board = path.match(/^\/api\/v1\/boards\/([a-z]+)$/)?.[1] as Board | undefined
    if (board && method === 'GET') {
      if (!BOARDS.includes(board)) throw new HttpError(404, 'board')
      // Tablolar da yalnız kayıtlı oyuncuya (2026-11-08): dışarıdan oyuncu adları toplanamasın
      const me = auth(req, true)!
      const player = store.player(board, me.id)
      const near = url.searchParams.get('scope') === 'near' && player != null
      const entries = near
        ? store.page(board, Math.max(0, player.rank - 1 - NEAR_ABOVE), NEAR_ROWS, me.id)
        : store.page(board, 0, TOP_ROWS, me.id)
      return send(res, 200, { entries, player })
    }

    throw new HttpError(404, 'not_found')
  }

  async function adminRoute(req: IncomingMessage, res: ServerResponse, url: URL, path: string, method: string, ip: string) {
    // Başka siteden gönderilen istek (CSRF): çerez SameSite=Strict, ayrıca JSON ve kaynak denetimi
    if (method !== 'GET') {
      const sentOrigin = req.headers.origin
      if (sentOrigin && sentOrigin !== origin) throw new HttpError(403, 'origin')
      if (!(req.headers['content-type'] ?? '').startsWith('application/json')) throw new HttpError(415, 'json')
    }
    const cookieAttrs = `Path=/api; HttpOnly; SameSite=Strict${secure ? '; Secure' : ''}`

    if (path === '/login' && method === 'POST') {
      if (!limiter.allow(`login:${ip}`, loginsPer15Min, 15 * 60_000)) throw new HttpError(429, 'rate')
      const body = (await readJson(req)) as Json
      const username = typeof body.username === 'string' ? body.username.trim().toLowerCase().slice(0, 64) : ''
      const password = typeof body.password === 'string' ? body.password.slice(0, 256) : ''
      // Dağıtık kaba kuvvete karşı kullanıcı adı başına da sınır; scrypt belleği için aynı anda en çok 4 giriş
      if (!limiter.allow(`login-user:${username}`, loginsPerUserHour, 3_600_000)) throw new HttpError(429, 'rate')
      if (loginsInFlight >= 4) throw new HttpError(429, 'busy')
      loginsInFlight++
      let result
      try {
        result = username && password ? await admins.login(username, password) : null
      } finally {
        loginsInFlight--
      }
      if (!result) throw new HttpError(401, 'login')
      return send(res, 200, { username: result.admin.username, role: result.admin.role }, {
        'Set-Cookie': `${SESSION_COOKIE}=${result.token}; ${cookieAttrs}; Max-Age=${7 * 86_400}`,
      })
    }

    const token = cookie(req, SESSION_COOKIE)
    const admin: Admin | null = token ? admins.session(token) : null
    if (!admin) throw new HttpError(401, 'auth')
    const requireAdmin = () => { if (admin.role !== 'admin') throw new HttpError(403, 'role') }

    if (path === '/logout' && method === 'POST') {
      admins.logout(token!)
      return send(res, 200, { ok: true }, { 'Set-Cookie': `${SESSION_COOKIE}=; ${cookieAttrs}; Max-Age=0` })
    }
    if (path === '/me' && method === 'GET') return send(res, 200, { username: admin.username, role: admin.role })
    if (path === '/summary' && method === 'GET') return send(res, 200, { ...admins.summary(), integrity: integrity.stats() })

    // Postman/elle deneme için oyuncu (Play Integrity zorunluyken uygulama dışından kayıt olunamaz). Yalnız admin.
    if (path === '/test-players' && method === 'POST') {
      requireAdmin()
      const name = cleanName(((await readJson(req)) as Json).name)
      if (!name) throw new HttpError(422, 'name')
      const player = store.createPlayer(name)
      if (!player) throw new HttpError(409, 'name_taken')
      console.log(`admin ${admin.username}: deneme oyuncusu ${player.id}`)
      return send(res, 201, player)
    }

    const manage = path.match(/^\/players\/([0-9a-f-]{36})$/)
    if (manage && method === 'DELETE') {
      requireAdmin()
      if (!admins.player(manage[1])) throw new HttpError(404, 'player')
      store.deletePlayer(manage[1])
      console.log(`admin ${admin.username}: oyuncu silindi ${manage[1]}`)
      return send(res, 200, { ok: true })
    }
    if (manage && method === 'PATCH') {
      requireAdmin()
      const hidden = ((await readJson(req)) as Json).hidden
      if (typeof hidden !== 'boolean') throw new HttpError(422, 'hidden')
      if (!store.setHidden(manage[1], hidden)) throw new HttpError(404, 'player')
      return send(res, 200, { hidden })
    }

    if (path === '/players' && method === 'GET') {
      const sort = url.searchParams.get('sort') ?? 'total'
      const offset = Number(url.searchParams.get('offset') ?? 0)
      return send(res, 200, admins.players({
        q: (url.searchParams.get('q') ?? '').slice(0, 40),
        sort: isSort(sort) ? sort : 'total',
        desc: url.searchParams.get('dir') !== 'asc',
        offset: Number.isSafeInteger(offset) && offset >= 0 ? offset : 0,
        limit: 50,
      }))
    }

    const detail = path.match(/^\/players\/([0-9a-f-]{36})$/)
    if (detail && method === 'GET') {
      const data = admins.player(detail[1])
      if (!data) throw new HttpError(404, 'player')
      return send(res, 200, data)
    }

    const grant = path.match(/^\/players\/([0-9a-f-]{36})\/grants$/)
    if (grant && method === 'POST') {
      requireAdmin()
      const body = (await readJson(req)) as Json
      const amount = body.amount
      if (typeof amount !== 'number' || !Number.isInteger(amount) || amount < 1 || amount > MAX_GRANT) throw new HttpError(422, 'amount')
      const note = typeof body.note === 'string' ? body.note.replace(/\s+/g, ' ').trim().slice(0, NOTE_MAX) : ''
      const id = admins.grant(grant[1], amount, note, admin)
      if (id == null) throw new HttpError(404, 'player')
      return send(res, 201, { id })
    }

    const revoke = path.match(/^\/grants\/(\d+)$/)
    if (revoke && method === 'DELETE') {
      requireAdmin()
      if (!admins.revokeGrant(Number(revoke[1]))) throw new HttpError(409, 'delivered')
      return send(res, 200, { ok: true })
    }

    throw new HttpError(404, 'not_found')
  }

  return createServer((req, res) => {
    handle(req, res).catch((e: unknown) => {
      if (e instanceof HttpError) return send(res, e.status, { error: e.code })
      console.error(e)
      send(res, 500, { error: 'server' })
    })
  })
}

if (import.meta.main) {
  const store = new Store(process.env.DB_PATH ?? '/data/wordvoya.db')
  const port = Number(process.env.PORT ?? 8080)
  const mode = (process.env.INTEGRITY_MODE ?? 'off') as IntegrityMode
  if (!INTEGRITY_MODES.includes(mode)) throw new Error(`INTEGRITY_MODE: ${mode}`)
  let integrity: IntegrityChecker
  try {
    integrity = createIntegrityChecker({ mode, packageName: PACKAGE_NAME, keyFile: process.env.INTEGRITY_KEY_FILE })
  } catch (e) {
    // Anahtar okunamazsa: "report" denetimsiz sürer; "enforce" KAPALI KALIR (kayıt hiç açılmaz), sessizce gevşemez
    console.error(`Play Integrity anahtarı okunamadı (${mode}): ${(e as Error).message}`)
    integrity = mode === 'enforce' ? failClosedChecker('no_key') : createIntegrityChecker({ mode: 'off', packageName: PACKAGE_NAME })
  }
  // Yerel deneme: ADMIN_ORIGIN=http://localhost:8099 (canlıda varsayılan https://wordvoya.com)
  createApp(store, { origin: process.env.ADMIN_ORIGIN, integrity })
    .listen(port, () => console.log(`wordvoya-api :${port}, ${store.count()} oyuncu, Play Integrity: ${mode}`))
  const stop = () => { store.close(); process.exit(0) }
  process.on('SIGTERM', stop)
  process.on('SIGINT', stop)
}

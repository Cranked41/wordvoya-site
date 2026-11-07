// Wordvoya skor tablosu API'si (wordvoya.com/api/v1). Bağımlılıksız: node:http + node:sqlite.
// Oyuncu kendi seçtiği adla görünür; kimlik cihazda üretilen gizli belirteçtir (sunucuda yalnız özeti tutulur).
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { BOARDS, type Board, Store } from './db.ts'
import { cleanName, parseSnapshot } from './validate.ts'

const MAX_BODY = 4096
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

/** IP başına kayan pencereli basit sınır (tek süreç, bellekte). */
class Limiter {
  private hits = new Map<string, number[]>()
  private now: () => number
  constructor(now: () => number) { this.now = now }
  allow(key: string, max: number, windowMs: number): boolean {
    const t = this.now()
    const list = (this.hits.get(key) ?? []).filter((x) => t - x < windowMs)
    if (list.length >= max) { this.hits.set(key, list); return false }
    list.push(t)
    this.hits.set(key, list)
    if (this.hits.size > 50_000) this.hits.clear()
    return true
  }
}

async function readJson(req: IncomingMessage): Promise<unknown> {
  let size = 0
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    size += (chunk as Buffer).length
    if (size > MAX_BODY) throw new HttpError(413, 'too_large')
    chunks.push(chunk as Buffer)
  }
  if (size === 0) return {}
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')) } catch { throw new HttpError(400, 'json') }
}

function send(res: ServerResponse, status: number, body: Json) {
  const text = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(text),
  })
  res.end(text)
}

export function createApp(store: Store, opts: { now?: () => number; perMinute?: number; playersPerHour?: number } = {}) {
  const now = opts.now ?? Date.now
  const limiter = new Limiter(now)
  const perMinute = opts.perMinute ?? 120
  const playersPerHour = opts.playersPerHour ?? 10

  const auth = (req: IncomingMessage, required: boolean) => {
    const header = req.headers.authorization ?? ''
    const token = header.startsWith('Bearer ') ? header.slice(7).trim() : ''
    const player = token ? store.playerByToken(token) : undefined
    if (required && !player) throw new HttpError(401, 'auth')
    return player
  }

  async function handle(req: IncomingMessage, res: ServerResponse) {
    const ip = (req.headers['x-real-ip'] as string | undefined) ?? req.socket.remoteAddress ?? '?'
    const url = new URL(req.url ?? '/', 'http://local')
    const path = url.pathname.replace(/\/+$/, '')
    const method = req.method ?? 'GET'

    if (path === '/api/v1/health') return send(res, 200, { ok: true })
    if (!limiter.allow(ip, perMinute, 60_000)) throw new HttpError(429, 'rate')

    if (path === '/api/v1/players' && method === 'POST') {
      if (!limiter.allow(`new:${ip}`, playersPerHour, 3_600_000)) throw new HttpError(429, 'rate')
      const body = (await readJson(req)) as Json
      const name = cleanName(body.name)
      if (!name) throw new HttpError(422, 'name')
      return send(res, 201, store.createPlayer(name))
    }

    if (path === '/api/v1/players/me' && method === 'PATCH') {
      const me = auth(req, true)!
      const body = (await readJson(req)) as Json
      const name = cleanName(body.name)
      if (!name) throw new HttpError(422, 'name')
      store.rename(me.id, name)
      return send(res, 200, { name })
    }

    if (path === '/api/v1/players/me/scores' && method === 'PUT') {
      const me = auth(req, true)!
      const snapshot = parseSnapshot(await readJson(req))
      if (typeof snapshot === 'string') throw new HttpError(422, snapshot)
      store.saveScores(me.id, snapshot)
      return send(res, 200, { ok: true })
    }

    const board = path.match(/^\/api\/v1\/boards\/([a-z]+)$/)?.[1] as Board | undefined
    if (board && method === 'GET') {
      if (!BOARDS.includes(board)) throw new HttpError(404, 'board')
      const me = auth(req, false)
      const player = me ? store.player(board, me.id) : null
      const near = url.searchParams.get('scope') === 'near' && player != null
      const entries = near
        ? store.page(board, Math.max(0, player.rank - 1 - NEAR_ABOVE), NEAR_ROWS, me?.id)
        : store.page(board, 0, TOP_ROWS, me?.id)
      return send(res, 200, { entries, player })
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
  createApp(store).listen(port, () => console.log(`wordvoya-api :${port}, ${store.count()} oyuncu`))
  const stop = () => { store.close(); process.exit(0) }
  process.on('SIGTERM', stop)
  process.on('SIGINT', stop)
}

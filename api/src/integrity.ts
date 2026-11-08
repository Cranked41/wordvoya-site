// Play Integrity: yeni oyuncu kaydının Play'den indirilmiş gerçek Wordvoya'dan geldiğini Google'a doğrulatır.
// Uygulama Standard API ile kayıt gövdesinin SHA-256 özetine bağlı bir jeton alır (X-Integrity-Token başlığı);
// sunucu jetonu Google'ın decodeIntegrityToken ucuyla çözer ve kararı denetler.
//
// Modlar (INTEGRITY_MODE): off = denetim yok; report = denetler, sonucu sayar, kaydı engellemez;
// enforce = geçmeyen kayıt 403. Google'a ulaşılamazsa enforce kapalı kalır (fail closed).
import { createHash, createSign } from 'node:crypto'
import { readFileSync } from 'node:fs'

export type IntegrityMode = 'off' | 'report' | 'enforce'
export const INTEGRITY_MODES: readonly IntegrityMode[] = ['off', 'report', 'enforce']

export interface Verdict { ok: boolean; reason: string }

export interface IntegrityChecker {
  readonly mode: IntegrityMode
  check(token: string | undefined, rawBody: Buffer): Promise<Verdict>
  /** Panel için: modun ve son açılıştan beri sonuçların sayısı. */
  stats(): { mode: IntegrityMode; results: Record<string, number> }
}

interface ServiceAccount { client_email: string; private_key: string; token_uri?: string }

/** Google'ın çözdüğü jetonun ilgili alanları (tokenPayloadExternal). */
export interface IntegrityPayload {
  requestDetails?: { requestPackageName?: string; requestHash?: string; timestampMillis?: string | number }
  appIntegrity?: { appRecognitionVerdict?: string }
  deviceIntegrity?: { deviceRecognitionVerdict?: string[] }
}

const SCOPE = 'https://www.googleapis.com/auth/playintegrity'
const DEVICE_OK = new Set(['MEETS_BASIC_INTEGRITY', 'MEETS_DEVICE_INTEGRITY', 'MEETS_STRONG_INTEGRITY'])
const MAX_TOKEN = 8192

/** Gövdede rastgele nonce şart: aynı gövde iki kez gelmesin (tekrar denetimi gövde özetine bakar). */
function hasNonce(rawBody: Buffer): boolean {
  try {
    const nonce = (JSON.parse(rawBody.toString('utf8')) as { nonce?: unknown }).nonce
    return typeof nonce === 'string' && /^[0-9a-f]{16,64}$/.test(nonce)
  } catch {
    return false
  }
}

/** Zorunlu mod istendi ama anahtar yok: her kayıt reddedilir (fail closed), panelde sebep görünür. */
export function failClosedChecker(reason: string): IntegrityChecker {
  const results: Record<string, number> = {}
  return {
    mode: 'enforce',
    stats: () => ({ mode: 'enforce', results: { ...results } }),
    async check() {
      results[reason] = (results[reason] ?? 0) + 1
      return { ok: false, reason }
    },
  }
}

export const sha256Hex = (data: Buffer | string) => createHash('sha256').update(data).digest('hex')
const b64url = (data: Buffer | string) => Buffer.from(data).toString('base64url')

/**
 * Çözülmüş jetonun kararı. Saf fonksiyon: testler Google'a gitmeden bunu dener.
 * Cihazda en az temel bütünlük yeter (köklenmiş ya da özel ROM'lu cihazlar dışarıda kalır, emülatörler de).
 */
export function evaluate(payload: IntegrityPayload, opts: { packageName: string; rawBody: Buffer; now: number; maxAgeMs: number }): Verdict {
  const rd = payload.requestDetails
  if (!rd) return { ok: false, reason: 'no_details' }
  if (rd.requestPackageName !== opts.packageName) return { ok: false, reason: 'package' }
  if (rd.requestHash !== sha256Hex(opts.rawBody)) return { ok: false, reason: 'hash' }
  const ts = Number(rd.timestampMillis)
  if (!Number.isFinite(ts) || opts.now - ts > opts.maxAgeMs || ts - opts.now > 60_000) return { ok: false, reason: 'stale' }
  if (payload.appIntegrity?.appRecognitionVerdict !== 'PLAY_RECOGNIZED') return { ok: false, reason: 'app' }
  const device = payload.deviceIntegrity?.deviceRecognitionVerdict ?? []
  if (!device.some((v) => DEVICE_OK.has(v))) return { ok: false, reason: 'device' }
  return { ok: true, reason: 'ok' }
}

export function createIntegrityChecker(opts: {
  mode: IntegrityMode
  packageName: string
  /** Servis hesabı anahtarı (JSON); mode off değilse gerekir. */
  keyFile?: string
  now?: () => number
  fetch?: typeof fetch
  /** Testler için: Google çağrısı yerine. */
  decode?: (token: string) => Promise<IntegrityPayload>
  maxAgeMs?: number
}): IntegrityChecker {
  const now = opts.now ?? Date.now
  const fetchImpl = opts.fetch ?? fetch
  const maxAgeMs = opts.maxAgeMs ?? 5 * 60_000
  const results: Record<string, number> = {}
  // Aynı jeton (aynı gövde + rastgele nonce) ikinci kez kullanılamaz; jeton zaten maxAgeMs sonra bayatlar
  const seen = new Map<string, number>()

  let account: ServiceAccount | null = null
  if (opts.mode !== 'off' && !opts.decode) {
    if (!opts.keyFile) throw new Error('INTEGRITY_KEY_FILE gerekli (mode ' + opts.mode + ')')
    account = JSON.parse(readFileSync(opts.keyFile, 'utf8')) as ServiceAccount
    if (!account.client_email || !account.private_key) throw new Error('Servis hesabı anahtarı eksik alanlı')
  }

  let access: { token: string; until: number } | null = null
  async function accessToken(): Promise<string> {
    if (access && access.until > now()) return access.token
    const a = account!
    const aud = a.token_uri ?? 'https://oauth2.googleapis.com/token'
    const iat = Math.floor(now() / 1000)
    const head = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
    const claims = b64url(JSON.stringify({ iss: a.client_email, scope: SCOPE, aud, iat, exp: iat + 3600 }))
    const signature = createSign('RSA-SHA256').update(`${head}.${claims}`).sign(a.private_key).toString('base64url')
    const res = await fetchImpl(aud, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${head}.${claims}.${signature}` }),
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) throw new Error(`oauth ${res.status}`)
    const body = (await res.json()) as { access_token: string; expires_in: number }
    access = { token: body.access_token, until: now() + (body.expires_in - 120) * 1000 }
    return access.token
  }

  async function decode(token: string): Promise<IntegrityPayload> {
    if (opts.decode) return opts.decode(token)
    const res = await fetchImpl(`https://playintegrity.googleapis.com/v1/${opts.packageName}:decodeIntegrityToken`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${await accessToken()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ integrity_token: token }),
      signal: AbortSignal.timeout(5000),
    })
    if (res.status === 400) return {}   // bozuk ya da başka uygulamanın jetonu
    if (!res.ok) throw new Error(`decode ${res.status}`)
    return ((await res.json()) as { tokenPayloadExternal?: IntegrityPayload }).tokenPayloadExternal ?? {}
  }

  const count = (reason: string) => { results[reason] = (results[reason] ?? 0) + 1 }

  return {
    mode: opts.mode,
    stats: () => ({ mode: opts.mode, results: { ...results } }),
    async check(token, rawBody) {
      if (opts.mode === 'off') return { ok: true, reason: 'off' }
      let verdict: Verdict
      if (!token) verdict = { ok: false, reason: 'missing' }
      else if (!hasNonce(rawBody)) verdict = { ok: false, reason: 'nonce' }
      else if (token.length > MAX_TOKEN) verdict = { ok: false, reason: 'malformed' }
      else {
        try {
          verdict = evaluate(await decode(token), { packageName: opts.packageName, rawBody, now: now(), maxAgeMs })
        } catch (e) {
          console.error('integrity:', (e as Error).message)
          verdict = { ok: false, reason: 'google_unavailable' }
        }
        if (verdict.ok) {
          const t = now()
          for (const [k, until] of seen) if (until < t) seen.delete(k)
          const key = sha256Hex(rawBody)
          if (seen.has(key)) verdict = { ok: false, reason: 'replay' }
          else seen.set(key, t + maxAgeMs)
        }
      }
      count(verdict.reason)
      return verdict
    },
  }
}

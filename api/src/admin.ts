// Yönetim paneli: yönetici hesapları, oturumlar ve oyuncu verisi. Panel sayfası /api/admin/, uçları /api/v1/admin/.
// Roller: admin (görür, elmas verir), viewer (yalnız görür). Hesaplar sunucuda admin-cli.ts ile açılır.
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { hashToken, type PlayerRow, type Store, weekOf, BOARDS } from './db.ts'
import { nameKey } from './validate.ts'

export type Role = 'admin' | 'viewer'
export const ROLES: readonly Role[] = ['admin', 'viewer']

export interface Admin { id: number; username: string; role: Role }

const SESSION_MS = 7 * 86_400_000
export const PASSWORD_MIN = 10
export const USERNAME_PATTERN = /^[a-z0-9._-]{3,32}$/

// scrypt N=2^14, r=8: ~16 MB bellek, sunucuda ~50 ms (konteyner 128 MB)
const SCRYPT = { N: 16_384, r: 8, p: 1 }
const scryptAsync = promisify(scrypt) as (pw: string, salt: Buffer, len: number, opts: typeof SCRYPT) => Promise<Buffer>

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16)
  const hash = await scryptAsync(password, salt, 32, SCRYPT)
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString('base64')}$${hash.toString('base64')}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [kind, n, r, p, salt, hash] = stored.split('$')
  if (kind !== 'scrypt' || !salt || !hash) return false
  const expected = Buffer.from(hash, 'base64')
  const actual = await scryptAsync(password, Buffer.from(salt, 'base64'), expected.length, { N: Number(n), r: Number(r), p: Number(p) })
  return timingSafeEqual(actual, expected)
}

// Bilinmeyen kullanıcı adında da aynı süre harcansın (kullanıcı adı yoklanamasın)
let dummyHash: Promise<string> | null = null

type Sort = 'total' | 'weekly' | 'level' | 'words' | 'diamonds' | 'seen' | 'created' | 'name'
const SORTS: Record<Sort, string> = {
  total: 'p.total', weekly: 'weekly_now', level: 'p.level', words: 'p.words',
  diamonds: 'COALESCE(p.diamonds, -1)', seen: 'COALESCE(p.seen_at, 0)', created: 'p.created_at', name: 'p.name_key',
}
export const isSort = (s: string): s is Sort => s in SORTS

export class AdminStore {
  private store: Store

  constructor(store: Store) {
    this.store = store
    store.db.exec(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        pass_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'viewer')),
        created_at INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS admin_sessions (
        token_hash TEXT PRIMARY KEY,
        admin_id INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        expires_at INTEGER NOT NULL
      );
    `)
  }

  private get db() { return this.store.db }
  private now() { return this.store.now() }

  // --- Hesaplar (admin-cli.ts) ---

  async addAdmin(username: string, password: string, role: Role) {
    this.db.prepare('INSERT INTO admins (username, pass_hash, role, created_at) VALUES (?, ?, ?, ?)')
      .run(username, await hashPassword(password), role, this.now())
  }

  async setPassword(username: string, password: string): Promise<boolean> {
    const r = this.db.prepare('UPDATE admins SET pass_hash = ? WHERE username = ?').run(await hashPassword(password), username)
    if (r.changes) this.endSessionsOf(username)   // eski şifreyle açık oturumlar kapanır
    return r.changes > 0
  }

  setRole(username: string, role: Role): boolean {
    return this.db.prepare('UPDATE admins SET role = ? WHERE username = ?').run(role, username).changes > 0
  }

  removeAdmin(username: string): boolean {
    this.endSessionsOf(username)
    return this.db.prepare('DELETE FROM admins WHERE username = ?').run(username).changes > 0
  }

  listAdmins(): (Admin & { created_at: number })[] {
    return this.db.prepare('SELECT id, username, role, created_at FROM admins ORDER BY id').all() as never
  }

  private endSessionsOf(username: string) {
    this.db.prepare('DELETE FROM admin_sessions WHERE admin_id IN (SELECT id FROM admins WHERE username = ?)').run(username)
  }

  // --- Oturum ---

  /** Doğruysa oturum belirteci; değilse null. */
  async login(username: string, password: string): Promise<{ token: string; admin: Admin } | null> {
    const row = this.db.prepare('SELECT id, username, role, pass_hash FROM admins WHERE username = ?').get(username) as
      (Admin & { pass_hash: string }) | undefined
    if (!row) {
      dummyHash ??= hashPassword(randomBytes(16).toString('hex'))
      await verifyPassword(password, await dummyHash)
      return null
    }
    if (!(await verifyPassword(password, row.pass_hash))) return null
    const t = this.now()
    this.db.prepare('DELETE FROM admin_sessions WHERE expires_at < ?').run(t)
    const token = randomBytes(32).toString('base64url')
    this.db.prepare('INSERT INTO admin_sessions (token_hash, admin_id, created_at, expires_at) VALUES (?, ?, ?, ?)')
      .run(hashToken(token), row.id, t, t + SESSION_MS)
    return { token, admin: { id: row.id, username: row.username, role: row.role } }
  }

  session(token: string): Admin | null {
    const row = this.db.prepare(`
      SELECT a.id, a.username, a.role FROM admin_sessions s JOIN admins a ON a.id = s.admin_id
      WHERE s.token_hash = ? AND s.expires_at > ?`).get(hashToken(token), this.now()) as Admin | undefined
    return row ?? null
  }

  logout(token: string) {
    this.db.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').run(hashToken(token))
  }

  // --- Oyuncu verisi ---

  summary() {
    const t = this.now()
    const week = weekOf(t)
    const one = (sql: string, ...params: number[]) => (this.db.prepare(sql).get(...params) as { n: number | null }).n ?? 0
    return {
      players: one('SELECT COUNT(*) AS n FROM players'),
      active1d: one('SELECT COUNT(*) AS n FROM players WHERE seen_at > ?', t - 86_400_000),
      active7d: one('SELECT COUNT(*) AS n FROM players WHERE seen_at > ?', t - 7 * 86_400_000),
      playingThisWeek: one('SELECT COUNT(*) AS n FROM players WHERE week = ? AND weekly > 0', week),
      diamondsHeld: one('SELECT SUM(diamonds) AS n FROM players'),
      diamondsGranted: one('SELECT SUM(amount) AS n FROM grants'),
      grantsPending: one('SELECT COUNT(*) AS n FROM grants WHERE claimed_at IS NULL'),
    }
  }

  players(opts: { q: string; sort: Sort; desc: boolean; offset: number; limit: number }) {
    const week = weekOf(this.now())
    const key = nameKey(opts.q)
    const where = key ? `WHERE p.name_key LIKE ? ESCAPE '\\'` : ''
    const params: (string | number)[] = key ? [`%${key.replace(/[\\%_]/g, (c) => `\\${c}`)}%`] : []
    const total = (this.db.prepare(`SELECT COUNT(*) AS n FROM players p ${where}`).get(...params) as { n: number }).n
    const rows = this.db.prepare(`
      SELECT p.*, CASE WHEN p.week = ? THEN p.weekly ELSE 0 END AS weekly_now,
        (SELECT COUNT(*) FROM level_results l WHERE l.player_id = p.id) AS levels_recorded,
        (SELECT COALESCE(SUM(amount), 0) FROM grants g WHERE g.player_id = p.id) AS granted
      FROM players p ${where}
      ORDER BY ${SORTS[opts.sort]} ${opts.desc ? 'DESC' : 'ASC'}, p.created_at ASC, p.id ASC
      LIMIT ? OFFSET ?`).all(week, ...params, opts.limit, opts.offset) as unknown as (PlayerRow & PanelExtra)[]
    return {
      total,
      players: rows.map((p) => ({ ...this.publicPlayer(p), rank: this.store.rankOf('total', p.id) })),
    }
  }

  player(id: string) {
    const week = weekOf(this.now())
    const p = this.db.prepare(`
      SELECT p.*, CASE WHEN p.week = ? THEN p.weekly ELSE 0 END AS weekly_now,
        (SELECT COUNT(*) FROM level_results l WHERE l.player_id = p.id) AS levels_recorded,
        (SELECT COALESCE(SUM(amount), 0) FROM grants g WHERE g.player_id = p.id) AS granted
      FROM players p WHERE p.id = ?`).get(week, id) as (PlayerRow & PanelExtra) | undefined
    if (!p) return null
    const ranks = Object.fromEntries(BOARDS.map((b) => [b, this.store.rankOf(b, p.id)]))
    const levels = this.db.prepare(
      'SELECT level, score, seconds, first_at, best_at FROM level_results WHERE player_id = ? ORDER BY level DESC',
    ).all(id)
    const grants = this.db.prepare(
      'SELECT id, amount, note, admin, created_at, claimed_at FROM grants WHERE player_id = ? ORDER BY id DESC',
    ).all(id)
    return { player: { ...this.publicPlayer(p), ranks }, levels, grants }
  }

  /** Oyuncuya elmas hediye eder; uygulama bir sonraki senkronda alır. */
  grant(playerId: string, amount: number, note: string, admin: Admin): number | null {
    const exists = this.db.prepare('SELECT 1 FROM players WHERE id = ?').get(playerId)
    if (!exists) return null
    const r = this.db.prepare('INSERT INTO grants (player_id, amount, note, admin, created_at) VALUES (?, ?, ?, ?, ?)')
      .run(playerId, amount, note, admin.username, this.now())
    return Number(r.lastInsertRowid)
  }

  /** Henüz alınmamış hediyeyi geri çeker. */
  revokeGrant(grantId: number): boolean {
    return this.db.prepare('DELETE FROM grants WHERE id = ? AND claimed_at IS NULL').run(grantId).changes > 0
  }

  private publicPlayer(p: PlayerRow & PanelExtra) {
    return {
      id: p.id,
      name: p.name,
      hidden: p.hidden === 1,
      total: p.total,
      weekly: p.weekly_now,
      level: p.level,
      words: p.words,
      diamonds: p.diamonds,
      diamondsAt: p.diamonds_at,
      last: p.last_level != null ? { level: p.last_level, seconds: p.last_seconds, score: p.last_score } : null,
      levelsRecorded: p.levels_recorded,
      granted: p.granted,
      createdAt: p.created_at,
      seenAt: p.seen_at,
    }
  }
}

interface PanelExtra { weekly_now: number; levels_recorded: number; granted: number }

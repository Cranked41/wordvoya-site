// Skor tablosunun veritabanı: tek SQLite dosyası (oyuncu sayısı binlerle sınırlıyken yeterli ve bakımsız).
import { DatabaseSync } from 'node:sqlite'
import { createHash, randomBytes, randomUUID } from 'node:crypto'

export type Board = 'total' | 'weekly' | 'level' | 'words'
export const BOARDS: readonly Board[] = ['total', 'weekly', 'level', 'words']

export interface Last { level: number; seconds: number; score: number }

export interface Snapshot {
  total: number
  weekly: number
  week: number
  level: number
  words: number
  last: Last | null
}

export interface Row {
  rank: number
  name: string
  score: number
  last: Last | null
  me: boolean
}

interface PlayerRow {
  id: string
  name: string
  created_at: number
  total: number
  weekly: number
  week: number
  level: number
  words: number
  last_level: number | null
  last_seconds: number | null
  last_score: number | null
}

/** Uygulamanın ScoreRepository.weekOf ile aynı: Play Games haftası, pazar 00:00 UTC−7'de döner. */
export function weekOf(ms: number): number {
  const RESET_OFFSET_MS = 7 * 3_600_000
  const DAY_MS = 86_400_000
  return Math.floor((Math.floor((ms - RESET_OFFSET_MS) / DAY_MS) + 4) / 7)
}

export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex')

export class Store {
  private db: DatabaseSync
  private now: () => number

  constructor(path: string, now: () => number = Date.now) {
    this.now = now
    this.db = new DatabaseSync(path)
    this.db.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA busy_timeout = 3000;
      CREATE TABLE IF NOT EXISTS players (
        id TEXT PRIMARY KEY,
        token_hash TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        hidden INTEGER NOT NULL DEFAULT 0,
        total INTEGER NOT NULL DEFAULT 0,
        weekly INTEGER NOT NULL DEFAULT 0,
        week INTEGER NOT NULL DEFAULT 0,
        level INTEGER NOT NULL DEFAULT 0,
        words INTEGER NOT NULL DEFAULT 0,
        last_level INTEGER,
        last_seconds INTEGER,
        last_score INTEGER
      );
      CREATE INDEX IF NOT EXISTS players_total ON players (total DESC, created_at);
      CREATE INDEX IF NOT EXISTS players_weekly ON players (week, weekly DESC, created_at);
      CREATE INDEX IF NOT EXISTS players_level ON players (level DESC, created_at);
      CREATE INDEX IF NOT EXISTS players_words ON players (words DESC, created_at);
    `)
  }

  close() { this.db.close() }

  createPlayer(name: string): { id: string; token: string; name: string } {
    const id = randomUUID()
    const token = randomBytes(32).toString('base64url')
    const t = this.now()
    this.db.prepare('INSERT INTO players (id, token_hash, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)')
      .run(id, hashToken(token), name, t, t)
    return { id, token, name }
  }

  playerByToken(token: string): PlayerRow | undefined {
    return this.db.prepare('SELECT * FROM players WHERE token_hash = ?').get(hashToken(token)) as PlayerRow | undefined
  }

  rename(id: string, name: string) {
    this.db.prepare('UPDATE players SET name = ?, updated_at = ? WHERE id = ?').run(name, this.now(), id)
  }

  /**
   * Cihazdaki toplamları kaydeder. Her tablo oyuncunun en iyisini tutar (Play Games gibi): ilerlemesini sıfırlayan
   * oyuncu tablodan düşmez. Haftalık puan yalnız sunucunun haftasıyla aynıysa sayılır.
   */
  saveScores(id: string, s: Snapshot) {
    const p = this.db.prepare('SELECT * FROM players WHERE id = ?').get(id) as unknown as PlayerRow
    const current = weekOf(this.now())
    let week = p.week
    let weekly = p.week === current ? p.weekly : 0
    if (p.week !== current) week = current
    if (s.week === current) weekly = Math.max(weekly, s.weekly)
    const total = Math.max(p.total, s.total)
    const improved = s.total > p.total
    const last = improved && s.last ? s.last : null
    this.db.prepare(`
      UPDATE players SET total = ?, weekly = ?, week = ?, level = ?, words = ?, updated_at = ?,
        last_level = COALESCE(?, last_level), last_seconds = COALESCE(?, last_seconds), last_score = COALESCE(?, last_score)
      WHERE id = ?`).run(
      total, weekly, week, Math.max(p.level, s.level), Math.max(p.words, s.words), this.now(),
      last?.level ?? null, last?.seconds ?? null, last?.score ?? null, id,
    )
  }

  private column(board: Board): string {
    return board === 'total' ? 'total' : board === 'weekly' ? 'weekly' : board === 'level' ? 'level' : 'words'
  }

  /** Tablodaki oyuncular: gizlenmemiş, puanı olan (haftalıkta bu hafta puanı olan). */
  private filter(board: Board): { where: string; params: number[] } {
    const col = this.column(board)
    if (board === 'weekly') return { where: `hidden = 0 AND week = ? AND ${col} > 0`, params: [weekOf(this.now())] }
    return { where: `hidden = 0 AND ${col} > 0`, params: [] }
  }

  private toRow(p: PlayerRow, board: Board, rank: number, meId?: string): Row {
    const withLast = (board === 'total' || board === 'weekly') && p.last_level != null
    return {
      rank,
      name: p.name,
      score: p[this.column(board) as keyof PlayerRow] as number,
      last: withLast ? { level: p.last_level!, seconds: p.last_seconds!, score: p.last_score! } : null,
      me: p.id === meId,
    }
  }

  /** Oyuncunun sırası (1'den); tabloda değilse null. Eşit puanda önce katılan önde. */
  rankOf(board: Board, id: string): number | null {
    const col = this.column(board)
    const f = this.filter(board)
    const me = this.db.prepare(`SELECT * FROM players WHERE id = ? AND ${f.where}`).get(id, ...f.params) as PlayerRow | undefined
    if (!me) return null
    const score = me[col as keyof PlayerRow] as number
    const ahead = this.db.prepare(
      `SELECT COUNT(*) AS n FROM players WHERE ${f.where} AND (${col} > ? OR (${col} = ? AND (created_at < ? OR (created_at = ? AND id < ?))))`,
    ).get(...f.params, score, score, me.created_at, me.created_at, me.id) as { n: number }
    return ahead.n + 1
  }

  /** [offset]'ten başlayan [limit] satır. */
  page(board: Board, offset: number, limit: number, meId?: string): Row[] {
    const col = this.column(board)
    const f = this.filter(board)
    const rows = this.db.prepare(
      `SELECT * FROM players WHERE ${f.where} ORDER BY ${col} DESC, created_at ASC, id ASC LIMIT ? OFFSET ?`,
    ).all(...f.params, limit, offset) as unknown as PlayerRow[]
    return rows.map((p, i) => this.toRow(p, board, offset + i + 1, meId))
  }

  player(board: Board, id: string): Row | null {
    const rank = this.rankOf(board, id)
    if (rank == null) return null
    const p = this.db.prepare('SELECT * FROM players WHERE id = ?').get(id) as unknown as PlayerRow
    return this.toRow(p, board, rank, id)
  }

  count(): number {
    return (this.db.prepare('SELECT COUNT(*) AS n FROM players').get() as { n: number }).n
  }
}

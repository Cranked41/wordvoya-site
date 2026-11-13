// Skor tablosunun veritabanı: tek SQLite dosyası (oyuncu sayısı binlerle sınırlıyken yeterli ve bakımsız).
import { DatabaseSync } from 'node:sqlite'
import { createHash, randomBytes, randomUUID } from 'node:crypto'
import { nameKey } from './validate.ts'

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
  /** Cihazdaki elmas bakiyesi (eski sürümler göndermez). */
  diamonds: number | null
  /** Son gönderimden beri biten bölümler (eski sürümler göndermez; o zaman yalnız [last] kaydedilir). */
  levels: Last[]
}

export interface Grant { id: number; amount: number; note: string }

export interface Row {
  rank: number
  name: string
  score: number
  last: Last | null
  me: boolean
}

export interface PlayerRow {
  id: string
  name: string
  created_at: number
  updated_at: number
  hidden: number
  diamonds: number | null
  diamonds_at: number | null
  seen_at: number | null
  flags: number
  flagged_at: number | null
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

// Puan artışının üst sınırı. İlk gönderim cihazda birikmiş geçmişi taşır (eski sürümlerden gelenler dahil): cömert
// ama sınırlı. Sonrakiler son gönderimden beri geçen gerçek süreye bağlı; internetsiz oynayan sonra gönderince
// süre de geçmiş olur. Fazlası kırpılır (oyuncu tablodan düşmez) ve panelde şüpheli olarak işaretlenir.
export const IMPORT_MAX_WORDS = 60_000
export const IMPORT_MAX_LEVEL = 3_000
const WORDS_PER_SECOND = 0.5      // saniyede yarım kelime: hızlı bir oyuncunun çok üstü
const SECONDS_PER_LEVEL = 20      // en kısa bölüm ~20 sn
const POINTS_PER_WORD = 15        // kelime 10 + bonus 5 (validate.maxTotal ile aynı mantık)
const POINTS_PER_LEVEL = 110      // hız bonusu en çok 100 + pay

export function growthLimit(p: Pick<PlayerRow, 'words' | 'level' | 'total' | 'seen_at'>, now: number) {
  if (p.seen_at == null) {
    return {
      words: IMPORT_MAX_WORDS,
      level: IMPORT_MAX_LEVEL,
      total: IMPORT_MAX_WORDS * POINTS_PER_WORD + IMPORT_MAX_LEVEL * POINTS_PER_LEVEL,
    }
  }
  const seconds = Math.max(0, (now - p.seen_at) / 1000)
  const words = p.words + 60 + Math.floor(seconds * WORDS_PER_SECOND)
  const level = p.level + 2 + Math.floor(seconds / SECONDS_PER_LEVEL)
  return { words, level, total: p.total + (words - p.words) * POINTS_PER_WORD + (level - p.level) * POINTS_PER_LEVEL }
}

export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex')

/** Benzersizlik kısıtına takılırsa false; eşzamanlı iki kayıtta da doğru sonuç verir. */
function unique(write: () => unknown): boolean {
  try {
    write()
    return true
  } catch (e) {
    if (String((e as Error).message).includes('UNIQUE constraint failed: players.name_key')) return false
    throw e
  }
}

export class Store {
  /** Yönetim paneli ([AdminStore]) aynı bağlantıyı kullanır. */
  readonly db: DatabaseSync
  readonly now: () => number

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
    this.migrateNameKey()
    this.migratePanelData()
  }

  /** 2026-11-08: yönetim paneli için elmas bakiyesi, bölüm sonuçları ve elmas hediyeleri. */
  private migratePanelData() {
    const cols = new Set((this.db.prepare('PRAGMA table_info(players)').all() as { name: string }[]).map((c) => c.name))
    for (const col of ['diamonds', 'diamonds_at', 'seen_at', 'flags', 'flagged_at']) {
      if (!cols.has(col)) this.db.exec(`ALTER TABLE players ADD COLUMN ${col} INTEGER`)
    }
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS level_results (
        player_id TEXT NOT NULL,
        level INTEGER NOT NULL,
        score INTEGER NOT NULL,
        seconds INTEGER NOT NULL,
        first_at INTEGER NOT NULL,
        best_at INTEGER NOT NULL,
        PRIMARY KEY (player_id, level)
      ) WITHOUT ROWID;
      CREATE TABLE IF NOT EXISTS grants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_id TEXT NOT NULL,
        amount INTEGER NOT NULL,
        note TEXT NOT NULL DEFAULT '',
        admin TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        claimed_at INTEGER
      );
      CREATE INDEX IF NOT EXISTS grants_player ON grants (player_id, claimed_at);
    `)
    // 2026-11-08: uygulamaya teslim edilen hediye artık geri alınamaz (oyuncu elmasları almış olabilir)
    const grantCols = (this.db.prepare('PRAGMA table_info(grants)').all() as { name: string }[]).map((c) => c.name)
    if (!grantCols.includes('delivered_at')) this.db.exec('ALTER TABLE grants ADD COLUMN delivered_at INTEGER')
  }

  /** 2026-11-07: aynı adda iki oyuncu olmasın. Eski satırlara anahtar yazılır; çakışan sonrakiler kimlikle ayrılır. */
  private migrateNameKey() {
    const cols = this.db.prepare('PRAGMA table_info(players)').all() as { name: string }[]
    if (!cols.some((c) => c.name === 'name_key')) {
      this.db.exec('ALTER TABLE players ADD COLUMN name_key TEXT')
      const seen = new Set<string>()
      const rows = this.db.prepare('SELECT id, name FROM players ORDER BY created_at, id').all() as { id: string; name: string }[]
      const update = this.db.prepare('UPDATE players SET name_key = ? WHERE id = ?')
      for (const r of rows) {
        let key = nameKey(r.name)
        if (seen.has(key)) key = `${key}#${r.id}`
        seen.add(key)
        update.run(key, r.id)
      }
    }
    this.db.exec('CREATE UNIQUE INDEX IF NOT EXISTS players_name_key ON players (name_key)')
  }


  close() { this.db.close() }

  /** Yeni oyuncu; ad başkasındaysa null. */
  createPlayer(name: string): { id: string; token: string; name: string } | null {
    const id = randomUUID()
    const token = randomBytes(32).toString('base64url')
    const t = this.now()
    const ok = unique(() => this.db.prepare(
      'INSERT INTO players (id, token_hash, name, name_key, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    ).run(id, hashToken(token), name, nameKey(name), t, t))
    return ok ? { id, token, name } : null
  }

  playerByToken(token: string): PlayerRow | undefined {
    return this.db.prepare('SELECT * FROM players WHERE token_hash = ?').get(hashToken(token)) as PlayerRow | undefined
  }

  /** Oyuncunun kaydını tümüyle siler (uygulamada "Tablodan çık"). */
  deletePlayer(id: string) {
    this.db.exec('BEGIN')
    try {
      for (const table of ['level_results', 'grants']) this.db.prepare(`DELETE FROM ${table} WHERE player_id = ?`).run(id)
      this.db.prepare('DELETE FROM players WHERE id = ?').run(id)
      this.db.exec('COMMIT')
    } catch (e) {
      this.db.exec('ROLLBACK')
      throw e
    }
  }

  /** Panelden toplu silme: hepsi tek işlemde (biri bozulursa hiçbiri silinmez). Silinen oyuncu sayısını döner. */
  deletePlayers(ids: string[]): number {
    let deleted = 0
    this.db.exec('BEGIN')
    try {
      for (const id of ids) {
        for (const table of ['level_results', 'grants']) this.db.prepare(`DELETE FROM ${table} WHERE player_id = ?`).run(id)
        deleted += Number(this.db.prepare('DELETE FROM players WHERE id = ?').run(id).changes)
      }
      this.db.exec('COMMIT')
    } catch (e) {
      this.db.exec('ROLLBACK')
      throw e
    }
    return deleted
  }

  /** Panelden: uygunsuz adlı oyuncu tablolarda görünmez (kaydı ve puanları durur). */
  setHidden(id: string, hidden: boolean): boolean {
    return this.db.prepare('UPDATE players SET hidden = ? WHERE id = ?').run(hidden ? 1 : 0, id).changes > 0
  }

  /** Oyuncunun henüz almadığı elmas hediyeleri (uygulama skor gönderiminin cevabında alır); teslim anı yazılır. */
  pendingGrants(id: string): Grant[] {
    const grants = this.db.prepare('SELECT id, amount, note FROM grants WHERE player_id = ? AND claimed_at IS NULL ORDER BY id')
      .all(id) as unknown as Grant[]
    if (grants.length) {
      this.db.prepare('UPDATE grants SET delivered_at = COALESCE(delivered_at, ?) WHERE player_id = ? AND claimed_at IS NULL')
        .run(this.now(), id)
    }
    return grants
  }

  /** Uygulama elmasları bakiyeye ekledi: bir daha gönderilmez. */
  claimGrants(id: string, ids: number[]) {
    const stmt = this.db.prepare('UPDATE grants SET claimed_at = ? WHERE id = ? AND player_id = ? AND claimed_at IS NULL')
    for (const g of ids) stmt.run(this.now(), g, id)
  }

  /** Ad değiştirir; ad başkasındaysa false (oyuncunun kendi adının yazımını değiştirmesi serbest). */
  rename(id: string, name: string): boolean {
    return unique(() => this.db.prepare('UPDATE players SET name = ?, name_key = ?, updated_at = ? WHERE id = ?')
      .run(name, nameKey(name), this.now(), id))
  }

  /**
   * Cihazdaki toplamları kaydeder. Her tablo oyuncunun en iyisini tutar (Play Games gibi): ilerlemesini sıfırlayan
   * oyuncu tablodan düşmez. Haftalık puan yalnız sunucunun haftasıyla aynıysa sayılır.
   */
  saveScores(id: string, s: Snapshot): { clamped: boolean } {
    const p = this.db.prepare('SELECT * FROM players WHERE id = ?').get(id) as PlayerRow | undefined
    if (!p) return { clamped: false }   // bu arada silindi
    const t = this.now()
    const current = weekOf(t)
    const limit = growthLimit(p, t)
    const words = Math.min(Math.max(p.words, s.words), limit.words)
    const level = Math.min(Math.max(p.level, s.level), limit.level)
    const total = Math.min(Math.max(p.total, s.total), limit.total)
    const clamped = s.words > words || s.level > level || s.total > total
    let week = p.week
    let weekly = p.week === current ? p.weekly : 0
    if (p.week !== current) week = current
    if (s.week === current) weekly = Math.min(Math.max(weekly, s.weekly), weekly + (total - p.total) + (p.week === current ? 0 : total))
    weekly = Math.min(weekly, total)
    const improved = total > p.total
    const last = improved && s.last ? s.last : null
    this.db.prepare(`
      UPDATE players SET total = ?, weekly = ?, week = ?, level = ?, words = ?, updated_at = ?, seen_at = ?,
        last_level = COALESCE(?, last_level), last_seconds = COALESCE(?, last_seconds), last_score = COALESCE(?, last_score),
        diamonds = COALESCE(?, diamonds), diamonds_at = CASE WHEN ? IS NULL THEN diamonds_at ELSE ? END,
        flags = COALESCE(flags, 0) + ?, flagged_at = CASE WHEN ? = 1 THEN ? ELSE flagged_at END
      WHERE id = ?`).run(
      total, weekly, week, level, words, t, t,
      last?.level ?? null, last?.seconds ?? null, last?.score ?? null,
      s.diamonds, s.diamonds, t,
      clamped ? 1 : 0, clamped ? 1 : 0, t, id,
    )
    // Bölüm başına en iyi sonuç (ilk bitiriş anı korunur)
    const upsert = this.db.prepare(`
      INSERT INTO level_results (player_id, level, score, seconds, first_at, best_at) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT (player_id, level) DO UPDATE SET
        seconds = CASE WHEN excluded.score > score THEN excluded.seconds ELSE seconds END,
        best_at = CASE WHEN excluded.score > score THEN excluded.best_at ELSE best_at END,
        score = MAX(score, excluded.score)`)
    const results = (s.levels.length ? s.levels : s.last ? [s.last] : []).filter((r) => r.level <= level)
    for (const r of results) upsert.run(id, r.level, r.score, r.seconds, t, t)
    return { clamped }
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

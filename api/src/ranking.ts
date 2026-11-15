// Skor tablolarının bellekteki sıralı anlık görüntüsü (2026-11-15).
//
// Neden: sıra = "önümde kaç kişi var" sayımıydı; kapsayan indeksle bile oyuncu sayısıyla doğrusal büyür
// (50 bin oyuncuda 3-7 ms, 200 binde ~20 ms) ve Node tek iş parçacığında her sorgu olay döngüsünü kilitler.
// Görüntü tablo başına [ttlMs]'de bir indeksten tek sorguyla kurulur; sıra ikili aramayla O(log n),
// sayfa O(sayfa boyu). Oyuncu başına tablo başına 28 bayt (200 bin oyuncu × 4 tablo ≈ 22 MB).
//
// Tazelik: isteği yapan oyuncunun kendi puanı her zaman veritabanından taze okunur ve görüntüye o anki
// yerine yerleştirilir (bölümü bitirip tabloyu açan yeni sırasını hemen görür). Ötekiler en çok [ttlMs] eski.
// Gizleme/silme görüntüyü hemen geçersiz kılar (silinen satır sayfada boşluk bırakmasın).
import type { DatabaseSync, StatementSync } from 'node:sqlite'

export interface Key { score: number; created: number; rowid: number }

/** Tek tablonun sıralı görüntüsü: sıra puan çok → az, eşitlikte önce katılan, sonra kimlik (SQL'deki gibi). */
export class Snapshot {
  readonly builtAt: number
  /** Haftalık tablonun haftası (ötekilerde 0). Hafta değişince görüntü yeniden kurulur. */
  readonly week: number
  readonly rowids: Float64Array
  readonly scores: Float64Array
  readonly created: Float64Array
  /** rowid → görüntüdeki yeri (+1; 0 = yok). */
  private readonly where: Int32Array

  constructor(builtAt: number, week: number, rowids: Float64Array, scores: Float64Array, created: Float64Array, where: Int32Array) {
    this.builtAt = builtAt; this.week = week; this.rowids = rowids; this.scores = scores; this.created = created; this.where = where
  }

  get size() { return this.rowids.length }

  indexOf(rowid: number): number {
    return rowid < this.where.length ? this.where[rowid] - 1 : -1
  }

  key(i: number): Key {
    return { score: this.scores[i], created: this.created[i], rowid: this.rowids[i] }
  }
}

export class Ranking {
  private readonly snaps = new Map<string, Snapshot>()
  private idOf: StatementSync | null = null
  private readonly db: DatabaseSync
  private readonly now: () => number
  readonly ttlMs: number

  constructor(db: DatabaseSync, now: () => number, ttlMs = 15_000) {
    this.db = db; this.now = now; this.ttlMs = ttlMs
  }

  /** Gizleme, silme: bir sonraki istek görüntüyü baştan kurar. */
  invalidate() { this.snaps.clear() }

  /**
   * [board] görüntüsü; yoksa, eskidiyse ya da hafta değiştiyse kurulur.
   * [sql] tablo sırasında satırları döner: rowid, score, created_at (yalnız board_* indeksinden okunur).
   */
  snapshot(board: string, week: number, sql: string, params: number[]): Snapshot {
    const t = this.now()
    const old = this.snaps.get(board)
    if (old && old.week === week && t - old.builtAt < this.ttlMs) return old
    const rows = this.db.prepare(sql).all(...params) as { rowid: number; score: number; created_at: number }[]
    const n = rows.length
    const rowids = new Float64Array(n), scores = new Float64Array(n), created = new Float64Array(n)
    let max = 0
    for (let i = 0; i < n; i++) {
      const r = rows[i]
      rowids[i] = r.rowid; scores[i] = r.score; created[i] = r.created_at
      if (r.rowid > max) max = r.rowid
    }
    const where = new Int32Array(max + 1)
    for (let i = 0; i < n; i++) where[rowids[i]] = i + 1
    const snap = new Snapshot(t, week, rowids, scores, created, where)
    this.snaps.set(board, snap)
    return snap
  }

  /** a, b'nin önünde mi? Puan, sonra katılış, sonra kimlik (yalnız tam eşitlikte veritabanına sorulur, nadir). */
  private ahead(a: Key, b: Key, aId?: string, bId?: string): boolean {
    if (a.score !== b.score) return a.score > b.score
    if (a.created !== b.created) return a.created < b.created
    if (a.rowid === b.rowid) return false
    return (aId ?? this.id(a.rowid)) < (bId ?? this.id(b.rowid))
  }

  private id(rowid: number): string {
    this.idOf ??= this.db.prepare('SELECT id FROM players WHERE rowid = ?')
    return (this.idOf.get(rowid) as { id: string } | undefined)?.id ?? ''
  }

  /**
   * Oyuncunun görüntüdeki taze yeri. [me] null ise (tabloda değil) görüntü olduğu gibi kullanılır.
   * Görüntüdeki eski kaydı (varsa) dışarıda bırakılıp taze puanıyla araya yerleştirilmiş sanal liste döner.
   */
  view(snap: Snapshot, me: (Key & { id: string }) | null): View {
    if (!me) return new View(snap, -1, -1)
    const stale = snap.indexOf(me.rowid)
    // Önümdekiler görüntünün bir önekidir (görüntü sıralı, karşılaştırma aynı anahtarla): ikili arama.
    // Kendi eski kaydım da anahtarıyla karşılaştırılır (sıra tutarlı kalır), sonra sayımdan düşülür.
    let lo = 0, hi = snap.size
    while (lo < hi) {
      const mid = (lo + hi) >>> 1
      if (this.ahead(snap.key(mid), me, undefined, me.id)) lo = mid + 1
      else hi = mid
    }
    return new View(snap, stale, stale >= 0 && stale < lo ? lo - 1 : lo)
  }
}

/** Görüntü, isteyen oyuncunun eski kaydı çıkarılıp taze yerine konmuş hali (kopyalamadan). */
export class View {
  private readonly snap: Snapshot
  /** Oyuncunun görüntüdeki eski yeri (-1: yok). */
  private readonly stale: number
  /** Oyuncunun taze yeri (0'dan; -1: tabloda değil). */
  readonly mine: number

  constructor(snap: Snapshot, stale: number, mine: number) {
    this.snap = snap; this.stale = stale; this.mine = mine
  }

  get size() { return this.snap.size - (this.stale >= 0 ? 1 : 0) + (this.mine >= 0 ? 1 : 0) }

  /** Sanal sıradaki [i]. kayıt: oyuncunun kendisiyse 'me', değilse görüntü indeksi. */
  at(i: number): number | 'me' {
    if (this.mine >= 0) {
      if (i === this.mine) return 'me'
      if (i > this.mine) i--
    }
    if (this.stale >= 0 && i >= this.stale) i++
    return i
  }
}

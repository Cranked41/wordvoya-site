// Bellekteki sıralı tablo görüntüsü (src/ranking.ts, 2026-11-15): SQL ile birebir aynı sıra ve sayfa,
// isteyen oyuncu taze, ötekiler en çok TTL eski, gizleme/silme/hafta değişimi hemen görünür.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { BOARDS, Store, weekOf, type Board, type PlayerRow } from '../src/db.ts'

const T0 = Date.UTC(2026, 10, 16, 12)

function setup(ttl: number) {
  let t = T0
  const clock = { now: () => t, advance: (ms: number) => { t += ms } }
  const store = new Store(':memory:', clock.now, { rankingTtlMs: ttl })
  const set = (id: string, f: Partial<Record<'total' | 'weekly' | 'week' | 'level' | 'words' | 'hidden', number>>) => {
    const cols = Object.keys(f)
    store.db.prepare(`UPDATE players SET ${cols.map((c) => `${c} = ?`).join(', ')} WHERE id = ?`).run(...cols.map((c) => (f as any)[c]), id)
  }
  return { store, clock, set }
}

/** Başvuru: tüm tabloyu düz SQL'le okuyup JS'de sırala (önbelleksiz, yavaş, kesin). */
function reference(store: Store, board: Board): PlayerRow[] {
  const col = board
  const week = weekOf(store.now())
  const rows = store.db.prepare(`SELECT * FROM players WHERE hidden = 0 AND ${col} > 0${board === 'weekly' ? ' AND week = ?' : ''}`)
    .all(...(board === 'weekly' ? [week] : [])) as unknown as PlayerRow[]
  return rows.sort((a, b) => (b as any)[col] - (a as any)[col] || a.created_at - b.created_at || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
}

/** Küçük, tekrarlanabilir rastgele sayı üreteci (test her koşuda aynı veriyi görsün). */
function rng(seed: number) {
  return () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff }
}

test('TTL 0: sıra ve sayfalar SQL başvurusuyla birebir aynı (eşit puan, eşit katılış, gizli, eski hafta)', () => {
  const { store, clock, set } = setup(0)
  const rand = rng(42)
  const week = weekOf(T0)
  const ids: string[] = []
  for (let i = 0; i < 400; i++) {
    if (rand() < 0.5) clock.advance(1)   // yarısı aynı milisaniyede katılır: kimlikle ayrılır
    const id = store.createPlayer(`O${i}`)!.id
    ids.push(id)
    // Az sayıda farklı puan: çok eşitlik
    set(id, {
      total: Math.floor(rand() * 30) * 10, weekly: Math.floor(rand() * 10) * 5, week: rand() < 0.8 ? week : week - 1,
      level: Math.floor(rand() * 20), words: Math.floor(rand() * 50), hidden: rand() < 0.05 ? 1 : 0,
    })
  }
  for (const board of BOARDS) {
    const ref = reference(store, board)
    for (const id of ids.filter((_, i) => i % 7 === 0)) {
      const at = ref.findIndex((p) => p.id === id)
      assert.equal(store.rankOf(board, id), at >= 0 ? at + 1 : null, `${board} sırası`)
      const offsets = [0, Math.max(0, at - 5), ref.length - 3, ref.length + 10]
      for (const offset of offsets) {
        const page = store.page(board, offset, 11, id)
        const want = ref.slice(offset, offset + 11)
        assert.deepEqual(page.map((r) => [r.rank, r.name, r.score, r.me]),
          want.map((p, k) => [offset + k + 1, p.name, (p as any)[board], p.id === id]), `${board} sayfası, offset ${offset}`)
      }
    }
  }
  store.close()
})

test('TTL içinde: isteyen oyuncu taze yerinde, ötekiler eski; sayfa kendi içinde tutarlı', () => {
  const { store, clock, set } = setup(15_000)
  const week = weekOf(T0)
  const p = Array.from({ length: 20 }, (_, i) => { clock.advance(10); const id = store.createPlayer(`P${i}`)!.id; set(id, { total: 1000 - i * 10, weekly: 50, week }); return id })
  assert.equal(store.rankOf('total', p[15]), 16)

  // P15 bölüm bitirdi: kendi isteğinde yeni sırası hemen görünür (990'ın üstü → 1.)
  set(p[15], { total: 2000 })
  assert.equal(store.rankOf('total', p[15]), 1)
  const top = store.page('total', 0, 20, p[15])
  assert.deepEqual(top.map((r) => r.rank), Array.from({ length: 20 }, (_, i) => i + 1), 'sıra boşluksuz ve tekrarsız')
  assert.equal(top[0].me, true)
  assert.equal(top.filter((r) => r.name === 'P15').length, 1, 'eski kaydı ikinci kez görünmez')
  for (let i = 1; i < top.length; i++) assert.ok(top[i - 1].score >= top[i].score, 'puanlar sıralı')

  // Başkasının gözünden P15 henüz eski yerinde (en çok TTL eski) ...
  assert.equal(store.page('total', 15, 1, p[0])[0].name, 'P15')
  // ... TTL dolunca yeni yerinde
  clock.advance(15_000)
  assert.equal(store.page('total', 0, 1, p[0])[0].name, 'P15')

  // Puanı düşen (haftalık sıfırlanması gibi) oyuncu da kendi isteğinde doğru yerde
  set(p[0], { total: 1 })
  assert.equal(store.rankOf('total', p[0]), 20)
  assert.deepEqual(store.page('total', 18, 5, p[0]).map((r) => [r.rank, r.name]), [[19, 'P19'], [20, 'P0']])

  // Yeni oyuncu: kendi isteğinde hemen tabloda
  clock.advance(10)
  const n = store.createPlayer('Yeni')!.id
  set(n, { total: 995 })
  assert.equal(store.rankOf('total', n), 3)
  store.close()
})

test('gizleme ve silme görüntüyü hemen yeniler; hafta değişince haftalık tablo yeniden kurulur', () => {
  const { store, clock, set } = setup(60_000)
  const week = weekOf(T0)
  const p = Array.from({ length: 5 }, (_, i) => { clock.advance(10); const id = store.createPlayer(`P${i}`)!.id; set(id, { total: 500 - i * 10, weekly: 50 - i, week }); return id })
  assert.equal(store.page('total', 0, 10, p[4]).length, 5)

  assert.ok(store.setHidden(p[0], true))
  assert.deepEqual(store.page('total', 0, 10, p[4]).map((r) => r.name), ['P1', 'P2', 'P3', 'P4'])
  assert.equal(store.rankOf('total', p[4]), 4)
  assert.equal(store.rankOf('total', p[0]), null)

  store.deletePlayer(p[1])
  assert.deepEqual(store.page('total', 0, 10, p[4]).map((r) => [r.rank, r.name]), [[1, 'P2'], [2, 'P3'], [3, 'P4']])
  assert.equal(store.deletePlayers([p[2]]), 1)
  assert.deepEqual(store.page('total', 0, 10, p[4]).map((r) => r.name), ['P3', 'P4'])

  // Pazartesi: geçen haftanın puanları haftalık tabloda sayılmaz (TTL dolmasa da)
  assert.equal(store.page('weekly', 0, 10).length, 2)
  clock.advance(7 * 24 * 3600_000)
  assert.equal(store.page('weekly', 0, 10).length, 0)
  store.close()
})

test('50 bin oyuncuda tablo isteği 1 ms altında (görüntü kurulduktan sonra)', () => {
  const { store } = setup(15_000)
  const week = weekOf(T0)
  store.db.exec('BEGIN')
  const ins = store.db.prepare(`INSERT INTO players (id, token_hash, name, name_key, created_at, updated_at, total, weekly, week, level, words)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  const rand = rng(7)
  const ids: string[] = []
  for (let i = 0; i < 50_000; i++) {
    const id = crypto.randomUUID(); ids.push(id)
    const lvl = Math.floor(rand() ** 2 * 400) + 1
    ins.run(id, 'h' + i, 'P' + i, 'p' + i, T0 - i * 1000, T0, lvl * 110 + Math.floor(rand() * 100), Math.floor(rand() * 3000), week, lvl, lvl * 9)
  }
  store.db.exec('COMMIT')
  const built = performance.now()
  for (const b of BOARDS) store.page(b, 0, 1)
  const buildMs = (performance.now() - built) / BOARDS.length
  const a = performance.now()
  const n = 400
  for (let i = 0; i < n; i++) {
    const id = ids[(i * 7919) % ids.length], b = BOARDS[i % 4]
    const me = store.player(b, id)!
    store.page(b, Math.max(0, me.rank - 6), 11, id)
  }
  const ms = (performance.now() - a) / n
  console.log(`50 bin oyuncu: görüntü kurulumu ${buildMs.toFixed(1)} ms/tablo, "yakınımdakiler" isteği ${ms.toFixed(3)} ms`)
  assert.ok(ms < 1, `${ms} ms`)
  store.close()
})

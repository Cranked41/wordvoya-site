// Ölçek: tablo görüntüsü satıra inmeden, sıralama yapmadan yalnız kısmi board_* indeksinden kurulmalı (2026-11-15).
// 50 bin oyuncuda indekssiz sıra sayımı 90-200 ms sürüyordu; Node tek iş parçacığında bu, saniyede ~5 tablo isteği demek.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { BOARDS, Store, weekOf } from '../src/db.ts'

test('tablo görüntüsü kapsayan board_* indeksinden kurulur', () => {
  const now = Date.UTC(2026, 10, 15, 12)
  const store = new Store(':memory:', () => now)
  const a = store.createPlayer('Bir')!
  const b = store.createPlayer('İki')!
  const snap = (total: number) => ({ total, weekly: total, week: weekOf(now), level: 3, words: 20, diamonds: 50, last: null, levels: [] })
  store.saveScores(a.id, snap(300) as any)
  store.saveScores(b.id, snap(200) as any)

  // Store'un gerçekte çalıştırdığı görüntü sorgularını yakala, sonra her birinin planına bak
  const seen: string[] = []
  const prepare = store.db.prepare.bind(store.db)
  store.db.prepare = ((sql: string) => { seen.push(sql); return prepare(sql) }) as typeof store.db.prepare
  for (const board of BOARDS) {
    store.player(board, b.id)
    store.page(board, 0, 50, b.id)
  }
  store.db.prepare = prepare

  const snapshotSql = [...new Set(seen)].filter((sql) => sql.startsWith('SELECT rowid,') && sql.includes('ORDER BY'))
  assert.equal(snapshotSql.length, BOARDS.length, 'tablo başına bir görüntü sorgusu')
  for (const sql of snapshotSql) {
    const params = Array.from({ length: (sql.match(/\?/g) ?? []).length }, () => 1)
    const plan = (store.db.prepare(`EXPLAIN QUERY PLAN ${sql}`).all(...params) as { detail: string }[]).map((r) => r.detail).join(' | ')
    assert.match(plan, /COVERING INDEX board_/, `satıra inmemeli\n${sql}\n→ ${plan}`)
    assert.doesNotMatch(plan, /TEMP B-TREE/, `sıralama indeksten gelmeli\n${sql}\n→ ${plan}`)
  }
  assert.equal(store.player('total', b.id)?.rank, 2)
  store.close()
})

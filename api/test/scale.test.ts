// Ölçek: tablo sorguları satıra inmeden yalnız kısmi indeksten okunmalı (2026-11-15).
// 50 bin oyuncuda indekssiz istek 90-200 ms sürüyordu; Node tek iş parçacığında bu, saniyede ~5 tablo isteği demek.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { BOARDS, Store, weekOf } from '../src/db.ts'

test('tablo sırası ve sayfası kapsayan board_* indeksini kullanır', () => {
  const now = Date.UTC(2026, 10, 15, 12)
  const store = new Store(':memory:', () => now)
  const a = store.createPlayer('Bir')!
  const b = store.createPlayer('İki')!
  const snap = (total: number) => ({ total, weekly: total, week: weekOf(now), level: 3, words: 20, diamonds: 50, last: null, levels: [] })
  store.saveScores(a.id, snap(300) as any)
  store.saveScores(b.id, snap(200) as any)

  // Store'un gerçekte çalıştırdığı tablo sorgularını yakala, sonra her birinin planına bak
  const seen: string[] = []
  const prepare = store.db.prepare.bind(store.db)
  store.db.prepare = ((sql: string) => { seen.push(sql); return prepare(sql) }) as typeof store.db.prepare
  for (const board of BOARDS) {
    store.player(board, b.id)
    store.page(board, 0, 50, b.id)
  }
  store.db.prepare = prepare

  const boardSql = [...new Set(seen)].filter((sql) => /COUNT\(\*\)|LIMIT \? OFFSET \?/.test(sql))
  assert.equal(boardSql.length, BOARDS.length * 2)
  for (const sql of boardSql) {
    const params = Array.from({ length: (sql.match(/\?/g) ?? []).length }, () => 1)
    const plan = (store.db.prepare(`EXPLAIN QUERY PLAN ${sql}`).all(...params) as { detail: string }[]).map((r) => r.detail).join(' | ')
    assert.match(plan, /USING (COVERING )?INDEX board_/, `${sql}\n→ ${plan}`)
    if (sql.includes('COUNT(*)')) assert.match(plan, /COVERING INDEX board_/, `sıra sayımı satıra inmemeli\n${sql}\n→ ${plan}`)
    assert.doesNotMatch(plan, /TEMP B-TREE/, `sıralama indeksten gelmeli\n${sql}\n→ ${plan}`)
  }
  assert.equal(store.player('total', b.id)?.rank, 2)
  store.close()
})

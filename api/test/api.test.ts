import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { AddressInfo } from 'node:net'
import { Store, weekOf } from '../src/db.ts'
import { createApp } from '../src/server.ts'
import { cleanName, nameKey, parseSnapshot } from '../src/validate.ts'

async function start(now = () => Date.UTC(2026, 10, 6, 12)) {
  const store = new Store(':memory:', now)
  const server = createApp(store, { now, perMinute: 1000, playersPerHour: 1000 })
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r))
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/v1`
  const call = async (method: string, path: string, body?: unknown, token?: string) => {
    const res = await fetch(base + path, {
      method,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    return { status: res.status, body: (await res.json()) as any }
  }
  const stop = () => new Promise<void>((r) => server.close(() => { store.close(); r() }))
  return { call, stop, week: weekOf(now()) }
}

const snap = (total: number, extra: Record<string, unknown> = {}) =>
  ({ total, weekly: total, level: 10, words: Math.max(100, total), ...extra })

test('kayıt, skor ve sıra', async () => {
  const { call, stop, week } = await start()
  try {
    const a = (await call('POST', '/players', { name: 'Elif' })).body
    const b = (await call('POST', '/players', { name: 'Mert' })).body
    const c = (await call('POST', '/players', { name: 'Rıza' })).body
    assert.ok(a.token && a.id)
    assert.equal((await call('PUT', '/players/me/scores', { ...snap(900), week }, a.token)).status, 200)
    await call('PUT', '/players/me/scores', { ...snap(500), week, last: { level: 12, seconds: 40, score: 140 } }, b.token)
    await call('PUT', '/players/me/scores', { ...snap(700), week }, c.token)

    const top = (await call('GET', '/boards/total', undefined, c.token)).body
    assert.deepEqual(top.entries.map((e: any) => [e.rank, e.name, e.score, e.me]), [
      [1, 'Elif', 900, false], [2, 'Rıza', 700, true], [3, 'Mert', 500, false],
    ])
    assert.deepEqual(top.entries[2].last, { level: 12, seconds: 40, score: 140 })
    assert.equal(top.player.rank, 2)

    // Bölüm tablosunda son bölüm bilgisi yok
    const level = (await call('GET', '/boards/level')).body
    assert.equal(level.entries[0].last, null)
    assert.equal(level.player, null)
  } finally { await stop() }
})

test('en iyi skor kalır, haftalık yalnız bu hafta sayılır', async () => {
  const { call, stop, week } = await start()
  try {
    const a = (await call('POST', '/players', { name: 'Elif' })).body
    await call('PUT', '/players/me/scores', { ...snap(900), week }, a.token)
    await call('PUT', '/players/me/scores', { ...snap(100), week }, a.token)   // ilerleme sıfırlandı
    assert.equal((await call('GET', '/boards/total')).body.entries[0].score, 900)

    const b = (await call('POST', '/players', { name: 'Mert' })).body
    await call('PUT', '/players/me/scores', { ...snap(300), week: week - 1 }, b.token)  // geçen hafta
    const weekly = (await call('GET', '/boards/weekly')).body
    assert.deepEqual(weekly.entries.map((e: any) => e.name), ['Elif'])
    assert.equal((await call('GET', '/boards/total')).body.entries.length, 2)
  } finally { await stop() }
})

test('yakınımdakiler oyuncuyu ortalar', async () => {
  const { call, stop, week } = await start()
  try {
    const players = []
    for (let i = 1; i <= 30; i++) {
      const p = (await call('POST', '/players', { name: `Oyuncu ${i}` })).body
      await call('PUT', '/players/me/scores', { ...snap(10_000 - i * 100), week }, p.token)
      players.push(p)
    }
    const me = players[19]   // 20. sıra
    const near = (await call('GET', '/boards/total?scope=near', undefined, me.token)).body
    assert.equal(near.player.rank, 20)
    assert.deepEqual(near.entries.map((e: any) => e.rank), [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25])
    assert.ok(near.entries.find((e: any) => e.rank === 20).me)
    // Oturumsuz ya da skorsuz istekte ilk sıralar gelir
    assert.equal((await call('GET', '/boards/total?scope=near')).body.entries[0].rank, 1)
  } finally { await stop() }
})

test('yetkisiz ve bozuk istekler', async () => {
  const { call, stop, week } = await start()
  try {
    assert.equal((await call('PUT', '/players/me/scores', { ...snap(10), week })).status, 401)
    assert.equal((await call('PUT', '/players/me/scores', { ...snap(10), week }, 'yanlis')).status, 401)
    const a = (await call('POST', '/players', { name: 'Elif' })).body
    assert.equal((await call('PUT', '/players/me/scores', { total: 10_000_000, weekly: 0, week, level: 1, words: 1 }, a.token)).status, 422)
    assert.equal((await call('PUT', '/players/me/scores', { ...snap(10), week, total: -1 }, a.token)).status, 422)
    assert.equal((await call('POST', '/players', { name: 'x' })).status, 422)
    assert.equal((await call('GET', '/boards/hile')).status, 404)
    assert.equal((await call('PATCH', '/players/me', { name: 'Elif Su' }, a.token)).body.name, 'Elif Su')
    assert.equal((await call('PATCH', '/players/me', { name: 'amk' }, a.token)).status, 422)
  } finally { await stop() }
})

test('oyuncu kaydını siler', async () => {
  const { call, stop, week } = await start()
  try {
    const a = (await call('POST', '/players', { name: 'Elif' })).body
    await call('PUT', '/players/me/scores', { ...snap(900), week }, a.token)
    assert.equal((await call('DELETE', '/players/me', undefined, a.token)).status, 200)
    assert.equal((await call('GET', '/boards/total')).body.entries.length, 0)
    assert.equal((await call('PUT', '/players/me/scores', { ...snap(900), week }, a.token)).status, 401)
    assert.equal((await call('DELETE', '/players/me', undefined, a.token)).status, 401)
  } finally { await stop() }
})

test('ad kuralları', () => {
  assert.equal(cleanName('  Rıza   Çelik '), 'Rıza Çelik')
  assert.equal(cleanName('علي'), 'علي')
  assert.equal(cleanName('राहुल'), 'राहुल')
  assert.equal(cleanName('Gezgin 4821'), 'Gezgin 4821')
  assert.equal(cleanName('a'), null)
  assert.equal(cleanName('x'.repeat(21)), null)
  assert.equal(cleanName('<script>'), null)
  assert.equal(cleanName('SikerimSeni'), null)
  assert.equal(cleanName('Sıkıcı'), 'Sıkıcı')
  assert.equal(cleanName(42), null)
})

test('skor sınırları', () => {
  assert.equal(parseSnapshot({ total: 100, weekly: 200, week: 1, level: 1, words: 50 }), 'weekly')
  assert.equal(parseSnapshot({ total: 1.5, weekly: 0, week: 1, level: 1, words: 50 }), 'total')
  assert.deepEqual(parseSnapshot({ total: 100, weekly: 50, week: 1, level: 3, words: 50 }),
    { total: 100, weekly: 50, week: 1, level: 3, words: 50, last: null, diamonds: null, levels: [] })
})

test('aynı adda iki oyuncu olmaz', async () => {
  const { call, stop } = await start()
  try {
    const a = (await call('POST', '/players', { name: 'Ayşe Yılmaz' })).body
    // Büyük harf, aksansız ve ayraçlı yazımlar da aynı ad sayılır
    for (const name of ['Ayşe Yılmaz', 'AYŞE YILMAZ', 'ayse yilmaz', 'Ayşe-Yılmaz', 'Ａｙşe Yılmaz']) {
      const r = await call('POST', '/players', { name })
      assert.equal(r.status, 409, name)
      assert.equal(r.body.error, 'name_taken')
    }
    const b = (await call('POST', '/players', { name: 'Mert' })).body
    assert.equal((await call('PATCH', '/players/me', { name: 'ayşe yılmaz' }, b.token)).status, 409)
    // Kendi adının yazımını değiştirmek serbest
    assert.equal((await call('PATCH', '/players/me', { name: 'AYŞE YILMAZ' }, a.token)).status, 200)
    // Silinen oyuncunun adı boşa çıkar
    await call('DELETE', '/players/me', undefined, a.token)
    assert.equal((await call('PATCH', '/players/me', { name: 'Ayşe Yılmaz' }, b.token)).status, 200)
  } finally { await stop() }
})

test('dillere göre adlar', () => {
  for (const name of ['علی‌رضا', 'श्री‍', 'マイケル・ジャクソン', 'Jordi·Puig', '山田 太郎', 'Пётр', 'فاطمة الزّهراء', '김민준']) {
    assert.equal(cleanName(name), name, name)
  }
  assert.equal(cleanName('山田　太郎'), '山田 太郎')   // tam genişlik boşluk
  assert.equal(cleanName('‌علی'), null)              // yarım boşlukla başlayamaz
  // Aynı sayılanlar
  assert.equal(nameKey('İbrahim'), nameKey('ibrahim'))
  assert.equal(nameKey('Jürgen Groß'), nameKey('jurgen gross'))
  assert.equal(nameKey('مُحَمَّد'), nameKey('محمد'))
  assert.equal(nameKey('علی‌رضا'), nameKey('علیرضا'))
  assert.equal(nameKey('Пётр'), nameKey('петр'))
  // Farklı kalanlar: Hintçe ünlü işaretleri ve Japonca ses işaretleri harfin parçası
  assert.notEqual(nameKey('राहुल'), nameKey('रहल'))
  assert.notEqual(nameKey('ガク'), nameKey('カク'))
  assert.notEqual(nameKey('김민준'), nameKey('김민주'))
})

test('eski veritabanına ad anahtarı eklenir', async () => {
  const { DatabaseSync } = await import('node:sqlite')
  const { mkdtempSync } = await import('node:fs')
  const { tmpdir } = await import('node:os')
  const { join } = await import('node:path')
  const path = join(mkdtempSync(join(tmpdir(), 'wv-')), 'old.db')
  const old = new DatabaseSync(path)
  old.exec(`CREATE TABLE players (id TEXT PRIMARY KEY, token_hash TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
    created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, hidden INTEGER NOT NULL DEFAULT 0,
    total INTEGER NOT NULL DEFAULT 0, weekly INTEGER NOT NULL DEFAULT 0, week INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 0, words INTEGER NOT NULL DEFAULT 0, last_level INTEGER, last_seconds INTEGER, last_score INTEGER);
    INSERT INTO players (id, token_hash, name, created_at, updated_at) VALUES ('a', 'h1', 'Elif', 1, 1), ('b', 'h2', 'ELİF', 2, 2);`)
  old.close()
  const store = new Store(path)
  try {
    assert.equal(store.count(), 2)                       // çakışan eski kayıt silinmez
    assert.equal(store.createPlayer('elif'), null)       // ama ad artık alınamaz
    assert.ok(store.createPlayer('Mert'))
  } finally { store.close() }
})

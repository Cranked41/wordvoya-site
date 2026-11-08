// Güvenlik incelemesinden (2026-11-08) gelen düzeltmelerin testleri.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { AddressInfo } from 'node:net'
import { IMPORT_MAX_LEVEL, IMPORT_MAX_WORDS, Store, weekOf } from '../src/db.ts'
import { createApp } from '../src/server.ts'
import { AdminStore } from '../src/admin.ts'

async function start(opts: { loginsPerUserHour?: number; playersPerHour?: number } = {}) {
  let t = Date.UTC(2026, 10, 8, 12)
  const clock = { now: () => t, advance: (ms: number) => { t += ms } }
  const store = new Store(':memory:', clock.now)
  const admins = new AdminStore(store)
  await admins.addAdmin('riza', 'dogru-sifre-123', 'admin')
  const server = createApp(store, { now: clock.now, perMinute: 10_000, playersPerHour: 1000, loginsPer15Min: 1000, secureCookie: false, ...opts })
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r))
  const root = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/v1`
  const call = async (method: string, path: string, body?: unknown, headers: Record<string, string> = {}) => {
    const res = await fetch(root + path, {
      method,
      headers: { ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    return { status: res.status, body: (await res.json()) as any, headers: res.headers }
  }
  const login = async () => (await call('POST', '/admin/login', { username: 'riza', password: 'dogru-sifre-123' })).headers.getSetCookie()[0].split(';')[0]
  const stop = () => new Promise<void>((r) => server.close(() => { store.close(); r() }))
  return { call, login, stop, clock, store }
}

const auth = (token: string) => ({ Authorization: `Bearer ${token}` })

test('puan artışı geçen süreyle sınırlı; fazlası kırpılır ve oyuncu şüpheli işaretlenir', async () => {
  const { call, login, stop, clock } = await start()
  try {
    const week = weekOf(clock.now())
    const p = (await call('POST', '/players', { name: 'Hileci' })).body
    const put = (s: Record<string, number>) => call('PUT', '/players/me/scores', { weekly: 0, week, ...s }, auth(p.token))

    // İlk gönderim: cihazdaki geçmiş taşınır, ama aktarım tavanıyla
    assert.equal((await put({ total: 2000, level: 40, words: 400 })).status, 200)
    const board = async () => (await call('GET', '/boards/total', undefined, auth(p.token))).body.player

    // Bir saniye sonra 100 bin kelime ve 1 milyon puan: kabul edilmez, kırpılır (tablodan düşmez)
    clock.advance(1000)
    assert.equal((await put({ total: 1_000_000, level: 5000, words: 66_000 })).status, 200)
    const after = await board()
    assert.ok(after.score < 2000 + 61 * 15 + 3 * 110 + 1, `kırpılmış puan: ${after.score}`)

    // Gerçek süre geçtikçe sınır açılır: 1 saat sonra çok daha fazlası kabul edilir
    clock.advance(3_600_000)
    await put({ total: 20_000, level: 200, words: 1500 })
    assert.equal((await board()).score, 20_000)

    const detail = (await call('GET', `/admin/players/${p.id}`, undefined, { Cookie: await login() })).body.player
    assert.equal(detail.flags, 1)
    assert.ok(detail.flaggedAt)
    assert.ok(detail.level < 5000)
  } finally { await stop() }
})

test('ilk gönderimde aktarım tavanı, sonra bölüm sonuçları sınırı aşmaz', async () => {
  const { call, stop, clock, store } = await start()
  try {
    const week = weekOf(clock.now())
    const p = (await call('POST', '/players', { name: 'Uzun Soluklu' })).body
    // Tavanın üstü kırpılır (geçerli bir eski oyuncu reddedilmesin, tablodan düşmesin)
    await call('PUT', '/players/me/scores', { total: 900_000, weekly: 0, week, level: 50_000, words: 1_000_000 }, auth(p.token))
    const row = store.db.prepare('SELECT level, words, flags FROM players WHERE id = ?').get(p.id) as any
    assert.equal(row.level, IMPORT_MAX_LEVEL)
    assert.equal(row.words, IMPORT_MAX_WORDS)
    assert.equal(row.flags, 1)
    // Tavanın üstündeki bölümün sonucu kaydedilmez
    clock.advance(5000)
    await call('PUT', '/players/me/scores', { total: 900_000, weekly: 0, week, level: 50_000, words: 1_000_000, levels: [{ level: 49_000, seconds: 5, score: 100 }, { level: 10, seconds: 30, score: 120 }] }, auth(p.token))
    const levels = store.db.prepare('SELECT level FROM level_results WHERE player_id = ?').all(p.id) as any[]
    assert.deepEqual(levels.map((l) => l.level), [10])
  } finally { await stop() }
})

test('panel: sort=constructor ve benzeri 500 vermez; bozuk çerez 401 döner', async () => {
  const { call, login, stop } = await start()
  try {
    const cookie = await login()
    for (const sort of ['constructor', 'toString', '__proto__', 'hasOwnProperty']) {
      assert.equal((await call('GET', `/admin/players?sort=${sort}`, undefined, { Cookie: cookie })).status, 200, sort)
    }
    assert.equal((await call('GET', '/admin/me', undefined, { Cookie: 'wv_admin=%' })).status, 401)
    assert.equal((await call('GET', '/admin/me', undefined, { Cookie: 'wv_admin=%E0%A4%A' })).status, 401)
  } finally { await stop() }
})

test('aynı kullanıcı adına dağıtık kaba kuvvet de kesilir', async () => {
  const { call, stop } = await start({ loginsPerUserHour: 5 })
  try {
    const codes: number[] = []
    for (let i = 0; i < 7; i++) {
      // Her deneme başka IP'den (nginx X-Real-IP yazar)
      codes.push((await call('POST', '/admin/login', { username: 'riza', password: `yanlis-${i}` }, { 'X-Real-IP': `10.0.0.${i}` })).status)
    }
    assert.deepEqual(codes, [401, 401, 401, 401, 401, 429, 429])
    // Başka kullanıcı adı etkilenmez
    assert.equal((await call('POST', '/admin/login', { username: 'baska', password: 'x' }, { 'X-Real-IP': '10.0.0.99' })).status, 401)
  } finally { await stop() }
})

test('IPv6 adresleri /64 ağına göre tek kişi sayılır', async () => {
  const { call, stop } = await start({ playersPerHour: 3 })
  try {
    const codes: number[] = []
    for (let i = 0; i < 5; i++) {
      // Aynı abonelik (/64), her istekte başka adres
      codes.push((await call('POST', '/players', { name: `Altı Dört ${i}` }, { 'X-Real-IP': `2a02:ff0:1:2:${(i + 1).toString(16)}::1` })).status)
    }
    assert.deepEqual(codes, [201, 201, 201, 429, 429])
    // Başka /64 etkilenmez
    assert.equal((await call('POST', '/players', { name: 'Komsu Ag' }, { 'X-Real-IP': '2a02:ff0:1:3::1' })).status, 201)
  } finally { await stop() }
})

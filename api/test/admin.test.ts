import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { AddressInfo } from 'node:net'
import { Store, weekOf } from '../src/db.ts'
import { createApp } from '../src/server.ts'
import { AdminStore, verifyPassword } from '../src/admin.ts'

const ORIGIN = 'http://panel.test'

async function start() {
  const now = () => Date.UTC(2026, 10, 8, 12)
  const store = new Store(':memory:', now)
  const admins = new AdminStore(store)
  await admins.addAdmin('riza', 'dogru-sifre-123', 'admin')
  await admins.addAdmin('izleyici', 'izleyici-sifre-1', 'viewer')
  const server = createApp(store, { now, perMinute: 1000, playersPerHour: 1000, loginsPer15Min: 5, secureCookie: false, origin: ORIGIN })
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r))
  const root = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
  const call = async (method: string, path: string, body?: unknown, opts: { token?: string; cookie?: string; origin?: string; type?: string } = {}) => {
    const res = await fetch(root + path, {
      method,
      redirect: 'manual',
      headers: {
        ...(body !== undefined ? { 'Content-Type': opts.type ?? 'application/json' } : {}),
        ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
        ...(opts.cookie ? { Cookie: opts.cookie } : {}),
        ...(opts.origin ? { Origin: opts.origin } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    const text = await res.text()
    let json: any = null
    try { json = JSON.parse(text) } catch { /* sayfa */ }
    return { status: res.status, body: json, text, headers: res.headers }
  }
  const login = async (username: string, password: string) => {
    const r = await call('POST', '/api/v1/admin/login', { username, password })
    const set = r.headers.getSetCookie()[0] ?? ''
    return { ...r, cookie: set.split(';')[0] }
  }
  const stop = () => new Promise<void>((r) => server.close(() => { store.close(); r() }))
  return { call, login, stop, week: weekOf(now()), admins }
}

test('şifre özeti doğrulanır, düz şifre saklanmaz', async () => {
  const { admins, stop } = await start()
  try {
    const row = (admins as any).store.db.prepare("SELECT pass_hash FROM admins WHERE username = 'riza'").get()
    assert.ok(row.pass_hash.startsWith('scrypt$'))
    assert.ok(!row.pass_hash.includes('dogru-sifre-123'))
    assert.equal(await verifyPassword('dogru-sifre-123', row.pass_hash), true)
    assert.equal(await verifyPassword('yanlis', row.pass_hash), false)
  } finally { await stop() }
})

test('giriş, oturum ve çıkış', async () => {
  const { call, login, stop } = await start()
  try {
    assert.equal((await call('GET', '/api/v1/admin/me')).status, 401)
    assert.equal((await login('riza', 'yanlis-sifre')).status, 401)
    assert.equal((await login('yok', 'dogru-sifre-123')).status, 401)
    const ok = await login('RIZA', 'dogru-sifre-123')   // kullanıcı adı küçük harfe çevrilir
    assert.equal(ok.status, 200)
    assert.match(ok.headers.getSetCookie()[0], /HttpOnly; SameSite=Strict/)
    assert.deepEqual((await call('GET', '/api/v1/admin/me', undefined, { cookie: ok.cookie })).body, { username: 'riza', role: 'admin' })
    assert.equal((await call('POST', '/api/v1/admin/logout', {}, { cookie: ok.cookie })).status, 200)
    assert.equal((await call('GET', '/api/v1/admin/me', undefined, { cookie: ok.cookie })).status, 401)
  } finally { await stop() }
})

test('giriş denemesi sınırlanır', async () => {
  const { login, stop } = await start()
  try {
    for (let i = 0; i < 5; i++) assert.equal((await login('riza', 'yanlis')).status, 401)
    assert.equal((await login('riza', 'dogru-sifre-123')).status, 429)
  } finally { await stop() }
})

test('başka siteden istek ve form gönderimi reddedilir', async () => {
  const { call, login, stop } = await start()
  try {
    const { cookie } = await login('riza', 'dogru-sifre-123')
    assert.equal((await call('POST', '/api/v1/admin/logout', {}, { cookie, origin: 'https://kotu.example' })).status, 403)
    assert.equal((await call('POST', '/api/v1/admin/logout', {}, { cookie, type: 'text/plain' })).status, 415)
    assert.equal((await call('POST', '/api/v1/admin/logout', {}, { cookie, origin: ORIGIN })).status, 200)
  } finally { await stop() }
})

test('elmas: admin verir, oyuncu alır, bir daha gelmez', async () => {
  const { call, login, stop, week } = await start()
  try {
    const player = (await call('POST', '/api/v1/players', { name: 'Elif' })).body
    const admin = (await login('riza', 'dogru-sifre-123')).cookie
    const viewer = (await login('izleyici', 'izleyici-sifre-1')).cookie
    const path = `/api/v1/admin/players/${player.id}/grants`

    assert.equal((await call('POST', path, { amount: 50 }, { cookie: viewer })).status, 403)   // yalnız admin
    assert.equal((await call('POST', path, { amount: 50 })).status, 401)
    assert.equal((await call('POST', path, { amount: 0 }, { cookie: admin })).status, 422)
    assert.equal((await call('POST', path, { amount: 100_001 }, { cookie: admin })).status, 422)
    assert.equal((await call('POST', path, { amount: 1.5 }, { cookie: admin })).status, 422)
    const first = await call('POST', path, { amount: 50, note: '  Turnuva   ödülü ' }, { cookie: admin })
    assert.equal(first.status, 201)
    const second = (await call('POST', path, { amount: 20 }, { cookie: admin })).body

    const snap = { total: 100, weekly: 100, week, level: 3, words: 30, diamonds: 140 }
    const put = await call('PUT', '/api/v1/players/me/scores', snap, { token: player.token })
    assert.deepEqual(put.body.grants, [{ id: first.body.id, amount: 50, note: 'Turnuva ödülü' }, { id: second.id, amount: 20, note: '' }])

    // İkincisi geri alınır; ilki alınır
    assert.equal((await call('DELETE', `/api/v1/admin/grants/${second.id}`, {}, { cookie: viewer })).status, 403)
    assert.equal((await call('DELETE', `/api/v1/admin/grants/${second.id}`, {}, { cookie: admin })).status, 200)
    assert.equal((await call('POST', '/api/v1/players/me/grants/ack', { ids: [first.body.id] }, { token: player.token })).status, 200)
    assert.deepEqual((await call('PUT', '/api/v1/players/me/scores', snap, { token: player.token })).body.grants, [])
    assert.equal((await call('DELETE', `/api/v1/admin/grants/${first.body.id}`, {}, { cookie: admin })).status, 409)   // alınmış

    const detail = (await call('GET', `/api/v1/admin/players/${player.id}`, undefined, { cookie: viewer })).body
    assert.equal(detail.player.granted, 50)
    assert.equal(detail.grants.length, 1)
    assert.equal(detail.grants[0].admin, 'riza')
    assert.ok(detail.grants[0].claimed_at)
  } finally { await stop() }
})

test('panel oyuncuları, elmas bakiyesini ve bölüm sonuçlarını gösterir', async () => {
  const { call, login, stop, week } = await start()
  try {
    const a = (await call('POST', '/api/v1/players', { name: 'Ayşe' })).body
    const b = (await call('POST', '/api/v1/players', { name: 'Mert' })).body
    await call('PUT', '/api/v1/players/me/scores', {
      total: 300, weekly: 300, week, level: 3, words: 40, diamonds: 250,
      levels: [{ level: 1, seconds: 30, score: 90 }, { level: 2, seconds: 50, score: 100 }],
    }, { token: a.token })
    // Aynı bölüm daha iyi puanla: en iyisi kalır, ilk bitiriş korunur
    await call('PUT', '/api/v1/players/me/scores', {
      total: 410, weekly: 410, week, level: 3, words: 50, levels: [{ level: 3, seconds: 20, score: 110 }, { level: 2, seconds: 40, score: 95 }],
    }, { token: a.token })
    await call('PUT', '/api/v1/players/me/scores', { total: 120, weekly: 0, week, level: 1, words: 20, last: { level: 1, seconds: 9, score: 120 } }, { token: b.token })
    // Bozuk bölüm sonucu reddedilir
    assert.equal((await call('PUT', '/api/v1/players/me/scores', { total: 120, weekly: 0, week, level: 1, words: 20, levels: [{ level: 0, seconds: 1, score: 1 }] }, { token: b.token })).status, 422)

    const cookie = (await login('izleyici', 'izleyici-sifre-1')).cookie
    const list = (await call('GET', '/api/v1/admin/players?sort=total', undefined, { cookie })).body
    assert.equal(list.total, 2)
    assert.deepEqual(list.players.map((p: any) => [p.rank, p.name, p.total, p.diamonds, p.levelsRecorded]), [
      [1, 'Ayşe', 410, 250, 3], [2, 'Mert', 120, null, 1],
    ])
    const byDiamonds = (await call('GET', '/api/v1/admin/players?sort=diamonds&dir=asc', undefined, { cookie })).body
    assert.equal(byDiamonds.players[0].name, 'Mert')
    assert.equal((await call('GET', '/api/v1/admin/players?q=AYSE', undefined, { cookie })).body.players[0].name, 'Ayşe')
    assert.equal((await call('GET', '/api/v1/admin/players?q=a%25', undefined, { cookie })).body.total, 1)   // % joker sayılmaz

    const detail = (await call('GET', `/api/v1/admin/players/${a.id}`, undefined, { cookie })).body
    assert.deepEqual(detail.levels.map((l: any) => [l.level, l.score, l.seconds]), [[3, 110, 20], [2, 100, 50], [1, 90, 30]])
    assert.equal(detail.player.ranks.total, 1)

    const summary = (await call('GET', '/api/v1/admin/summary', undefined, { cookie })).body
    assert.equal(summary.players, 2)
    assert.equal(summary.diamondsHeld, 250)
    assert.equal(summary.active1d, 2)

    // Oyuncu silinince bölüm sonuçları ve hediyeleri de gider
    await call('DELETE', '/api/v1/players/me', undefined, { token: a.token })
    assert.equal((await call('GET', `/api/v1/admin/players/${a.id}`, undefined, { cookie })).status, 404)
  } finally { await stop() }
})

test('panel sayfası sıkı güvenlik başlıklarıyla gelir', async () => {
  const { call, stop } = await start()
  try {
    const redirect = await call('GET', '/api/admin')
    assert.equal(redirect.status, 301)
    assert.equal(redirect.headers.get('location'), '/api/admin/')
    const page = await call('GET', '/api/admin/')
    assert.equal(page.status, 200)
    assert.match(page.text, /Wordvoya Panel/)
    assert.match(page.headers.get('content-security-policy')!, /script-src 'self'/)
    assert.equal(page.headers.get('x-robots-tag'), 'noindex, nofollow')
    assert.equal((await call('GET', '/api/admin/app.js')).status, 200)
    assert.equal((await call('GET', '/api/admin/../src/db.ts')).status, 404)
  } finally { await stop() }
})

import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { AddressInfo } from 'node:net'
import { Store, weekOf } from '../src/db.ts'
import { createApp } from '../src/server.ts'
import { AdminStore, verifyPassword } from '../src/admin.ts'

const ORIGIN = 'http://panel.test'

async function start(now: () => number = () => Date.UTC(2026, 10, 8, 12)) {
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
    // Uygulamaya teslim edilmeden geri alınabilir
    const third = (await call('POST', path, { amount: 7 }, { cookie: admin })).body
    assert.equal((await call('DELETE', `/api/v1/admin/grants/${third.id}`, {}, { cookie: viewer })).status, 403)
    assert.equal((await call('DELETE', `/api/v1/admin/grants/${third.id}`, {}, { cookie: admin })).status, 200)

    const snap = { total: 100, weekly: 100, week, level: 3, words: 30, diamonds: 140 }
    const put = await call('PUT', '/api/v1/players/me/scores', snap, { token: player.token })
    assert.deepEqual(put.body.grants, [{ id: first.body.id, amount: 50, note: 'Turnuva ödülü' }, { id: second.id, amount: 20, note: '' }])

    // Teslim edildikten sonra geri alınamaz (oyuncu elmasları bakiyesine eklemiş olabilir)
    const late = await call('DELETE', `/api/v1/admin/grants/${second.id}`, {}, { cookie: admin })
    assert.equal(late.status, 409)
    assert.equal(late.body.error, 'delivered')
    assert.equal((await call('POST', '/api/v1/players/me/grants/ack', { ids: [second.id] }, { token: player.token })).status, 200)
    assert.equal((await call('POST', '/api/v1/players/me/grants/ack', { ids: [first.body.id] }, { token: player.token })).status, 200)
    assert.deepEqual((await call('PUT', '/api/v1/players/me/scores', snap, { token: player.token })).body.grants, [])
    assert.equal((await call('DELETE', `/api/v1/admin/grants/${first.body.id}`, {}, { cookie: admin })).status, 409)   // alınmış

    const detail = (await call('GET', `/api/v1/admin/players/${player.id}`, undefined, { cookie: viewer })).body
    assert.equal(detail.player.granted, 70)
    assert.equal(detail.grants.length, 2)
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

test('toplu silme: yalnız admin, hepsi tek işlemde, bozuk istek reddedilir', async () => {
  const { call, login, stop, week, admins } = await start()
  try {
    const ps: any[] = []
    for (const name of ['Bir', 'İki', 'Üç', 'Dört']) ps.push((await call('POST', '/api/v1/players', { name })).body)
    await call('PUT', '/api/v1/players/me/scores', { total: 50, weekly: 50, week, level: 2, words: 5, levels: [{ level: 1, seconds: 20, score: 50 }] }, { token: ps[0].token })
    const admin = (await login('riza', 'dogru-sifre-123')).cookie
    const viewer = (await login('izleyici', 'izleyici-sifre-1')).cookie
    await call('POST', `/api/v1/admin/players/${ps[0].id}/grants`, { amount: 10 }, { cookie: admin })
    await call('POST', `/api/v1/admin/players/${ps[0].id}/adjust`, { total: 80 }, { cookie: admin })
    const path = '/api/v1/admin/players/delete'

    assert.equal((await call('POST', path, { ids: [ps[0].id] }, { cookie: viewer })).status, 403)
    assert.equal((await call('POST', path, { ids: [ps[0].id] })).status, 401)
    assert.equal((await call('POST', path, { ids: [ps[0].id] }, { cookie: admin, origin: 'https://kotu.example' })).status, 403)
    for (const bad of [{}, { ids: [] }, { ids: 'x' }, { ids: ['../etc'] }, { ids: [1] }, { ids: Array(201).fill(ps[0].id) }]) {
      assert.equal((await call('POST', path, bad, { cookie: admin })).status, 422, JSON.stringify(bad).slice(0, 40))
    }

    // Tekrarlanan ve olmayan kimlik sayılmaz
    const missing = '00000000-0000-0000-0000-000000000000'
    const r = await call('POST', path, { ids: [ps[0].id, ps[1].id, ps[0].id, missing] }, { cookie: admin })
    assert.deepEqual([r.status, r.body], [200, { deleted: 2 }])
    const list = (await call('GET', '/api/v1/admin/players?sort=name&dir=asc', undefined, { cookie: viewer })).body
    assert.deepEqual(list.players.map((p: any) => p.name).sort(), ['Dört', 'Üç'])
    // Silinenin bölüm sonuçları, hediyeleri ve düzeltmeleri de gider; jetonu artık geçmez
    assert.equal((await call('GET', `/api/v1/admin/players/${ps[0].id}`, undefined, { cookie: admin })).status, 404)
    assert.equal((await call('PUT', '/api/v1/players/me/scores', { total: 60, weekly: 60, week, level: 2, words: 6 }, { token: ps[0].token })).status, 401)
    const db = (admins as any).store.db
    for (const table of ['level_results', 'grants', 'adjustments']) {
      assert.equal(db.prepare(`SELECT COUNT(*) AS n FROM ${table} WHERE player_id = ?`).get(ps[0].id).n, 0, table)
    }
  } finally { await stop() }
})

// --- Puan ve bölüm ayarı (POST admin/players/{id}/adjust) ---

const SCORES = '/api/v1/players/me/scores'

test('puan/bölüm ayarı: yalnız admin; bozuk, boş ve tutarsız istek reddedilir', async () => {
  const { call, login, stop, week } = await start()
  try {
    const p = (await call('POST', '/api/v1/players', { name: 'Elif' })).body
    await call('PUT', SCORES, { total: 400, weekly: 150, week, level: 12, words: 60 }, { token: p.token })
    const admin = (await login('riza', 'dogru-sifre-123')).cookie
    const viewer = (await login('izleyici', 'izleyici-sifre-1')).cookie
    const path = `/api/v1/admin/players/${p.id}/adjust`

    assert.equal((await call('POST', path, { total: 500 }, { cookie: viewer })).status, 403)
    assert.equal((await call('POST', path, { total: 500 })).status, 401)
    assert.equal((await call('POST', path, { total: 500 }, { cookie: admin, origin: 'https://kotu.example' })).status, 403)
    assert.equal((await call('POST', path, { total: 500 }, { token: p.token })).status, 401)   // oyuncu jetonu yönetici sayılmaz
    for (const [bad, error] of [
      [{ total: -1 }, 'total'], [{ total: 1.5 }, 'total'], [{ total: '500' }, 'total'], [{ total: 1_000_000_001 }, 'total'],
      [{ weekly: -1 }, 'weekly'], [{ level: 100_001 }, 'level'], [{ level: 2.5 }, 'level'], [{ level: [3] }, 'level'],
      [{}, 'nothing'], [{ total: 400, weekly: 150, level: 12 }, 'nothing'], [{ note: 'yalnız not' }, 'nothing'],
      [{ weekly: 401 }, 'weekly'], [{ total: 100, weekly: 150 }, 'weekly'],
    ] as const) {
      const r = await call('POST', path, bad, { cookie: admin })
      assert.deepEqual([r.status, r.body.error], [422, error], JSON.stringify(bad))
    }
    const missing = '00000000-0000-0000-0000-000000000000'
    assert.equal((await call('POST', `/api/v1/admin/players/${missing}/adjust`, { total: 5 }, { cookie: admin })).status, 404)
    // Reddedilen isteklerin hiçbiri kayıt bırakmadı
    const detail = (await call('GET', `/api/v1/admin/players/${p.id}`, undefined, { cookie: viewer })).body
    assert.deepEqual([detail.player.total, detail.player.weekly, detail.player.level, detail.adjustments], [400, 150, 12, []])
  } finally { await stop() }
})

test('puan/bölüm ayarı tabloya hemen yansır; düzeltmeyi bilmeyen eski uygulamada oynadıkça üstüne eklenir', async () => {
  const { call, login, stop, week } = await start()
  try {
    const p = (await call('POST', '/api/v1/players', { name: 'Elif' })).body
    const other = (await call('POST', '/api/v1/players', { name: 'Mert' })).body
    await call('PUT', SCORES, { total: 400, weekly: 150, week, level: 12, words: 60 }, { token: p.token })
    await call('PUT', SCORES, { total: 900, weekly: 900, week, level: 30, words: 90 }, { token: other.token })
    const admin = (await login('riza', 'dogru-sifre-123')).cookie
    const detail = async () => (await call('GET', `/api/v1/admin/players/${p.id}`, undefined, { cookie: admin })).body

    const made = await call('POST', `/api/v1/admin/players/${p.id}/adjust`, { total: 5000, level: 100, note: '  Turnuva   ödülü ' }, { cookie: admin })
    assert.equal(made.status, 201)
    let d = await detail()
    assert.deepEqual([d.player.total, d.player.weekly, d.player.level, d.player.ranks.total], [5000, 150, 100, 1])
    assert.deepEqual(d.adjustments.map((a: any) => [a.id, a.total_from, a.total_to, a.weekly_to, a.level_from, a.level_to, a.note, a.admin, a.delivered_at, a.applied_at]),
      [[made.body.id, 400, 5000, null, 12, 100, 'Turnuva ödülü', 'riza', null, null]])
    // Öbür oyuncu tabloda onu hemen birinci görür (sıra görüntüsü yenilenir)
    const board = (await call('GET', '/api/v1/boards/total', undefined, { token: other.token })).body
    assert.deepEqual(board.entries.map((e: any) => [e.rank, e.name, e.score]), [[1, 'Elif', 5000], [2, 'Mert', 900]])

    // Eski uygulama kendi sayılarını gönderir: fark eklenir, ayar korunur; düzeltme cevapta gelir
    const first = await call('PUT', SCORES, { total: 400, weekly: 150, week, level: 12, words: 60 }, { token: p.token })
    assert.deepEqual(first.body.adjust, { id: made.body.id, week, note: 'Turnuva ödülü', total: 5000, level: 100 })
    d = await detail()
    assert.deepEqual([d.player.total, d.player.weekly, d.player.level, d.player.flags], [5000, 150, 100, 0])
    assert.ok(d.adjustments[0].delivered_at)
    assert.equal(d.adjustments[0].applied_at, null)
    // Oynadı: +120 puan, bir bölüm. Tabloya ayarın üstüne eklenir
    const second = await call('PUT', SCORES, { total: 520, weekly: 270, week, level: 13, words: 72 }, { token: p.token })
    assert.deepEqual([second.body.adjust.total, second.body.adjust.level], [5120, 101])
    d = await detail()
    assert.deepEqual([d.player.total, d.player.weekly, d.player.level, d.player.flags], [5120, 270, 101, 0])
  } finally { await stop() }
})

test('yeni uygulama düzeltmeyi cihaza işleyip kimliğini bildirince fark bir daha eklenmez', async () => {
  const { call, login, stop, week } = await start()
  try {
    const p = (await call('POST', '/api/v1/players', { name: 'Elif' })).body
    const plain = (await call('POST', '/api/v1/players', { name: 'Mert' })).body
    await call('PUT', SCORES, { total: 400, weekly: 150, week, level: 12, words: 60 }, { token: p.token })
    const admin = (await login('riza', 'dogru-sifre-123')).cookie
    const detail = async () => (await call('GET', `/api/v1/admin/players/${p.id}`, undefined, { cookie: admin })).body
    const adjust = (body: unknown) => call('POST', `/api/v1/admin/players/${p.id}/adjust`, body, { cookie: admin })
    const one = (await adjust({ total: 5000, level: 100 })).body.id

    // Uygulamaya hiç gitmemiş düzeltme (kimliği tutsa bile) kapanmaz; uydurma kimlik de kapatmaz
    const guess = await call('PUT', SCORES, { total: 400, weekly: 150, week, level: 12, words: 60, adj: one }, { token: p.token })
    assert.equal(guess.body.adjust.total, 5000)
    assert.equal((await call('PUT', SCORES, { total: 400, weekly: 150, week, level: 12, words: 60, adj: 999_999 }, { token: p.token })).body.adjust.id, one)
    assert.equal((await detail()).adjustments[0].applied_at, null)

    // Uygulama sayılarını sunucudakine getirdi (5000 puan, 100. bölüm) ve kimliği bildirdi
    const applied = await call('PUT', SCORES, { total: 5000, weekly: 150, week, level: 100, words: 60, adj: one }, { token: p.token })
    assert.equal(applied.status, 200)   // 60 kelimeyle 5000 puan: panelden eklenen puan kadar izin var
    assert.equal(applied.body.adjust, undefined)
    let d = await detail()
    assert.deepEqual([d.player.total, d.player.level, d.player.flags], [5000, 100, 0])   // 9600 değil
    assert.ok(d.adjustments[0].applied_at)
    // Panelden puan almamış oyuncu aynı sayıları gönderemez
    assert.equal((await call('PUT', SCORES, { total: 5000, weekly: 150, week, level: 100, words: 60 }, { token: plain.token })).status, 422)

    // Art arda düzeltmeler: ikincisi cihaza işlenmiş, onayı gitmeden üçüncüsü yapılmış
    const two = (await adjust({ total: 6000 })).body.id
    await call('PUT', SCORES, { total: 5000, weekly: 150, week, level: 100, words: 60, adj: one }, { token: p.token })
    const three = (await adjust({ total: 6500 })).body.id
    const mid = await call('PUT', SCORES, { total: 6000, weekly: 150, week, level: 100, words: 60, adj: two }, { token: p.token })
    assert.deepEqual(mid.body.adjust, { id: three, week, note: '', total: 6500 })   // yalnız üçüncünün farkı (+500) eklenir
    const done = await call('PUT', SCORES, { total: 6500, weekly: 150, week, level: 100, words: 60, adj: three }, { token: p.token })
    assert.equal(done.body.adjust, undefined)
    d = await detail()
    assert.deepEqual([d.player.total, d.player.flags], [6500, 0])
    assert.ok(d.adjustments.every((a: any) => a.applied_at))
    // Oyun sürer: yeni puan doğrudan sayılır
    await call('PUT', SCORES, { total: 6620, weekly: 270, week, level: 101, words: 72, adj: three }, { token: p.token })
    d = await detail()
    assert.deepEqual([d.player.total, d.player.weekly, d.player.level], [6620, 270, 101])
  } finally { await stop() }
})

test('puan ve bölüm düşürme: eski değer geri gelmez, haftalık toplamı aşmaz', async () => {
  const { call, login, stop, week } = await start()
  try {
    const p = (await call('POST', '/api/v1/players', { name: 'Elif' })).body
    const raw = { total: 3000, weekly: 800, week, level: 40, words: 250 }
    await call('PUT', SCORES, raw, { token: p.token })
    const admin = (await login('riza', 'dogru-sifre-123')).cookie
    const detail = async () => (await call('GET', `/api/v1/admin/players/${p.id}`, undefined, { cookie: admin })).body

    const made = await call('POST', `/api/v1/admin/players/${p.id}/adjust`, { total: 500, level: 10 }, { cookie: admin })
    let d = await detail()
    assert.deepEqual([d.player.total, d.player.weekly, d.player.level], [500, 500, 10])
    assert.deepEqual([d.adjustments[0].weekly_from, d.adjustments[0].weekly_to], [800, 500])   // haftalık kendiliğinden indi
    // Cihaz eski (yüksek) sayılarını göndermeyi sürdürür: tablo ayarda kalır, şüpheli de sayılmaz
    const put = await call('PUT', SCORES, raw, { token: p.token })
    assert.deepEqual(put.body.adjust, { id: made.body.id, week, note: '', total: 500, weekly: 500, level: 10 })
    d = await detail()
    assert.deepEqual([d.player.total, d.player.weekly, d.player.level, d.player.flags], [500, 500, 10, 0])
    // Uygulama cihaza işledi
    await call('PUT', SCORES, { total: 500, weekly: 500, week, level: 10, words: 250, adj: made.body.id }, { token: p.token })
    d = await detail()
    assert.deepEqual([d.player.total, d.player.weekly, d.player.level, d.player.flags], [500, 500, 10, 0])
  } finally { await stop() }
})

test('cihaz sunucunun gerisindeyse (yedekten dönmüş) düzeltme cihazı sunucudaki değere getirir', async () => {
  const { call, login, stop, week } = await start()
  try {
    const p = (await call('POST', '/api/v1/players', { name: 'Elif' })).body
    await call('PUT', SCORES, { total: 3000, weekly: 0, week, level: 40, words: 250 }, { token: p.token })
    const admin = (await login('riza', 'dogru-sifre-123')).cookie
    await call('POST', `/api/v1/admin/players/${p.id}/adjust`, { total: 4000, level: 60 }, { cookie: admin })
    // Cihazda eski bir yedek: 1000 puan, 5. bölüm, 30 kelime. Fark eklenince 2000 / 25 eder; tablo en iyiyi (ayarı) tutar
    const put = await call('PUT', SCORES, { total: 1000, weekly: 0, week, level: 5, words: 30 }, { token: p.token })
    assert.deepEqual([put.body.adjust.total, put.body.adjust.level], [4000, 60])
    // Cihaz sayılarını sunucudakine getirdi: 30 kelimeyle 4000 puan (panelden eklenen 1000'den fazlası) reddedilmez
    const applied = await call('PUT', SCORES, { total: 4000, weekly: 0, week, level: 60, words: 30, adj: put.body.adjust.id }, { token: p.token })
    assert.deepEqual([applied.status, applied.body.adjust], [200, undefined])
    const d = (await call('GET', `/api/v1/admin/players/${p.id}`, undefined, { cookie: admin })).body
    assert.deepEqual([d.player.total, d.player.level, d.player.words, d.player.flags], [4000, 60, 250, 0])
  } finally { await stop() }
})

test('haftalık puan ayarı yalnız yapıldığı haftada geçer', async () => {
  const clock = { t: Date.UTC(2026, 10, 8, 12) }
  const { call, login, stop } = await start(() => clock.t)
  try {
    const week = weekOf(clock.t)
    const p = (await call('POST', '/api/v1/players', { name: 'Elif' })).body
    await call('PUT', SCORES, { total: 1000, weekly: 200, week, level: 10, words: 100 }, { token: p.token })
    const admin = (await login('riza', 'dogru-sifre-123')).cookie
    const detail = async () => (await call('GET', `/api/v1/admin/players/${p.id}`, undefined, { cookie: admin })).body
    const made = await call('POST', `/api/v1/admin/players/${p.id}/adjust`, { weekly: 900 }, { cookie: admin })
    let d = await detail()
    assert.deepEqual([d.player.weekly, d.player.total], [900, 1000])
    const same = await call('PUT', SCORES, { total: 1000, weekly: 200, week, level: 10, words: 100 }, { token: p.token })
    assert.deepEqual(same.body.adjust, { id: made.body.id, week, note: '', weekly: 900 })
    assert.equal((await detail()).player.weekly, 900)

    // Hafta döndü (pazar 07:00 UTC): cihazın yeni haftadaki puanına eski haftanın farkı eklenmez
    clock.t += 6 * 86_400_000 + 20 * 3_600_000
    const next = weekOf(clock.t)
    assert.equal(next, week + 1)
    const later = await call('PUT', SCORES, { total: 1150, weekly: 150, week: next, level: 11, words: 110 }, { token: p.token })
    assert.deepEqual(later.body.adjust, { id: made.body.id, week: next, note: '' })   // işlenecek alan kalmadı; kimlik kapanış için gider
    d = await detail()
    assert.deepEqual([d.player.total, d.player.weekly], [1150, 150])
    // Uygulama kimliği bildirir, düzeltme kapanır
    const closed = await call('PUT', SCORES, { total: 1150, weekly: 150, week: next, level: 11, words: 110, adj: made.body.id }, { token: p.token })
    assert.equal(closed.body.adjust, undefined)
    assert.ok((await detail()).adjustments[0].applied_at)
  } finally { await stop() }
})

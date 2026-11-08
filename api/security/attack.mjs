// Wordvoya API saldırı denemeleri (güvenlik incelemesi 2026-11-08): bellekte bir kopya, gerçek sınırlarla. Canlıya dokunmaz.
// Kullanım: npm run security
import { createHash, randomBytes } from 'node:crypto'
import { request as httpRequest } from 'node:http'

const { Store, weekOf } = await import('../src/db.ts')
const { createApp } = await import('../src/server.ts')
const { AdminStore } = await import('../src/admin.ts')
const { createIntegrityChecker, sha256Hex } = await import('../src/integrity.ts')

const store = new Store(':memory:')
const admins = new AdminStore(store)
const pw = randomBytes(12).toString('base64url')
await admins.addAdmin('riza', pw, 'admin')
await admins.addAdmin('izleyici', pw, 'viewer')
// Zorunlu mod; "Google" yalnız bilinen jetonları tanır
const known = new Map()
const integrity = createIntegrityChecker({ mode: 'enforce', packageName: 'com.cranked.wordvoya', decode: async (t) => known.get(t) ?? {} })
const server = createApp(store, { secureCookie: false, integrity })   // varsayılan sınırlar
await new Promise((r) => server.listen(0, '127.0.0.1', r))
const port = server.address().port
const week = weekOf(Date.now())

// Ham istek (yol olduğu gibi gider; fetch ../ kısaltmasın)
function raw(method, path, { body, headers = {} } = {}) {
  return new Promise((resolve) => {
    if (body !== undefined) headers = { ...headers, 'content-length': Buffer.byteLength(body) }
    const req = httpRequest({ host: '127.0.0.1', port, method, path, headers }, (res) => {
      let data = ''
      res.on('data', (c) => { data += c })
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, text: data, json: (() => { try { return JSON.parse(data) } catch { return null } })() }))
    })
    req.on('error', (e) => resolve({ status: 0, text: String(e) }))
    if (body !== undefined) req.write(body)
    req.end()
  })
}
const json = (method, path, obj, headers = {}) =>
  raw(method, path, { body: obj === undefined ? undefined : typeof obj === 'string' ? obj : JSON.stringify(obj), headers: { 'content-type': 'application/json', ...headers } })
const bearer = (t) => ({ authorization: `Bearer ${t}` })

const results = []
function check(area, name, ok, detail = '') { results.push({ area, name, ok, detail }) }

// Gerçek uygulamanın yapacağı kayıt: gövdeye bağlı geçerli jeton
async function register(name, ip) {
  const body = JSON.stringify({ name, nonce: randomBytes(8).toString('hex') })
  const tok = 'ok-' + randomBytes(6).toString('hex')
  known.set(tok, {
    requestDetails: { requestPackageName: 'com.cranked.wordvoya', requestHash: sha256Hex(body), timestampMillis: String(Date.now()) },
    appIntegrity: { appRecognitionVerdict: 'PLAY_RECOGNIZED' },
    deviceIntegrity: { deviceRecognitionVerdict: ['MEETS_DEVICE_INTEGRITY'] },
  })
  return (await raw('POST', '/api/v1/players', { body, headers: { 'content-type': 'application/json', 'x-integrity-token': tok, ...(ip ? { 'x-real-ip': ip } : {}) } })).json
}

// --- Kayıt ve bütünlük ---
let r = await json('POST', '/api/v1/players', { name: 'Betik Oyuncu' })
check('Kayıt', 'Bütünlük jetonsuz kayıt', r.status === 403, `${r.status}`)
r = await json('POST', '/api/v1/players', { name: 'Betik Oyuncu' }, { 'x-integrity-token': 'uydurma' })
check('Kayıt', 'Uydurma bütünlük jetonu', r.status === 403, `${r.status}`)
{
  const body = JSON.stringify({ name: 'Elif', nonce: 'abcdef0123456789' })
  const tok = 'tekrar-jetonu'
  known.set(tok, { requestDetails: { requestPackageName: 'com.cranked.wordvoya', requestHash: sha256Hex(body), timestampMillis: String(Date.now()) }, appIntegrity: { appRecognitionVerdict: 'PLAY_RECOGNIZED' }, deviceIntegrity: { deviceRecognitionVerdict: ['MEETS_BASIC_INTEGRITY'] } })
  const first = await raw('POST', '/api/v1/players', { body, headers: { 'content-type': 'application/json', 'x-integrity-token': tok } })
  const replay = await raw('POST', '/api/v1/players', { body: JSON.stringify({ name: 'Elif2', nonce: 'abcdef0123456789' }), headers: { 'content-type': 'application/json', 'x-integrity-token': tok } })
  const replaySame = await raw('POST', '/api/v1/players', { body, headers: { 'content-type': 'application/json', 'x-integrity-token': tok } })
  check('Kayıt', 'Geçerli jetonla kayıt', first.status === 201, `${first.status}`)
  check('Kayıt', 'Jeton başka gövdeyle (ad değiştirilmiş)', replay.status === 403, `${replay.status}`)
  check('Kayıt', 'Aynı jeton ikinci kez (tekrar oynatma)', replaySame.status === 403, `${replaySame.status}`)
}
r = await raw('POST', '/api/v1/players', { body: JSON.stringify({ name: 'Uzun Jeton' }), headers: { 'content-type': 'application/json', 'x-integrity-token': 'a'.repeat(9000) } })
check('Kayıt', '9000 karakterlik bütünlük jetonu', r.status === 403, `${r.status}`)

const a = await register('Ayşe Deneme')
const b = await register('Mert Deneme')
check('Kayıt', 'Deneme oyuncuları açıldı', !!a?.token && !!b?.token)

// --- Kimlik doğrulama ---
r = await raw('GET', '/api/v1/boards/total')
check('Yetki', 'Jetonsuz tablo okuma', r.status === 401, `${r.status}`)
r = await raw('GET', '/api/v1/boards/total', { headers: bearer('yanlis') })
check('Yetki', 'Yanlış jetonla tablo', r.status === 401, `${r.status}`)
r = await raw('GET', '/api/v1/boards/total', { headers: bearer('x'.repeat(5000)) })
check('Yetki', '5000 karakterlik jeton', r.status === 401, `${r.status}`)
r = await raw('GET', '/api/v1/boards/total', { headers: { authorization: `bearer ${a.token}` } })
check('Yetki', 'Küçük harfli "bearer" şeması', r.status === 401 || r.status === 200, `${r.status} (ikisi de güvenli)`)
r = await json('PUT', '/api/v1/players/me/scores', { total: 10, weekly: 10, week, level: 1, words: 10 })
check('Yetki', 'Jetonsuz skor yazma', r.status === 401, `${r.status}`)
r = await json('PATCH', '/api/v1/players/me', { name: 'Hacker' })
check('Yetki', 'Jetonsuz ad değiştirme', r.status === 401, `${r.status}`)
r = await raw('DELETE', '/api/v1/players/me')
check('Yetki', 'Jetonsuz silme', r.status === 401, `${r.status}`)

// Başka oyuncunun kaydı (IDOR): uçlarda kimlik yok, yalnız /me
r = await json('PUT', `/api/v1/players/${b.id}/scores`, { total: 10, weekly: 10, week, level: 1, words: 10 }, bearer(a.token))
check('Yetki', 'Başka oyuncunun skoruna yazma (IDOR)', r.status === 404, `${r.status}`)
r = await raw('DELETE', `/api/v1/players/${b.id}`, { headers: bearer(a.token) })
check('Yetki', 'Başka oyuncuyu silme (IDOR)', r.status === 404, `${r.status}`)
r = await raw('GET', `/api/v1/admin/players/${b.id}`, { headers: bearer(a.token) })
check('Yetki', 'Oyuncu jetonuyla panel ucu', r.status === 401, `${r.status}`)

// --- Skor hilesi ---
const put = (obj) => json('PUT', '/api/v1/players/me/scores', obj, bearer(a.token))
r = await put({ total: 10_000_000, weekly: 0, week, level: 1, words: 10 })
check('Hile', 'Kelime sayısına göre imkânsız toplam', r.status === 422, `${r.status}`)
r = await put({ total: 1e308, weekly: 0, week, level: 1, words: 10 })
check('Hile', '1e308 puan', r.status === 422, `${r.status}`)
r = await put({ total: '100', weekly: 0, week, level: 1, words: 10 })
check('Hile', 'Metin olarak puan', r.status === 422, `${r.status}`)
r = await put({ total: 50, weekly: 80, week, level: 1, words: 10 })
check('Hile', 'Haftalık > toplam', r.status === 422, `${r.status}`)
r = await put({ total: 50, weekly: 10, week, level: 1, words: 10, diamonds: -5 })
check('Hile', 'Eksi elmas bakiyesi', r.status === 422, `${r.status}`)
r = await put({ total: 50, weekly: 10, week, level: 1, words: 10, levels: Array.from({ length: 101 }, (_, i) => ({ level: i + 1, seconds: 5, score: 10 })) })
check('Hile', '101 bölüm sonucu tek seferde', r.status === 422, `${r.status}`)
r = await put({ total: 50, weekly: 10, week, level: 1, words: 10, levels: [{ level: 1, seconds: 5, score: 999_999 }] })
check('Hile', 'Bölüm başına imkânsız puan', r.status === 422, `${r.status}`)

// --- Gövde ve JSON ---
r = await json('PUT', '/api/v1/players/me/scores', '{"__proto__":{"total":5},"constructor":{"prototype":{"x":1}}}', bearer(a.token))
check('Girdi', '__proto__ zehirleme denemesi', r.status === 422 || r.status === 400, `${r.status}`)
check('Girdi', 'Prototip kirlenmedi', ({}).total === undefined && ({}).x === undefined)
r = await json('PATCH', '/api/v1/players/me', '[1,2,3]', bearer(a.token))
check('Girdi', 'Dizi gövde', r.status === 400, `${r.status}`)
r = await json('PATCH', '/api/v1/players/me', 'null', bearer(a.token))
check('Girdi', 'null gövde', r.status === 400, `${r.status}`)
r = await json('PATCH', '/api/v1/players/me', '{"name":', bearer(a.token))
check('Girdi', 'Bozuk JSON', r.status === 400, `${r.status}`)
r = await json('PATCH', '/api/v1/players/me', JSON.stringify({ name: 'x', pad: 'y'.repeat(9000) }), bearer(a.token))
check('Girdi', '9 KB gövde', r.status === 413, `${r.status}`)
r = await json('PATCH', '/api/v1/players/me', '['.repeat(4000), bearer(a.token))
check('Girdi', 'Derin iç içe JSON', r.status === 400, `${r.status}`)

// --- Ad kuralları (enjeksiyon, görünmez karakter) ---
const nameRes = async (name) => (await json('PATCH', '/api/v1/players/me', { name }, bearer(a.token))).status
check('Girdi', 'HTML/betik adı', (await nameRes('<img src=x onerror=alert(1)>')) === 422)
check('Girdi', "SQL adı (Robert'); DROP TABLE)", (await nameRes("x'); DROP TABLE players;--")) === 422)
check('Girdi', 'Sağdan-sola yön değiştirici (U+202E)', (await nameRes('abc‮dcba')) === 422)
check('Girdi', 'Yalnız görünmez karakter', (await nameRes('‌‌‌')) === 422)
check('Girdi', 'Satır sonu / sekme', (await nameRes('Ali\nVeli')) === 200 || (await nameRes('Ali\nVeli')) === 422, 'boşluğa iner ya da reddedilir')
check('Veri', 'players tablosu yerinde', store.count() >= 2)

// --- Yol ve yöntem oyunları ---
for (const p of ['/api/admin/../src/db.ts', '/api/admin/..%2fsrc%2fdb.ts', '/api/admin/%2e%2e/src/server.ts', '/api/admin/app.js/../../src/db.ts', '/api/admin//etc/passwd', '/api/admin/index.html']) {
  r = await raw('GET', p)
  check('Yol', `GET ${p}`, r.status === 404 && !r.text.includes('DatabaseSync'), `${r.status}`)
}
r = await raw('POST', '/api/v1/boards/total', { headers: bearer(a.token) })
check('Yol', 'Tabloya POST', r.status === 404, `${r.status}`)
r = await raw('TRACE', '/api/v1/health')
check('Yol', 'TRACE yöntemi', r.status !== 200 || !r.text.includes('TRACE'), `${r.status}`)

// --- Hediye elmas ---
const adminLogin = async (u, p) => {
  const res = await json('POST', '/api/v1/admin/login', { username: u, password: p })
  return { status: res.status, cookie: (res.headers['set-cookie']?.[0] ?? '').split(';')[0], setCookie: res.headers['set-cookie']?.[0] ?? '' }
}
const adm = await adminLogin('riza', pw)
const grant = await json('POST', `/api/v1/admin/players/${b.id}/grants`, { amount: 500 }, { cookie: adm.cookie })
r = await json('POST', '/api/v1/players/me/grants/ack', { ids: [grant.json.id] }, bearer(a.token))
const bGrants = (await json('PUT', '/api/v1/players/me/scores', { total: 0, weekly: 0, week, level: 0, words: 0 }, bearer(b.token))).json.grants
check('Hediye', 'Başkasının hediyesini onaylayıp yok etme', bGrants.length === 1, `B'nin bekleyen hediyesi: ${bGrants.length}`)
const aGrants = (await put({ total: 0, weekly: 0, week, level: 0, words: 0 })).json.grants
check('Hediye', 'Başkasının hediyesi bana gelmez', aGrants.length === 0)
r = await json('POST', `/api/v1/admin/players/${b.id}/grants`, { amount: 100_001 }, { cookie: adm.cookie })
check('Hediye', 'Sınır üstü hediye (100.001)', r.status === 422, `${r.status}`)

// --- Panel: oturum, roller, CSRF, enjeksiyon ---
check('Panel', 'Çerez HttpOnly + SameSite=Strict + Path=/api', /HttpOnly/.test(adm.setCookie) && /SameSite=Strict/.test(adm.setCookie) && /Path=\/api/.test(adm.setCookie), adm.setCookie.replace(/wv_admin=[^;]+/, 'wv_admin=…'))
r = await raw('GET', '/api/v1/admin/me', { headers: { cookie: 'wv_admin=' + 'A'.repeat(43) } })
check('Panel', 'Uydurma oturum çerezi', r.status === 401, `${r.status}`)
r = await raw('GET', '/api/v1/admin/me', { headers: { cookie: `wv_admin=${adm.cookie.split('=')[1]}x` } })
check('Panel', 'Bozulmuş oturum çerezi', r.status === 401, `${r.status}`)
const viewer = await adminLogin('izleyici', pw)
r = await json('POST', `/api/v1/admin/players/${b.id}/grants`, { amount: 5 }, { cookie: viewer.cookie })
check('Panel', 'İzleyici elmas veremez', r.status === 403, `${r.status}`)
r = await json('DELETE', `/api/v1/admin/players/${b.id}`, {}, { cookie: viewer.cookie })
check('Panel', 'İzleyici oyuncu silemez', r.status === 403, `${r.status}`)
r = await json('POST', '/api/v1/admin/test-players', { name: 'İzleyici Deneme' }, { cookie: viewer.cookie })
check('Panel', 'İzleyici deneme oyuncusu açamaz', r.status === 403, `${r.status}`)
r = await json('POST', `/api/v1/admin/players/${b.id}/grants`, { amount: 5 }, { cookie: adm.cookie, origin: 'https://kotu.example' })
check('Panel', 'CSRF: başka kaynaktan istek', r.status === 403, `${r.status}`)
r = await raw('POST', `/api/v1/admin/players/${b.id}/grants`, { body: 'amount=5', headers: { cookie: adm.cookie, 'content-type': 'application/x-www-form-urlencoded' } })
check('Panel', 'CSRF: form gönderimi', r.status === 415, `${r.status}`)
r = await raw('POST', `/api/v1/admin/players/${b.id}/grants`, { body: '{"amount":5}', headers: { cookie: adm.cookie, 'content-type': 'text/plain' } })
check('Panel', 'CSRF: text/plain JSON', r.status === 415, `${r.status}`)
for (const q of ["sort=total;DROP TABLE players", "sort=name&dir=asc;--", "sort=(SELECT pass_hash FROM admins)", "q=%25%27%20OR%201%3D1--", "offset=-5", "offset=1e9", "offset=abc"]) {
  r = await raw("GET", `/api/v1/admin/players?${q.includes("%") ? q : encodeURI(q)}`, { headers: { cookie: viewer.cookie } })
  check('Panel', `Sorgu: ${decodeURIComponent(q)}`, r.status === 200 && !r.text.includes('scrypt$') && store.count() >= 2, `${r.status}`)
}
r = await raw('GET', '/api/admin/')
check('Panel', 'CSP + frame-ancestors none + noindex', /frame-ancestors 'none'/.test(r.headers['content-security-policy'] ?? '') && /noindex/.test(r.headers['x-robots-tag'] ?? ''))
const detail = (await raw('GET', `/api/v1/admin/players/${b.id}`, { headers: { cookie: viewer.cookie } })).text
check('Panel', 'Yanıtta jeton/şifre özeti yok', !detail.includes('token_hash') && !detail.includes(b.token) && !detail.includes('scrypt$'))
r = await json('POST', '/api/v1/admin/logout', {}, { cookie: adm.cookie })
r = await raw('GET', '/api/v1/admin/me', { headers: { cookie: adm.cookie } })
check('Panel', 'Çıkıştan sonra eski çerez', r.status === 401, `${r.status}`)

// Kaba kuvvet (10 deneme / 15 dk)
let codes = []
for (let i = 0; i < 12; i++) codes.push((await json('POST', '/api/v1/admin/login', { username: 'riza', password: 'yanlis' + i }, { 'x-real-ip': '10.9.9.9' })).status)
check('Panel', 'Şifre kaba kuvveti 10 denemede kesilir', codes.slice(0, 10).every((c) => c === 401) && codes.slice(10).every((c) => c === 429), codes.join(','))
r = await json('POST', '/api/v1/admin/login', { username: 'riza', password: pw }, { 'x-real-ip': '10.9.9.9' })
check('Panel', 'Kesilen IP doğru şifreyle de giremez', r.status === 429, `${r.status}`)

// Zamanlama: var olan / olmayan kullanıcı
const time = async (u) => { const t = performance.now(); await json('POST', '/api/v1/admin/login', { username: u, password: 'yanlis-sifre' }, { 'x-real-ip': '10.1.' + Math.floor(Math.random() * 250) + '.' + Math.floor(Math.random() * 250) }); return performance.now() - t }
const known1 = [], unknown1 = []
for (let i = 0; i < 6; i++) { known1.push(await time('riza')); unknown1.push(await time('yok-boyle-biri')) }
const med = (x) => x.sort((p, q) => p - q)[Math.floor(x.length / 2)]
check('Panel', 'Kullanıcı adı zamanlamayla anlaşılmaz', Math.abs(med(known1) - med(unknown1)) < 30, `var: ${med(known1).toFixed(0)} ms, yok: ${med(unknown1).toFixed(0)} ms`)

// --- Hız sınırı ---
codes = []
for (let i = 0; i < 305; i++) codes.push((await raw('GET', '/api/v1/boards/total', { headers: { ...bearer(a.token), 'x-real-ip': '10.7.7.7' } })).status)
check('Sınır', 'Dakikada 300 istek sınırı', codes.slice(0, 300).every((c) => c === 200) && codes.slice(300).every((c) => c === 429), `200: ${codes.filter((c) => c === 200).length}, 429: ${codes.filter((c) => c === 429).length}`)
codes = []
for (let i = 0; i < 62; i++) codes.push((await json('POST', '/api/v1/players', { name: `Yigin ${i}` }, { 'x-real-ip': '10.8.8.8' })).status)
check('Sınır', 'Saatte 60 kayıt sınırı (IP başına)', codes.slice(60).every((c) => c === 429), `son iki: ${codes.slice(60).join(',')}`)

// --- Sonuç ---
server.close()
store.close()
const bad = results.filter((x) => !x.ok)
const pad = (s, n) => (s + ' '.repeat(n)).slice(0, n)
for (const x of results) console.log(`${x.ok ? 'GEÇTİ' : 'KALDI'}  ${pad(x.area, 7)} ${pad(x.name, 52)} ${x.detail}`)
console.log(`\n${results.length} deneme, ${bad.length} kaldı`)

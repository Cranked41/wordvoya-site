import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { AddressInfo } from 'node:net'
import { createVerify, generateKeyPairSync } from 'node:crypto'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Store } from '../src/db.ts'
import { createApp } from '../src/server.ts'
import { AdminStore } from '../src/admin.ts'
import { createIntegrityChecker, evaluate, type IntegrityMode, type IntegrityPayload, sha256Hex } from '../src/integrity.ts'

const PKG = 'com.cranked.wordvoya'
const NOW = Date.UTC(2026, 10, 8, 12)

/** Google'ın bu gövde için döndüreceği geçerli karar. */
const goodPayload = (body: string, over: Partial<IntegrityPayload> = {}): IntegrityPayload => ({
  requestDetails: { requestPackageName: PKG, requestHash: sha256Hex(body), timestampMillis: String(NOW - 2000) },
  appIntegrity: { appRecognitionVerdict: 'PLAY_RECOGNIZED' },
  deviceIntegrity: { deviceRecognitionVerdict: ['MEETS_DEVICE_INTEGRITY'] },
  ...over,
})

test('karar: paket, gövde özeti, tazelik, uygulama ve cihaz', () => {
  const body = '{"name":"Elif","nonce":"a1a1a1a1a1a1a1a1"}'
  const opts = { packageName: PKG, rawBody: Buffer.from(body), now: NOW, maxAgeMs: 5 * 60_000 }
  assert.deepEqual(evaluate(goodPayload(body), opts), { ok: true, reason: 'ok' })
  assert.equal(evaluate({}, opts).reason, 'no_details')
  assert.equal(evaluate(goodPayload(body, { requestDetails: { ...goodPayload(body).requestDetails, requestPackageName: 'com.kotu.app' } }), opts).reason, 'package')
  // Jeton başka bir gövde için alınmış (ör. ad değiştirilmiş)
  assert.equal(evaluate(goodPayload('{"name":"Başka"}'), opts).reason, 'hash')
  assert.equal(evaluate(goodPayload(body, { requestDetails: { ...goodPayload(body).requestDetails, timestampMillis: String(NOW - 6 * 60_000) } }), opts).reason, 'stale')
  assert.equal(evaluate(goodPayload(body, { requestDetails: { ...goodPayload(body).requestDetails, timestampMillis: String(NOW + 5 * 60_000) } }), opts).reason, 'stale')
  assert.equal(evaluate(goodPayload(body, { appIntegrity: { appRecognitionVerdict: 'UNRECOGNIZED_VERSION' } }), opts).reason, 'app')
  assert.equal(evaluate(goodPayload(body, { deviceIntegrity: { deviceRecognitionVerdict: [] } }), opts).reason, 'device')
  assert.equal(evaluate(goodPayload(body, { deviceIntegrity: { deviceRecognitionVerdict: ['MEETS_BASIC_INTEGRITY'] } }), opts).ok, true)
})

async function start(mode: IntegrityMode, decode: (t: string) => Promise<IntegrityPayload>) {
  const store = new Store(':memory:', () => NOW)
  const admins = new AdminStore(store)
  await admins.addAdmin('riza', 'dogru-sifre-123', 'admin')
  await admins.addAdmin('izleyici', 'izleyici-sifre-1', 'viewer')
  const integrity = createIntegrityChecker({ mode, packageName: PKG, decode, now: () => NOW })
  const server = createApp(store, { now: () => NOW, perMinute: 1000, playersPerHour: 1000, secureCookie: false, integrity })
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r))
  const root = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/v1`
  const register = async (body: string, token?: string) => {
    const res = await fetch(`${root}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { 'X-Integrity-Token': token } : {}) },
      body,
    })
    return { status: res.status, body: (await res.json()) as any }
  }
  const call = async (method: string, path: string, body?: unknown, cookie?: string) => {
    const res = await fetch(root + path, {
      method,
      headers: { ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(cookie ? { Cookie: cookie } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    return { status: res.status, body: (await res.json()) as any, headers: res.headers }
  }
  const login = async (username: string, password: string) =>
    (await call('POST', '/admin/login', { username, password })).headers.getSetCookie()[0].split(';')[0]
  const stop = () => new Promise<void>((r) => server.close(() => { store.close(); r() }))
  return { register, call, login, stop }
}

test('zorunlu modda: jetonsuz, sahte ve tekrar kullanılan jeton reddedilir', async () => {
  const tokens = new Map<string, IntegrityPayload>()
  const { register, call, login, stop } = await start('enforce', async (t) => tokens.get(t) ?? {})
  try {
    const body = '{"name":"Elif","nonce":"0000000000000001"}'
    tokens.set('iyi-jeton', goodPayload(body))
    assert.equal((await register(body)).status, 403)                       // jeton yok
    tokens.set('noncesuz', goodPayload('{"name":"Elif"}'))
    assert.equal((await register('{"name":"Elif"}', 'noncesuz')).status, 403)   // gövdede nonce yok
    assert.equal((await register(body, 'uydurma')).status, 403)            // Google tanımıyor
    assert.equal((await register('{"name":"Elif","nonce":"0000000000000002"}', 'iyi-jeton')).status, 403)   // başka gövdenin jetonu
    assert.equal((await register(body, 'iyi-jeton')).status, 201)
    const again = await register(body, 'iyi-jeton')                        // aynı jeton ikinci kez
    assert.equal(again.status, 403)
    assert.equal(again.body.error, 'integrity')

    const summary = (await call('GET', '/admin/summary', undefined, await login('izleyici', 'izleyici-sifre-1'))).body
    assert.equal(summary.integrity.mode, 'enforce')
    assert.deepEqual(summary.integrity.results, { missing: 1, nonce: 1, no_details: 1, hash: 1, ok: 1, replay: 1 })
  } finally { await stop() }
})

test('kaydet modunda: geçmeyen kayıt da açılır ama sayılır', async () => {
  const { register, call, login, stop } = await start('report', async () => ({}))
  try {
    assert.equal((await register('{"name":"Elif"}')).status, 201)
    assert.equal((await register('{"name":"Mert","nonce":"00000000000000aa"}', 'x')).status, 201)
    assert.equal((await register('{"name":"Can"}', 'x')).status, 201)   // nonce yok: sayılır, açılır
    const summary = (await call('GET', '/admin/summary', undefined, await login('riza', 'dogru-sifre-123'))).body
    assert.deepEqual(summary.integrity.results, { missing: 1, no_details: 1, nonce: 1 })
  } finally { await stop() }
})

test('Google ulaşılamazsa zorunlu modda kayıt açılmaz', async () => {
  const { register, stop } = await start('enforce', async () => { throw new Error('ağ yok') })
  try {
    assert.equal((await register('{"name":"Elif","nonce":"00000000000000bb"}', 'jeton')).status, 403)
  } finally { await stop() }
})

test('servis hesabı: imzalı JWT ile erişim jetonu alınır, jeton Google ucuna gider', async () => {
  const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 })
  const dir = mkdtempSync(join(tmpdir(), 'wv-int-'))
  const keyFile = join(dir, 'key.json')
  writeFileSync(keyFile, JSON.stringify({
    client_email: 'wordvoya@proje.iam.gserviceaccount.com',
    private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }),
    token_uri: 'https://oauth2.googleapis.com/token',
  }))
  const body = '{"name":"Elif","nonce":"cccccccccccccccc"}'
  const calls: { url: string; init: RequestInit }[] = []
  const fakeFetch = (async (url: string, init: RequestInit) => {
    calls.push({ url: String(url), init })
    if (String(url).includes('oauth2')) return new Response(JSON.stringify({ access_token: 'erisim-1', expires_in: 3600 }))
    return new Response(JSON.stringify({ tokenPayloadExternal: goodPayload(body) }))
  }) as typeof fetch
  const checker = createIntegrityChecker({ mode: 'enforce', packageName: PKG, keyFile, fetch: fakeFetch, now: () => NOW })

  assert.deepEqual(await checker.check('uygulama-jetonu', Buffer.from(body)), { ok: true, reason: 'ok' })
  // JWT: Google'ın beklediği alanlar ve geçerli RS256 imzası
  const assertion = new URLSearchParams(String(calls[0].init.body)).get('assertion')!
  const [head, claims, sig] = assertion.split('.')
  const c = JSON.parse(Buffer.from(claims, 'base64url').toString())
  assert.equal(c.iss, 'wordvoya@proje.iam.gserviceaccount.com')
  assert.equal(c.scope, 'https://www.googleapis.com/auth/playintegrity')
  assert.equal(c.exp - c.iat, 3600)
  assert.ok(createVerify('RSA-SHA256').update(`${head}.${claims}`).verify(publicKey, Buffer.from(sig, 'base64url')))
  // Çözme isteği
  assert.equal(calls[1].url, `https://playintegrity.googleapis.com/v1/${PKG}:decodeIntegrityToken`)
  assert.equal((calls[1].init.headers as Record<string, string>).Authorization, 'Bearer erisim-1')
  assert.deepEqual(JSON.parse(String(calls[1].init.body)), { integrity_token: 'uygulama-jetonu' })
  // Erişim jetonu önbellekte: ikinci kayıtta yeniden alınmaz
  await checker.check('baska', Buffer.from('{"name":"Mert","nonce":"dddddddddddddddd"}'))
  assert.equal(calls.filter((x) => x.url.includes('oauth2')).length, 1)
})

test('panel: admin deneme oyuncusu açar, gizler ve siler; izleyici yapamaz', async () => {
  const { call, login, stop } = await start('enforce', async () => ({}))
  try {
    const admin = await login('riza', 'dogru-sifre-123')
    const viewer = await login('izleyici', 'izleyici-sifre-1')
    assert.equal((await call('POST', '/admin/test-players', { name: 'Postman Deneme' }, viewer)).status, 403)
    const p = await call('POST', '/admin/test-players', { name: 'Postman Deneme' }, admin)
    assert.equal(p.status, 201)
    assert.ok(p.body.token)
    assert.equal((await call('POST', '/admin/test-players', { name: 'postman deneme' }, admin)).status, 409)

    assert.equal((await call('PATCH', `/admin/players/${p.body.id}`, { hidden: true }, viewer)).status, 403)
    assert.equal((await call('PATCH', `/admin/players/${p.body.id}`, { hidden: 'evet' }, admin)).status, 422)
    assert.equal((await call('PATCH', `/admin/players/${p.body.id}`, { hidden: true }, admin)).status, 200)
    assert.equal((await call('GET', `/admin/players/${p.body.id}`, undefined, admin)).body.player.hidden, true)

    assert.equal((await call('DELETE', `/admin/players/${p.body.id}`, {}, viewer)).status, 403)
    assert.equal((await call('DELETE', `/admin/players/${p.body.id}`, {}, admin)).status, 200)
    assert.equal((await call('DELETE', `/admin/players/${p.body.id}`, {}, admin)).status, 404)
  } finally { await stop() }
})

test('zorunlu mod anahtarsız kalırsa kayıt hiç açılmaz (fail closed)', async () => {
  const { failClosedChecker } = await import('../src/integrity.ts')
  const checker = failClosedChecker('no_key')
  assert.equal(checker.mode, 'enforce')
  assert.deepEqual(await checker.check('jeton', Buffer.from('{"name":"Elif","nonce":"eeeeeeeeeeeeeeee"}')), { ok: false, reason: 'no_key' })
  assert.deepEqual(checker.stats().results, { no_key: 1 })
})

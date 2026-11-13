// Wordvoya yönetim paneli. Oyuncu adları kullanıcıdan gelir: her şey textContent ile basılır, innerHTML yok.
'use strict'

const API = '/api/v1/admin'
const app = document.getElementById('app')
const who = document.getElementById('who')
let me = null
const state = { q: '', sort: 'total', dir: 'desc', offset: 0 }
// Toplu işlem için seçilen oyuncular (id → ad). Sayfa, sıralama ve arama değişse de seçim kalır.
const selected = new Map()
const BULK_CHUNK = 200   // sunucunun tek istekte kabul ettiği en çok kimlik

// --- Yardımcılar ---

function h(tag, attrs, ...children) {
  const el = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue
    if (k === 'class') el.className = v
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v)
    else if (k === 'text') el.textContent = v
    else el.setAttribute(k, v === true ? '' : v)
  }
  for (const c of children.flat()) if (c != null && c !== false) el.append(c instanceof Node ? c : String(c))
  return el
}

const nf = new Intl.NumberFormat('tr-TR')
const num = (n) => (n == null ? '—' : nf.format(n))
const dateFmt = new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium', timeStyle: 'short' })
const date = (ms) => (ms ? dateFmt.format(new Date(ms)) : '—')
function ago(ms) {
  if (!ms) return '—'
  const s = Math.round((Date.now() - ms) / 1000)
  if (s < 60) return 'az önce'
  if (s < 3600) return `${Math.floor(s / 60)} dk önce`
  if (s < 86400) return `${Math.floor(s / 3600)} sa önce`
  if (s < 30 * 86400) return `${Math.floor(s / 86400)} gün önce`
  return date(ms)
}
const secs = (s) => (s == null ? '—' : s < 60 ? `${s} sn` : `${Math.floor(s / 60)} dk ${s % 60} sn`)

class ApiError extends Error {
  constructor(status, code) { super(code); this.status = status; this.code = code }
}

async function api(method, path, body) {
  const res = await fetch(API + path, {
    method,
    credentials: 'same-origin',
    headers: body !== undefined || method !== 'GET' ? { 'Content-Type': 'application/json' } : {},
    body: body !== undefined ? JSON.stringify(body) : method !== 'GET' ? '{}' : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (res.status === 401 && path !== '/login') { me = null; showLogin(); }
    throw new ApiError(res.status, data.error || 'error')
  }
  return data
}

function stat(label, value, sub, cls) {
  return h('div', { class: 'stat' },
    h('div', { class: 'label', text: label }),
    h('div', { class: `value ${cls || ''}`, text: value }),
    sub ? h('div', { class: 'sub', text: sub }) : null)
}

const MODE_NAMES = { off: 'kapalı', report: 'yalnız kaydet', enforce: 'zorunlu' }

function integrityStat(i) {
  if (!i) return null
  const results = i.results || {}
  const ok = results.ok || 0
  const failed = Object.entries(results).filter(([k]) => k !== 'ok' && k !== 'off').reduce((a, [, n]) => a + n, 0)
  const sub = i.mode === 'off' ? 'kayıt denetlenmiyor' : `${num(ok)} geçti · ${num(failed)} geçmedi`
  const el = stat('Play Integrity', MODE_NAMES[i.mode] || i.mode, sub)
  // Ayrıntı: hangi sebeple kaç kayıt geçmedi
  el.title = Object.entries(results).map(([k, n]) => `${k}: ${n}`).join(', ') || 'henüz kayıt yok'
  return el
}

function setWho() {
  who.replaceChildren()
  who.hidden = !me
  if (!me) return
  who.append(
    h('span', { text: me.username }),
    h('span', { class: `badge ${me.role}`, text: me.role === 'admin' ? 'admin' : 'yalnız görüntüleme' }),
    h('button', { onclick: logout, text: 'Çıkış' }),
  )
}

async function logout() {
  try { await api('POST', '/logout') } catch { /* oturum zaten kapalı */ }
  me = null
  showLogin()
}

// --- Giriş ---

function showLogin() {
  setWho()
  const error = h('p', { class: 'error', role: 'alert' })
  const user = h('input', { name: 'username', autocomplete: 'username', required: true, autofocus: true })
  const pass = h('input', { name: 'password', type: 'password', autocomplete: 'current-password', required: true })
  const submit = h('button', { class: 'primary', type: 'submit', text: 'Giriş yap' })
  const form = h('form', {
    onsubmit: async (e) => {
      e.preventDefault()
      submit.disabled = true
      error.textContent = ''
      try {
        me = await api('POST', '/login', { username: user.value, password: pass.value })
        pass.value = ''
        route()
      } catch (err) {
        error.textContent = err.status === 429 ? 'Çok fazla deneme. 15 dakika sonra tekrar dene.' : 'Kullanıcı adı ya da şifre yanlış.'
      } finally {
        submit.disabled = false
      }
    },
  },
  h('label', {}, 'Kullanıcı adı', user),
  h('label', {}, 'Şifre', pass),
  error,
  submit)
  app.replaceChildren(h('div', { class: 'login card' }, h('h1', { text: 'Giriş' }), form))
  user.focus()
}

// --- Oyuncu listesi ---

const COLUMNS = [
  { key: 'rank', label: '#', num: true },
  { key: 'name', label: 'Ad', sort: 'name' },
  { key: 'total', label: 'Toplam', num: true, sort: 'total' },
  { key: 'weekly', label: 'Bu hafta', num: true, sort: 'weekly' },
  { key: 'level', label: 'Bölüm', num: true, sort: 'level' },
  { key: 'words', label: 'Kelime', num: true, sort: 'words' },
  { key: 'diamonds', label: 'Elmas', num: true, sort: 'diamonds' },
  { key: 'last', label: 'Son bölüm' },
  { key: 'createdAt', label: 'Katıldı', sort: 'created' },
  { key: 'seenAt', label: 'Son görülme', sort: 'seen' },
]

async function showList() {
  const summaryBox = h('div', { class: 'stats' })
  const search = h('input', { type: 'search', placeholder: 'Ada göre ara…', value: state.q, 'aria-label': 'Ada göre ara' })
  const tableBox = h('div')
  const bulkBox = h('div')
  app.replaceChildren(h('div', { class: 'stack' },
    h('div', {}, h('h1', { text: 'Oyuncular' }), h('p', { class: 'muted', text: me.role === 'admin'
      ? 'Satıra tıklayınca bölüm sonuçları ve elmas geçmişi açılır. Kutularla birden çok oyuncu seçip birlikte silebilirsin.'
      : 'Satıra tıklayınca bölüm sonuçları ve elmas geçmişi açılır.' })),
    summaryBox,
    h('div', { class: 'toolbar' }, search),
    bulkBox,
    tableBox))
  tableBox.bulkBox = bulkBox
  tableBox.summaryBox = summaryBox

  let timer = null
  search.addEventListener('input', () => {
    clearTimeout(timer)
    timer = setTimeout(() => { state.q = search.value.trim(); state.offset = 0; loadTable(tableBox) }, 250)
  })

  loadSummary(summaryBox)
  loadTable(tableBox)
}

function loadSummary(summaryBox) {
  api('GET', '/summary').then((s) => {
    summaryBox.replaceChildren(
      stat('Oyuncu', num(s.players)),
      stat('Son 24 saat', num(s.active1d), 'oynayan'),
      stat('Son 7 gün', num(s.active7d), 'oynayan'),
      stat('Bu hafta puan alan', num(s.playingThisWeek)),
      stat('Oyuncuların elması', num(s.diamondsHeld), 'toplam bakiye', 'gem'),
      stat('Hediye edilen elmas', num(s.diamondsGranted), s.grantsPending ? `${s.grantsPending} hediye bekliyor` : 'hepsi alındı', 'gem'),
      integrityStat(s.integrity),
    )
  }).catch(() => {})
}

// --- Toplu seçim ---

function bulkBar(box) {
  const bar = box.bulkBox
  if (!bar) return
  bar.replaceChildren()
  if (me.role !== 'admin' || !selected.size) return
  const msg = h('span', { class: 'error', role: 'status' })
  const remove = h('button', {
    class: 'danger',
    onclick: async () => {
      const names = [...selected.values()]
      const preview = names.slice(0, 8).join(', ') + (names.length > 8 ? ` ve ${num(names.length - 8)} oyuncu daha` : '')
      if (!confirm(`${num(names.length)} oyuncu silinsin mi?\n\n${preview}\n\nKayıtları, bölüm sonuçları ve hediyeleri silinir. Geri alınamaz.`)) return
      remove.disabled = true
      msg.textContent = ''
      const ids = [...selected.keys()]
      let deleted = 0
      let failure = null
      try {
        for (let i = 0; i < ids.length; i += BULK_CHUNK) {
          const part = ids.slice(i, i + BULK_CHUNK)
          deleted += (await api('POST', '/players/delete', { ids: part })).deleted
          for (const id of part) selected.delete(id)   // başarılı parça seçimden düşer; kalanlar yeniden denenebilir
        }
      } catch (e) {
        if (e.status === 401) return
        failure = e.status === 403 ? 'Bu işlem için admin yetkisi gerekir.' : `${num(deleted)} oyuncu silindi, kalanlar silinemedi. Tekrar dene.`
      }
      state.offset = 0
      loadSummary(box.summaryBox)
      await loadTable(box)
      if (failure) box.bulkBox.querySelector('[role=status]')?.replaceChildren(failure)
      else flash(box.bulkBox, `${num(deleted)} oyuncu silindi.`)
    },
    text: `Seçilenleri sil (${num(selected.size)})`,
  })
  bar.append(h('div', { class: 'bulk' },
    h('strong', { text: `${num(selected.size)} oyuncu seçili` }),
    h('button', { class: 'link', onclick: () => { selected.clear(); loadTable(box) }, text: 'Seçimi temizle' }),
    remove, msg))
}

function flash(bar, text) {
  bar.replaceChildren(h('div', { class: 'bulk ok-bar' }, h('span', { class: 'ok', text })))
  setTimeout(() => { if (bar.firstChild?.classList.contains('ok-bar')) bar.replaceChildren() }, 4000)
}

async function loadTable(box) {
  const params = new URLSearchParams({ sort: state.sort, dir: state.dir, offset: String(state.offset) })
  if (state.q) params.set('q', state.q)
  let data
  try { data = await api('GET', `/players?${params}`) } catch (e) {
    if (e.status !== 401) box.replaceChildren(h('p', { class: 'error', text: 'Liste yüklenemedi.' }))
    return
  }
  const canBulk = me.role === 'admin'
  // Başlıktaki kutu bu sayfadaki herkesi seçer/bırakır; bir kısmı seçiliyse yarım görünür
  const pageIds = data.players.map((p) => p.id)
  const onPage = pageIds.filter((id) => selected.has(id)).length
  const all = canBulk ? h('input', {
    type: 'checkbox',
    'aria-label': 'Bu sayfadaki oyuncuların hepsini seç',
    disabled: !pageIds.length,
    onchange: (e) => {
      for (const p of data.players) e.target.checked ? selected.set(p.id, p.name) : selected.delete(p.id)
      loadTable(box)
    },
  }) : null
  if (all) { all.checked = pageIds.length > 0 && onPage === pageIds.length; all.indeterminate = onPage > 0 && onPage < pageIds.length }
  const head = h('tr', {}, canBulk ? h('th', { class: 'pick' }, all) : null, COLUMNS.map((c) => {
    const sorted = c.sort && state.sort === c.sort
    return h('th', {
      class: [c.num && 'num', c.sort && 'sortable', sorted && 'sorted'].filter(Boolean).join(' '),
      'aria-sort': sorted ? (state.dir === 'desc' ? 'descending' : 'ascending') : null,
      onclick: c.sort ? () => {
        if (state.sort === c.sort) state.dir = state.dir === 'desc' ? 'asc' : 'desc'
        else { state.sort = c.sort; state.dir = c.sort === 'name' ? 'asc' : 'desc' }
        state.offset = 0
        loadTable(box)
      } : null,
    }, c.label, sorted ? (state.dir === 'desc' ? ' ↓' : ' ↑') : '')
  }))
  const rows = data.players.map((p) => h('tr', {
    class: selected.has(p.id) ? 'click picked' : 'click',
    tabindex: '0',
    onclick: () => { location.hash = `#/p/${p.id}` },
    onkeydown: (e) => { if (e.key === 'Enter' && e.target === e.currentTarget) location.hash = `#/p/${p.id}` },
  },
  canBulk ? h('td', { class: 'pick', onclick: (e) => e.stopPropagation() }, pickBox(p, box)) : null,
  h('td', { class: 'num', text: p.rank ?? '—' }),
  h('td', { class: 'name' }, p.name, badges(p)),
  h('td', { class: 'num', text: num(p.total) }),
  h('td', { class: 'num', text: num(p.weekly) }),
  h('td', { class: 'num', text: num(p.level) }),
  h('td', { class: 'num', text: num(p.words) }),
  h('td', { class: 'num gem', title: p.diamondsAt ? `Güncelleme: ${date(p.diamondsAt)}` : 'Uygulama henüz göndermedi (1.3.15 öncesi)', text: num(p.diamonds) }),
  h('td', { text: p.last ? `${p.last.level}. bölüm · ${num(p.last.score)} puan · ${secs(p.last.seconds)}` : '—' }),
  h('td', { title: date(p.createdAt), text: ago(p.createdAt) }),
  h('td', { title: date(p.seenAt), text: ago(p.seenAt) })))

  const from = data.total ? state.offset + 1 : 0
  const to = state.offset + data.players.length
  const pager = h('div', { class: 'pager' },
    h('span', { class: 'muted', text: `${num(from)}–${num(to)} / ${num(data.total)}` }),
    h('button', { disabled: state.offset === 0, onclick: () => { state.offset = Math.max(0, state.offset - 50); loadTable(box) }, text: '‹ Önceki' }),
    h('button', { disabled: to >= data.total, onclick: () => { state.offset += 50; loadTable(box) }, text: 'Sonraki ›' }))

  box.replaceChildren(
    h('div', { class: 'table-wrap' }, h('table', {},
      h('thead', {}, head),
      h('tbody', {}, rows.length ? rows : h('tr', {}, h('td', { class: 'empty', colspan: String(COLUMNS.length + (canBulk ? 1 : 0)), text: state.q ? 'Bu adla oyuncu yok.' : 'Henüz oyuncu yok.' }))))),
    h('div', { style: null }, pager))
  bulkBar(box)
}

function pickBox(p, box) {
  const input = h('input', {
    type: 'checkbox',
    'aria-label': `${p.name} seç`,
    onchange: (e) => {
      e.target.checked ? selected.set(p.id, p.name) : selected.delete(p.id)
      e.target.closest('tr').classList.toggle('picked', e.target.checked)
      // Başlık kutusu ve çubuk güncellensin (tabloyu yeniden yüklemeden)
      const rowsBoxes = [...box.querySelectorAll('tbody td.pick input')]
      const head = box.querySelector('thead th.pick input')
      const n = rowsBoxes.filter((b) => b.checked).length
      if (head) { head.checked = n === rowsBoxes.length; head.indeterminate = n > 0 && n < rowsBoxes.length }
      bulkBar(box)
    },
  })
  input.checked = selected.has(p.id)
  return input
}

// --- Oyuncu ayrıntısı ---

async function showPlayer(id) {
  app.replaceChildren(h('p', { class: 'muted', text: 'Yükleniyor…' }))
  let data
  try { data = await api('GET', `/players/${id}`) } catch (e) {
    if (e.status !== 401) app.replaceChildren(backLink(), h('p', { class: 'error', text: e.status === 404 ? 'Oyuncu bulunamadı (tablodan çıkmış olabilir).' : 'Yüklenemedi.' }))
    return
  }
  const p = data.player
  const rank = (b) => (p.ranks[b] ? `${num(p.ranks[b])}. sıra` : 'tabloda değil')

  const stats = h('div', { class: 'stats' },
    stat('Toplam puan', num(p.total), rank('total')),
    stat('Bu hafta', num(p.weekly), rank('weekly')),
    stat('En yüksek bölüm', num(p.level), rank('level')),
    stat('Bulunan kelime', num(p.words), rank('words')),
    stat('Elmas', num(p.diamonds), p.diamondsAt ? `güncelleme ${ago(p.diamondsAt)}` : 'uygulama henüz göndermedi', 'gem'),
    stat('Hediye edilen', num(p.granted), 'toplam elmas', 'gem'))

  app.replaceChildren(h('div', { class: 'stack' },
    backLink(),
    h('div', {},
      h('h1', {}, p.name, badges(p)),
      p.flags ? h('p', { class: 'error', text: `Şüpheli: ${num(p.flags)} kez gerçek süreyle mümkün olmayan puan gönderdi (son ${date(p.flaggedAt)}). Fazlası tabloya yazılmadı.` }) : null,
      h('p', { class: 'muted', text: `Katıldı ${date(p.createdAt)} · son görülme ${ago(p.seenAt)}` })),
    stats,
    h('div', { class: 'grid2' }, grantCard(p, data.grants), grantHistory(data.grants, id)),
    levelsCard(data.levels, p),
    manageCard(p)))
}

function manageCard(p) {
  const card = h('div', { class: 'card' }, h('h2', { text: 'Yönetim' }))
  if (me.role !== 'admin') {
    card.append(h('p', { class: 'muted', text: 'Gizleme ve silme için admin yetkisi gerekir.' }))
    return card
  }
  const msg = h('p', { class: 'error', role: 'status' })
  const hide = h('button', {
    onclick: async () => {
      try { await api('PATCH', `/players/${p.id}`, { hidden: !p.hidden }); showPlayer(p.id) } catch { msg.textContent = 'Yapılamadı, tekrar dene.' }
    },
    text: p.hidden ? 'Tablolarda göster' : 'Tablolardan gizle (uygunsuz ad)',
  })
  const remove = h('button', {
    class: 'danger',
    onclick: async () => {
      if (!confirm(`${p.name} adlı oyuncunun kaydı, bölüm sonuçları ve hediyeleri silinsin mi? Geri alınamaz.`)) return
      try { await api('DELETE', `/players/${p.id}`); location.hash = '' } catch { msg.textContent = 'Silinemedi, tekrar dene.' }
    },
    text: 'Oyuncuyu sil',
  })
  card.append(h('div', { class: 'toolbar' }, hide, remove), msg,
    h('p', { class: 'muted', text: 'Gizlenen oyuncu puan toplamaya devam eder ama hiçbir tabloda görünmez. Silinen oyuncu uygulamayı açınca yeni bir adla yeniden kaydolur.' }))
  return card
}

function badges(p) {
  const out = []
  if (p.hidden) out.push(' ', h('span', { class: 'badge hidden', text: 'gizli' }))
  if (p.flags) out.push(' ', h('span', { class: 'badge hidden', title: 'Gerçek süreyle mümkün olmayan puan gönderdi', text: 'şüpheli' }))
  return out
}

function backLink() {
  return h('div', { class: 'back' }, h('button', { class: 'link', onclick: () => { location.hash = '' }, text: '‹ Oyunculara dön' }))
}

function grantCard(p, grants) {
  const card = h('div', { class: 'card' }, h('h2', { text: 'Elmas ver' }))
  if (me.role !== 'admin') {
    card.append(h('p', { class: 'muted', text: 'Elmas vermek için admin yetkisi gerekir.' }))
    return card
  }
  const amount = h('input', { type: 'number', min: '1', max: '100000', step: '1', placeholder: 'Miktar', 'aria-label': 'Elmas miktarı', required: true })
  const note = h('input', { maxlength: '120', placeholder: 'Not (oyuncu görür, isteğe bağlı)', 'aria-label': 'Not' })
  const submit = h('button', { class: 'primary', type: 'submit', text: 'Ver' })
  const msg = h('p', { class: 'error', role: 'status' })
  const form = h('form', {
    class: 'grant-form',
    onsubmit: async (e) => {
      e.preventDefault()
      const n = Number(amount.value)
      if (!Number.isInteger(n) || n < 1 || n > 100000) { msg.className = 'error'; msg.textContent = 'Miktar 1 ile 100.000 arasında olmalı.'; return }
      if (!confirm(`${p.name} adlı oyuncuya ${num(n)} elmas verilsin mi?`)) return
      submit.disabled = true
      try {
        await api('POST', `/players/${p.id}/grants`, { amount: n, note: note.value })
        showPlayer(p.id)
      } catch (err) {
        msg.className = 'error'
        msg.textContent = err.status === 403 ? 'Bu işlem için admin yetkisi gerekir.' : 'Verilemedi, tekrar dene.'
        submit.disabled = false
      }
    },
  }, amount, note, submit)
  card.append(form, msg,
    h('p', { class: 'muted', text: 'Oyuncu uygulamayı bir sonraki açışında ya da bölüm bitirdiğinde elmasları alır ve bir bildirim görür.' }))
  return card
}

function grantHistory(grants, playerId) {
  const card = h('div', { class: 'card' }, h('h2', { text: 'Elmas geçmişi' }))
  if (!grants.length) { card.append(h('p', { class: 'muted', text: 'Henüz hediye yok.' })); return card }
  card.append(h('div', { class: 'table-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', { class: 'num', text: 'Elmas' }), h('th', { text: 'Not' }), h('th', { text: 'Veren' }), h('th', { text: 'Tarih' }), h('th', { text: 'Durum' }))),
    h('tbody', {}, grants.map((g) => h('tr', {},
      h('td', { class: 'num gem', text: num(g.amount) }),
      h('td', { class: 'name', text: g.note || '—' }),
      h('td', { text: g.admin }),
      h('td', { title: date(g.created_at), text: ago(g.created_at) }),
      h('td', {}, g.claimed_at
        ? h('span', { title: date(g.claimed_at), text: `Alındı ${ago(g.claimed_at)}` })
        : g.delivered_at
        ? h('span', { title: date(g.delivered_at), text: `Uygulamaya gitti ${ago(g.delivered_at)}, onay bekleniyor` })
        : h('span', {}, 'Bekliyor', me.role === 'admin' ? ' · ' : '', me.role === 'admin' ? h('button', {
          class: 'link danger',
          onclick: async () => {
            if (!confirm(`${num(g.amount)} elmaslık hediye geri alınsın mı?`)) return
            try { await api('DELETE', `/grants/${g.id}`) } catch (e) { if (e.status === 409) alert('Hediye az önce uygulamaya gitti; geri alınamaz.') }
            showPlayer(playerId)
          },
          text: 'Geri al',
        }) : ''))))))))
  return card
}

function levelsCard(levels, p) {
  const card = h('div', { class: 'card' }, h('h2', { text: `Bölüm sonuçları (${num(levels.length)})` }))
  if (!levels.length) {
    card.append(h('p', { class: 'muted', text: p.last
      ? `Bölüm ayrıntısı uygulamanın 1.3.15 sürümünden itibaren gelir. Bilinen son bölüm: ${p.last.level}. bölüm, ${num(p.last.score)} puan, ${secs(p.last.seconds)}.`
      : 'Bölüm ayrıntısı uygulamanın 1.3.15 sürümünden itibaren gelir.' }))
    return card
  }
  const best = Math.max(...levels.map((l) => l.score))
  card.append(h('div', { class: 'table-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', { class: 'num', text: 'Bölüm' }), h('th', { class: 'num', text: 'Puan' }), h('th', { class: 'num', text: 'Süre' }), h('th', { text: 'İlk bitiriş' }), h('th', { text: 'En iyi sonuç' }))),
    h('tbody', {}, levels.map((l) => h('tr', {},
      h('td', { class: 'num', text: num(l.level) }),
      h('td', { class: 'num', text: num(l.score) + (l.score === best ? ' ★' : '') }),
      h('td', { class: 'num', text: secs(l.seconds) }),
      h('td', { title: date(l.first_at), text: date(l.first_at) }),
      h('td', { text: l.best_at !== l.first_at ? date(l.best_at) : '—' })))))))
  return card
}

// --- Yönlendirme ---

async function route() {
  if (!me) {
    try { me = await api('GET', '/me') } catch { return showLogin() }
  }
  setWho()
  const m = location.hash.match(/^#\/p\/([0-9a-f-]{36})$/)
  if (m) showPlayer(m[1])
  else showList()
}

window.addEventListener('hashchange', route)
route()

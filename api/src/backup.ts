// Günlük yedek (host cron'u konteynerin içinde çalıştırır): veritabanının tutarlı kopyası /data/backup'a,
// gzip'li (2026-11-15: 50 bin oyuncuda ~300 MB × 14 gün diski doldururdu), son 14 gün kalır.
// Geri yükleme: gunzip -k wordvoya-GG.db.gz → konteyneri durdur → /data/wordvoya.db yerine koy (-wal/-shm sil).
import { DatabaseSync } from 'node:sqlite'
import { createReadStream, createWriteStream, mkdirSync, readdirSync, renameSync, rmSync } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { createGzip } from 'node:zlib'

const db = process.env.DB_PATH ?? '/data/wordvoya.db'
const dir = process.env.BACKUP_DIR ?? '/data/backup'
const keep = Number(process.env.BACKUP_KEEP ?? 14)
const day = process.env.BACKUP_DAY ?? new Date().toISOString().slice(0, 10)

/** Düz .db'yi .db.gz yapar; yarım kalan dosya bırakmaz (önce .part, sonra ad değişir). */
async function compress(plain: string) {
  const part = `${plain}.gz.part`
  await pipeline(createReadStream(plain), createGzip({ level: 6 }), createWriteStream(part))
  renameSync(part, `${plain}.gz`)
  rmSync(plain)
}

mkdirSync(dir, { recursive: true })
for (const f of readdirSync(dir)) if (f.endsWith('.gz.part')) rmSync(`${dir}/${f}`)   // yarıda kesilmiş eski koşu
const target = `${dir}/wordvoya-${day}.db`
rmSync(target, { force: true })
const conn = new DatabaseSync(db)
conn.exec(`VACUUM INTO '${target.replaceAll("'", "''")}'`)
conn.close()
// Bozuk kopyayı sıkıştırıp "yedek var" sanmayalım
const copy = new DatabaseSync(target, { readOnly: true })
const check = (copy.prepare('PRAGMA quick_check').get() as { quick_check: string }).quick_check
copy.close()
if (check !== 'ok') { console.error(`yedek bozuk (${check}): ${target}`); process.exit(1) }

// Bugünkü kopya ve eski sürümden kalan düz .db'ler sıkıştırılır
const name = /^wordvoya-(\d{4}-\d{2}-\d{2})\.db(\.gz)?$/
for (const f of readdirSync(dir)) if (name.test(f) && !f.endsWith('.gz')) await compress(`${dir}/${f}`)

const all = readdirSync(dir).filter((f) => name.test(f)).sort()
const old = all.slice(0, Math.max(0, all.length - keep))
for (const f of old) rmSync(`${dir}/${f}`)
console.log(`yedek: ${target}.gz, silinen: ${old.length}`)

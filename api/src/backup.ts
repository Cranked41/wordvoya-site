// Günlük yedek (host cron'u konteynerin içinde çalıştırır): veritabanının tutarlı kopyası /data/backup'a, son 14 gün kalır.
import { DatabaseSync } from 'node:sqlite'
import { mkdirSync, readdirSync, rmSync } from 'node:fs'

const db = process.env.DB_PATH ?? '/data/wordvoya.db'
const dir = process.env.BACKUP_DIR ?? '/data/backup'
const keep = 14

mkdirSync(dir, { recursive: true })
const day = new Date().toISOString().slice(0, 10)
const target = `${dir}/wordvoya-${day}.db`
rmSync(target, { force: true })
const conn = new DatabaseSync(db)
conn.exec(`VACUUM INTO '${target.replaceAll("'", "''")}'`)
conn.close()
const old = readdirSync(dir).filter((f) => /^wordvoya-\d{4}-\d{2}-\d{2}\.db$/.test(f)).sort().slice(0, -keep)
for (const f of old) rmSync(`${dir}/${f}`)
console.log(`yedek: ${target}, silinen: ${old.length}`)

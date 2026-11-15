// Günlük yedek: gzip'li, açılabilir, eski düz .db'ler sıkıştırılır, son 14 gün kalır (2026-11-15).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gunzipSync } from 'node:zlib'
import { DatabaseSync } from 'node:sqlite'
import { Store } from '../src/db.ts'

const script = fileURLToPath(new URL('../src/backup.ts', import.meta.url))

test('yedek gzip olarak yazılır, açılır, eski düz yedekler sıkıştırılır ve 14 gün tutulur', () => {
  const root = mkdtempSync(join(tmpdir(), 'wv-backup-'))
  try {
    const dbPath = join(root, 'wordvoya.db')
    const dir = join(root, 'backup')
    const store = new Store(dbPath)
    for (let i = 0; i < 50; i++) store.createPlayer(`Oyuncu ${i}`)
    store.close()

    const run = (day: string) => execFileSync(process.execPath, [script], {
      env: { ...process.env, DB_PATH: dbPath, BACKUP_DIR: dir, BACKUP_DAY: day, NODE_NO_WARNINGS: '1' },
      encoding: 'utf8',
    })

    // İlk koşu klasörü kurar; sonra eski sürümden kalmış düz bir yedek ve yarım kalmış bir .part ekle
    run('2026-11-01')
    writeFileSync(join(dir, 'wordvoya-2026-10-31.db'), readFileSync(dbPath))
    writeFileSync(join(dir, 'wordvoya-2026-11-01.db.gz.part'), 'yarım')
    const out = run('2026-11-02')
    assert.match(out, /yedek: .*wordvoya-2026-11-02\.db\.gz/)

    let files = readdirSync(dir).sort()
    assert.deepEqual(files, ['wordvoya-2026-10-31.db.gz', 'wordvoya-2026-11-01.db.gz', 'wordvoya-2026-11-02.db.gz'])

    // Açılan yedek gerçek veritabanı: oyuncular orada
    const plain = join(root, 'geri.db')
    writeFileSync(plain, gunzipSync(readFileSync(join(dir, 'wordvoya-2026-11-02.db.gz'))))
    const restored = new DatabaseSync(plain, { readOnly: true })
    assert.equal((restored.prepare('SELECT COUNT(*) AS n FROM players').get() as { n: number }).n, 50)
    restored.close()
    assert.ok(readFileSync(join(dir, 'wordvoya-2026-11-02.db.gz')).length < readFileSync(plain).length, 'sıkıştırılmış olmalı')

    // 14 günden eskisi silinir
    for (let d = 3; d <= 16; d++) run(`2026-11-${String(d).padStart(2, '0')}`)
    files = readdirSync(dir).sort()
    assert.equal(files.length, 14)
    assert.equal(files[0], 'wordvoya-2026-11-03.db.gz')
    assert.equal(files.at(-1), 'wordvoya-2026-11-16.db.gz')
    assert.ok(!existsSync(join(dir, 'wordvoya-2026-11-16.db')), 'düz kopya kalmamalı')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

// İstemciden gelen verinin denetimi. Kurallar uygulamadaki (ScoreRepository, GameViewModel.levelScore) puanlamaya göre.
import type { Last, Snapshot } from './db.ts'

export const NAME_MIN = 2
export const NAME_MAX = 20

// Kaba sözler: tam kelime ya da birleşik yazımda. Liste kısa tutuldu; gerekirse oyuncu sunucuda gizlenir (hidden = 1).
const BLOCKED = [
  'amk', 'aq', 'orospu', 'oç', 'piç', 'sik', 'sikerim', 'yarrak', 'göt', 'pezevenk', 'kahpe', 'ibne', 'amcık',
  'fuck', 'shit', 'bitch', 'cunt', 'nigger', 'nigga', 'faggot', 'whore', 'slut', 'dick', 'pussy', 'hitler', 'nazi',
]

// Harf/işaret/rakamla başlar. Ayraçlar: boşluk . _ ' ’ - ve · ・ (Japonca yabancı adlar: マイケル・ジャクソン);
// ZWNJ/ZWJ Farsça ve Hintçe yazımın parçası (علی‌رضا klavyede yarım boşlukla yazılır).
const NAME_PATTERN = /^[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N} ._'’\-·・\u200c\u200d]*$/u

/**
 * Aynı ad denetiminin anahtarı: büyük/küçük harf, Latin/Kiril aksanları, Arapça harekeler, ayraçlar ve
 * genişlik farkı yok sayılır ("Ayşe Yılmaz" = "AYSE YILMAZ" = "ayse-yilmaz"). Devanagari ve Hangul işaretleri
 * harfin parçası olduğu için korunur.
 */
export function nameKey(name: string): string {
  return name
    .normalize('NFKC')
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f\u064b-\u065f\u0670\u0640]/g, '')
    .replace(/[^\p{L}\p{M}\p{N}]/gu, '')
    .normalize('NFC')
}

/** Görünen adı temizler; kurala uymuyorsa null. */
export function cleanName(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const name = raw.normalize('NFC').replace(/\s+/gu, ' ').trim()
  const length = [...name].length
  if (length < NAME_MIN || length > NAME_MAX) return null
  if (!NAME_PATTERN.test(name)) return null
  const lower = name.toLocaleLowerCase('tr')
  const words = lower.split(/[^\p{L}\p{N}]+/u).filter(Boolean)
  const joined = words.join('')
  if (BLOCKED.some((b) => words.includes(b) || (b.length >= 4 && joined.includes(b)))) return null
  return name
}

const MAX_LEVEL = 100_000
const MAX_WORDS = 5_000_000
// Bir kelime en çok 10 puan; bonus kelime 5, bölüm başına hız en çok 100 (bkz. GameViewModel.levelScore).
// Bonus ve hız, bulunan kelime sayısına bağlı değil; bölüm başı kelime en az 3 sayılarak cömert bir üst sınır.
const maxTotal = (words: number) => words * 10 + words * 5 + Math.ceil(words / 3) * 100 + 1_000

const int = (v: unknown, max: number): number | null =>
  typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= max ? v : null

/** Skor gövdesini denetler; uymuyorsa hatanın adı. */
export function parseSnapshot(body: unknown): Snapshot | string {
  if (typeof body !== 'object' || body === null) return 'body'
  const b = body as Record<string, unknown>
  const words = int(b.words, MAX_WORDS)
  if (words == null) return 'words'
  const total = int(b.total, maxTotal(words))
  if (total == null) return 'total'
  const weekly = int(b.weekly, total)
  if (weekly == null) return 'weekly'
  const week = int(b.week, 1_000_000)
  if (week == null) return 'week'
  const level = int(b.level, MAX_LEVEL)
  if (level == null) return 'level'
  let last: Last | null = null
  if (b.last != null) {
    last = parseLast(b.last)
    if (!last) return 'last'
  }
  let diamonds: number | null = null
  if (b.diamonds != null) {
    diamonds = int(b.diamonds, MAX_DIAMONDS)
    if (diamonds == null) return 'diamonds'
  }
  const levels: Last[] = []
  if (b.levels != null) {
    if (!Array.isArray(b.levels) || b.levels.length > MAX_LEVELS_PER_SYNC) return 'levels'
    for (const item of b.levels) {
      const r = parseLast(item)
      if (!r) return 'levels'
      levels.push(r)
    }
  }
  return { total, weekly, week, level, words, last, diamonds, levels }
}

const MAX_DIAMONDS = 100_000_000
/** Uygulama gönderilemeyen bölümleri biriktirir; bir gönderimde en çok bu kadarı gelir. */
export const MAX_LEVELS_PER_SYNC = 100

function parseLast(v: unknown): Last | null {
  if (typeof v !== 'object' || v === null) return null
  const l = v as Record<string, unknown>
  const ll = int(l.level, MAX_LEVEL), ls = int(l.seconds, 86_400), lp = int(l.score, 10_000)
  if (ll == null || ll < 1 || ls == null || lp == null) return null
  return { level: ll, seconds: ls, score: lp }
}

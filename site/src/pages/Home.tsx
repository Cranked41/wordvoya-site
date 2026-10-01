// Ana sayfa: 15 dil (Türkçe /, İngilizce /en/, öbürleri /<dil>/; tr/en dışındakiler i18n.tsx'te).
import type { ReactNode } from 'react';
import { Document, Footer, Header } from '../Layout';
import { HOME_EXTRA } from '../i18n';
import { UI, type Lang } from '../site';

export interface HomeText {
  title: string;
  description: string;
  og: { title: string; description: string; image: string };
  sub: string;
  intro: string;
  soon: string;
  iconAlt: string;
  heroAlt: string;
  featuresTitle: string;
  features: [dot: string, title: string, text: string][];
  shotsTitle: string;
  shots: string[];
  attribution: ReactNode;
}

const TEXT: Record<Lang, HomeText> = {
  ...HOME_EXTRA,
  tr: {
    title: 'Wordvoya — Kelime Bulmacası',
    description:
      'Harf adalarını birleştir, çapraz bulmacadaki kelimeleri bul, bonus kelimeleri avla. Hiç bitmeyen bir ada yolculuğu.',
    og: {
      title: 'Wordvoya — Kelime Bulmacası',
      description: 'Harf adalarını birleştir, kelimeleri bul, bitmeyen yolculuğa çık.',
      image: '/img/og-tr.jpg',
    },
    sub: 'Kelime Bulmacası',
    intro:
      'Harfler denizdeki adalarda seni bekliyor. Parmağını adadan adaya kaydır, rotan bir kelime yazsın ve çapraz bulmacaya yerleşsin. Her bölüm yeni bir ada, her ada yeni kelimeler.',
    soon: "Yakında Google Play'de",
    iconAlt: 'Wordvoya simgesi',
    heroAlt: 'Harf adalarını kaydırarak TEKRAR kelimesini kurmak',
    featuresTitle: 'Adadan adaya bir kelime avı',
    features: [
      ['~', 'Harf adaları', 'Harfler çemberde değil, denizdeki adalarda. Parmağını kaydır, rotan kelimeyi yazsın.'],
      ['∞', 'Dünya harikaları', "Pamukkale'den Tac Mahal'e her durak bir dünya harikası. Her sefer on yeni yer; yolculuk hiç bitmez, bulmacalar büyür."],
      ['★', 'Bonus kelimeler', 'Harflerde saklı fazladan kelimeleri bul, elmas kazan; takıldığında ipucuyla bir harf aç.'],
      ['A', 'Merak ettiğin kelime', 'Bulduğun kelimeye dokun, anlamı açılsın. Bulmacadaki her kelime elle incelendi.'],
      ['15', '15 dilde bulmaca', 'Türkçe, İngilizce, Almanca, Japonca, Hintçe, Arapça ve daha fazlası; ilerleme her dil için ayrı tutulur.'],
      ['✓', 'Hesap gerekmez', 'Oyun kayıt istemez, hemen başlarsın. İlerlemen yalnızca cihazında kalır.'],
    ],
    shotsTitle: 'Oyundan kareler',
    shots: ['Harf adalarını birleştir', 'Bölüm tamam: etap puanı ve günlük hedef', 'Bonus kelimeler', 'Yedi harfli büyük bir bulmaca'],
    attribution: (
      <>
        Kelime anlamları <a href="https://tr.wiktionary.org/">Vikisözlük</a> katkıcılarının çalışmasından uyarlanmıştır (
        <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.tr">CC BY-SA 4.0</a>).
      </>
    ),
  },
  en: {
    title: 'Wordvoya — Word Puzzle',
    description:
      'Connect letter islands, find the words in the crossword and hunt for bonus words. An island voyage that never ends.',
    og: {
      title: 'Wordvoya — Word Puzzle',
      description: 'Connect letter islands, find the words and set off on an endless voyage.',
      image: '/img/og-en.jpg',
    },
    sub: 'Word Puzzle',
    intro:
      'Letters wait on islands in the sea. Slide your finger from island to island: your route spells a word and fills the crossword. Every level is a new island with new words to find.',
    soon: 'Coming soon to Google Play',
    iconAlt: 'Wordvoya icon',
    heroAlt: 'Sliding across letter islands to spell AROUND',
    featuresTitle: 'A word hunt from island to island',
    features: [
      ['~', 'Letter islands', 'No wheel: the letters sit on islands in the sea. Slide your finger and your route spells the word.'],
      ['∞', 'Wonders of the world', 'From Pamukkale to the Taj Mahal, every stop is a world wonder. Each voyage visits ten new places; the journey never ends and the puzzles keep growing.'],
      ['★', 'Bonus words', "Find the extra words hidden in the letters to earn diamonds, and reveal a letter with a hint when you're stuck."],
      ['A', 'Curious about a word?', 'Tap a word you found to see its meaning. Every puzzle word was checked by hand.'],
      ['15', 'Puzzles in 15 languages', 'English, Turkish, German, Japanese, Hindi, Arabic and more; progress is kept separately for each language.'],
      ['✓', 'No account needed', 'The game needs no sign-up, so you can start right away. Your progress stays on your device.'],
    ],
    shotsTitle: 'Screenshots',
    shots: ['Connect the letter islands', 'Level complete: stop points and daily goal', 'Bonus words', 'A bigger seven-letter puzzle'],
    attribution: (
      <>
        Word meanings are adapted from the work of <a href="https://en.wiktionary.org/">Wiktionary</a> contributors (
        <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>).
      </>
    ),
  },
};

export default function Home({ lang }: { lang: Lang }) {
  const t = TEXT[lang];
  return (
    <Document lang={lang} page="home" title={t.title} description={t.description} og={t.og}>
      <Header lang={lang} page="home" />
      <main>
        <section className="hero">
          <div className="wrap">
            <div>
              <img className="logo" src="/img/icon.png" alt={t.iconAlt} width={96} height={96} />
              <h1>Wordvoya</h1>
              <p className="sub">{t.sub}</p>
              <p>{t.intro}</p>
              <span className="badge soon">{t.soon}</span>
            </div>
            <img className="shot" src={`/img/ekran-${lang}-1.webp`} alt={t.heroAlt} width={540} height={960} />
          </div>
        </section>

        <section className="features" id={UI[lang].featuresId}>
          <div className="wrap">
            <h2>{t.featuresTitle}</h2>
            <div className="grid">
              {t.features.map(([dot, title, text]) => (
                <div className="card" key={title}>
                  <div className="dot">{dot}</div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="shots">
          <div className="wrap">
            <h2>{t.shotsTitle}</h2>
            <div className="row">
              {t.shots.map((alt, i) => (
                <img key={alt} src={`/img/ekran-${lang}-${i + 1}.webp`} alt={alt} width={540} height={960} loading="lazy" />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer lang={lang} page="home">
        <p>{t.attribution}</p>
      </Footer>
    </Document>
  );
}

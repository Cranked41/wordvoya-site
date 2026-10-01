// Sitenin ortak sabitleri: adresler, diller, sayfa yolları ve arayüz metinleri.
import { UI_EXTRA } from './i18n';

/** Site 15 dilde (bulmaca dilleriyle aynı); gizlilik ve şartların tr/en dışındakiler çeviri (farklılıkta İngilizcesi). */
export const LANGS = ['tr', 'en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'nl', 'pl', 'ja', 'ko', 'ar', 'fa', 'hi'] as const;
export type Lang = (typeof LANGS)[number];
export type PageKey = 'home' | 'privacy' | 'terms';
export const isRtl = (lang: Lang) => lang === 'ar' || lang === 'fa';

export const ORIGIN = 'https://wordvoya.com';
export const ADSENSE_ACCOUNT = 'ca-pub-7447009773268822';
export const SUPPORT_EMAIL = 'support@wordvoya.com';
/** style.css değişince artır: tarayıcı önbelleği eskisini tutmasın. */
export const CSS_VERSION = 4;

/** Türkçe kökte (eski adresler korunur), öbür diller /<dil>/ altında. */
export const PATHS = Object.fromEntries(
  LANGS.map((lang) => [
    lang,
    lang === 'tr'
      ? { home: '/', privacy: '/gizlilik.html', terms: '/kullanim-sartlari.html' }
      : { home: `/${lang}/`, privacy: `/${lang}/privacy.html`, terms: `/${lang}/terms.html` },
  ]),
) as Record<Lang, Record<PageKey, string>>;

export interface UiText {
  features: string;
  featuresId: string;
  home: string;
  privacy: string;
  privacyLong: string;
  terms: string;
  /** Dilin kendi dilindeki adı (dil menüsü). */
  langName: string;
  updated: string;
  /** Dil menüsünün etiketi. */
  languages: string;
}

export const UI: Record<Lang, UiText> = {
  tr: {
    features: 'Özellikler',
    featuresId: 'ozellikler',
    home: 'Ana sayfa',
    privacy: 'Gizlilik',
    privacyLong: 'Gizlilik Politikası',
    terms: 'Kullanım Şartları',
    langName: 'Türkçe',
    updated: 'Son güncelleme',
    languages: 'Dil',
  },
  en: {
    features: 'Features',
    featuresId: 'features',
    home: 'Home',
    privacy: 'Privacy',
    privacyLong: 'Privacy Policy',
    terms: 'Terms of Use',
    langName: 'English',
    updated: 'Last updated',
    languages: 'Language',
  },
  ...UI_EXTRA,
};

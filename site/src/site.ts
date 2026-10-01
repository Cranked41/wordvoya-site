// Sitenin ortak sabitleri: adresler, sayfa yolları ve iki dilin arayüz metinleri.

export type Lang = 'tr' | 'en';
export type PageKey = 'home' | 'privacy' | 'terms';

export const ORIGIN = 'https://wordvoya.com';
export const ADSENSE_ACCOUNT = 'ca-pub-7447009773268822';
export const SUPPORT_EMAIL = 'support@wordvoya.com';
/** style.css değişince artır: tarayıcı önbelleği eskisini tutmasın. */
export const CSS_VERSION = 2;

export const PATHS: Record<Lang, Record<PageKey, string>> = {
  tr: { home: '/', privacy: '/gizlilik.html', terms: '/kullanim-sartlari.html' },
  en: { home: '/en/', privacy: '/en/privacy.html', terms: '/en/terms.html' },
};

export const other = (lang: Lang): Lang => (lang === 'tr' ? 'en' : 'tr');

export const UI = {
  tr: {
    features: 'Özellikler',
    featuresId: 'ozellikler',
    home: 'Ana sayfa',
    privacy: 'Gizlilik',
    privacyLong: 'Gizlilik Politikası',
    terms: 'Kullanım Şartları',
    langName: 'Türkçe',
    updated: 'Son güncelleme',
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
  },
} as const;

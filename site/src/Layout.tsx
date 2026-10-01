// Her sayfanın iskeleti: <head> etiketleri, üst çubuk ve alt bilgi.
import type { ReactNode } from 'react';
import { ADSENSE_ACCOUNT, CSS_VERSION, ORIGIN, PATHS, SUPPORT_EMAIL, UI, other, type Lang, type PageKey } from './site';

interface DocumentProps {
  lang: Lang;
  title: string;
  description?: string;
  /** Sayfanın kendi yolu ve iki dildeki karşılıkları (canonical + hreflang). */
  page?: PageKey;
  og?: { title: string; description: string; image: string };
  noindex?: boolean;
  children: ReactNode;
}

export function Document({ lang, title, description, page, og, noindex, children }: DocumentProps) {
  const isHome = page === 'home';
  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* AdSense hesap doğrulaması: her sayfada olmalı */}
        <meta name="google-adsense-account" content={ADSENSE_ACCOUNT} />
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        {noindex && <meta name="robots" content="noindex" />}
        {page && <link rel="canonical" href={ORIGIN + PATHS[lang][page]} />}
        {page && <link rel="alternate" hrefLang="tr" href={ORIGIN + PATHS.tr[page]} />}
        {page && <link rel="alternate" hrefLang="en" href={ORIGIN + PATHS.en[page]} />}
        {isHome && <link rel="alternate" hrefLang="x-default" href={ORIGIN + PATHS.en.home} />}
        {og && (
          <>
            <meta property="og:type" content="website" />
            <meta property="og:title" content={og.title} />
            <meta property="og:description" content={og.description} />
            <meta property="og:url" content={ORIGIN + PATHS[lang].home} />
            <meta property="og:image" content={ORIGIN + og.image} />
          </>
        )}
        <meta name="theme-color" content="#1B5E7A" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {isHome && <link rel="apple-touch-icon" href="/img/apple-touch-icon.png" />}
        <link rel="stylesheet" href={`/css/style.css?v=${CSS_VERSION}`} />
      </head>
      <body>{children}</body>
    </html>
  );
}

/** Öbür dildeki aynı sayfaya bağlantı. */
function LangLink({ lang, page }: { lang: Lang; page: PageKey }) {
  const to = other(lang);
  return (
    <a href={PATHS[to][page]} hrefLang={to} lang={to}>
      {UI[to].langName}
    </a>
  );
}

export function Header({ lang, page }: { lang: Lang; page: PageKey }) {
  const t = UI[lang];
  const p = PATHS[lang];
  const current = (key: PageKey) => (key === page ? 'page' : undefined);
  return (
    <header className="top">
      <div className="wrap">
        <a className="brand" href={p.home}>
          <img src="/img/icon.png" alt="" width={36} height={36} />
          Wordvoya
        </a>
        <nav className="nav">
          {page === 'home' ? <a href={`#${t.featuresId}`}>{t.features}</a> : <a href={p.home}>{t.home}</a>}
          <a href={p.privacy} aria-current={current('privacy')}>{t.privacy}</a>
          <a href={p.terms} aria-current={current('terms')}>{t.terms}</a>
          <LangLink lang={lang} page={page} />
        </nav>
      </div>
    </header>
  );
}

export function Footer({ lang, page, children }: { lang: Lang; page: PageKey; children?: ReactNode }) {
  const t = UI[lang];
  const p = PATHS[lang];
  return (
    <footer>
      <div className="wrap">
        <div className="links">
          {page !== 'home' && <a href={p.home}>Wordvoya</a>}
          {page !== 'privacy' && <a href={p.privacy}>{t.privacyLong}</a>}
          {page !== 'terms' && <a href={p.terms}>{t.terms}</a>}
          {page === 'home' && <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>}
          <LangLink lang={lang} page={page} />
        </div>
        {children}
        <p>© 2026 Wordvoya</p>
      </div>
    </footer>
  );
}

/** Gizlilik ve şartlar gibi metin sayfaları. */
export function DocPage(props: {
  lang: Lang;
  page: PageKey;
  title: string;
  description: string;
  updated: string;
  children: ReactNode;
}) {
  const { lang, page, title, description, updated, children } = props;
  return (
    <Document lang={lang} page={page} title={`${title} — Wordvoya`} description={description}>
      <Header lang={lang} page={page} />
      <main className="doc">
        <div className="wrap">
          <h1>{title}</h1>
          <p className="date">
            {UI[lang].updated}: {updated}
          </p>
          {children}
        </div>
      </main>
      <Footer lang={lang} page={page} />
    </Document>
  );
}

export const Mail = () => <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>;

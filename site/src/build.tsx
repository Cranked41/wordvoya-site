// Siteyi derler: her sayfayı sunucuda bir kez HTML'e çevirir, public/ ile birlikte dist/'e yazar.
// Sitenin kendi JavaScript'i yoktur; tarayıcıya giden tek betik Google AdSense'inki (Layout.tsx <head>).
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import { LANGS, ORIGIN, PATHS, type Lang, type PageKey } from './site';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist');

const PAGES: Record<PageKey, { render: (lang: Lang) => ReactElement; lastmod: string }> = {
  home: { render: (lang) => <Home lang={lang} />, lastmod: '2026-10-02' },
  privacy: { render: (lang) => <Privacy lang={lang} />, lastmod: '2026-10-02' },
  terms: { render: (lang) => <Terms lang={lang} />, lastmod: '2026-10-02' },
};

/** "/" → index.html, "/en/" → en/index.html, "/ja/" → ja/index.html, "/gizlilik.html" → gizlilik.html */
const fileFor = (path: string) => (path.endsWith('/') ? path + 'index.html' : path).slice(1);

function write(file: string, content: string) {
  const target = join(out, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
  console.log('  ' + file);
}

const html = (el: ReactElement) => '<!doctype html>\n' + renderToStaticMarkup(el) + '\n';

rmSync(out, { recursive: true, force: true });
cpSync(join(root, 'public'), out, { recursive: true });

const urls: string[] = [];
for (const lang of LANGS) {
  for (const key of Object.keys(PAGES) as PageKey[]) {
    const path = PATHS[lang][key];
    write(fileFor(path), html(PAGES[key].render(lang)));
    urls.push(`  <url><loc>${ORIGIN}${path}</loc><lastmod>${PAGES[key].lastmod}</lastmod></url>`);
  }
}
write('404.html', html(<NotFound />));
write(
  'sitemap.xml',
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n'),
);
console.log('Site dist/ altına derlendi.');

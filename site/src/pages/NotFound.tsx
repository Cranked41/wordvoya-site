// nginx'in 404 sayfası (arama motorlarına kapalı).
import { Document } from '../Layout';
import { PATHS } from '../site';

export default function NotFound() {
  return (
    <Document lang="tr" title="Sayfa bulunamadı — Wordvoya" noindex>
      <main className="doc">
        <div className="wrap">
          <h1>Sayfa bulunamadı</h1>
          <p>
            Aradığın sayfa bu adada yok. <a href={PATHS.tr.home}>Ana sayfaya dön</a> · <a href={PATHS.en.home} lang="en">Home</a>
          </p>
        </div>
      </main>
    </Document>
  );
}

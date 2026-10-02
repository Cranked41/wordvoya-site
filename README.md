# wordvoya.com

Wordvoya oyununun tanıtım sitesi. Sayfalar React + TypeScript (TSX) ile yazılır, derlemede statik HTML'e çevrilir
ve nginx ile servis edilir; sitenin kendi JavaScript'i yoktur, yalnız her sayfanın `<head>`'inde Google AdSense
otomatik reklam betiği vardır (`Layout.tsx`, 2026-10-02). Reklam betiği, çerçeveleri ve görselleri çok sayıda Google
alan adından geldiği için nginx CSP'si kaynak kısıtlamaz; yalnız `frame-ancestors 'none'; base-uri 'self';
form-action 'none'; object-src 'none'`. Gizlilik politikası (15 dil) AdSense çerezlerini açıklar. Uygulama ayrı depoda:
`Cranked41/Wordvoya` (2026-10-01'de site oradan bu depoya, geçmişiyle taşındı).

| Yol | İçerik |
|---|---|
| `site/src/pages/Home.tsx` | Ana sayfa, 15 dil: `/` Türkçe, `/en/` İngilizce, öbürleri `/<dil>/` (metinleri `src/i18n.tsx`) |
| `site/src/pages/Privacy.tsx` | Gizlilik politikası: `/gizlilik.html`, `/<dil>/privacy.html` (uygulama Ayarlar'dan bağlanır) |
| `site/src/pages/Terms.tsx` | Kullanım şartları: `/kullanim-sartlari.html`, `/<dil>/terms.html` |
| `site/src/pages/legal/<dil>.tsx` | Gizlilik ve şartların tr/en dışındaki 13 dile çevirisi (başta "farklılıkta İngilizcesi geçerli" notu). tr/en metni değişince çeviriler de güncellenmeli |
| `site/src/pages/NotFound.tsx` | 404 sayfası |
| `site/src/Layout.tsx` | `<head>` etiketleri, üst çubuk, alt bilgi, metin sayfası iskeleti |
| `site/src/site.ts` | Diller (`LANGS`), sayfa yolları, AdSense hesabı, arayüz metinleri (tr/en; öbürleri `i18n.tsx`) |
| `site/src/i18n.tsx` | Ana sayfa ve arayüz metinleri: tr/en dışındaki 13 dil. Dil menüsü `<details>` ile, JavaScript'siz |
| `site/src/build.tsx` | Derleyici: sayfaları ve `sitemap.xml`'i `site/dist/`'e yazar |
| `site/public/` | Olduğu gibi kopyalanan dosyalar: `css/`, `img/`, `favicon.ico`, `robots.txt`, `app-ads.txt` (AdMob, kökte olmalı) |
| `site/Dockerfile`, `site/docker-compose.yml`, `site/nginx.conf` | Konteyner (sunucuda 127.0.0.1:8086) |

Google AdSense hesap etiketi (`ca-pub-7447009773268822`) `Layout.tsx`'teki `Document` bileşeninde; her sayfa onu
kullandığı için yeni sayfaya da kendiliğinden girer. Yeni sayfa: `pages/` altına bileşen, `site.ts`'deki `PATHS`'e yol,
`build.tsx`'teki `PAGES`'e kayıt (site haritası da oradan üretilir).

JSX'te satır sonu ile etiket arasındaki boşluk düşer: bir bağlantıyı ya da `<strong>`'u önündeki metinle aynı satırda
tut, yoksa sayfada "kelime<a>bağlantı" bitişik çıkar.

## Yerelde

```
cd site
npm install
npm run build        # tsc tip denetimi + dist/ üretimi
```

Konteynerle bakmak için: `cd site && docker compose up --build` → http://127.0.0.1:8086

## Yayın

`master`'a push'ta (`site/` değiştiyse) ya da elle (Actions > Siteyi yayınla > Run workflow) sunucuya dağıtılır: önce
Actions'ta derleme denetlenir, sonra `site/` `/root/wordvoya-site`'a kopyalanır, imaj (derleme + nginx) yeniden
kurulur, ayağa kalkmazsa önceki imaja dönülür. Önünde host nginx + HTTPS (certbot,
`/etc/nginx/sites-available/wordvoya.com`).

Secret'lar (Settings > Secrets and variables > Actions): `DEPLOY_HOST`, `DEPLOY_PORT`, `DEPLOY_USER`,
`DEPLOY_PASSWORD` — Wordvoya deposundakilerle aynı değerler.

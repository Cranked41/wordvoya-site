# wordvoya.com

Wordvoya oyununun tanıtım sitesi (statik HTML, nginx). Uygulama ayrı depoda: `Cranked41/Wordvoya`
(2026-10-01'de site oradan bu depoya, geçmişiyle taşındı).

| Yol | İçerik |
|---|---|
| `site/index.html`, `site/en/index.html` | Türkçe / İngilizce ana sayfa |
| `site/gizlilik.html`, `site/en/privacy.html` | Gizlilik politikası (uygulama Ayarlar'dan bağlanır) |
| `site/kullanim-sartlari.html`, `site/en/terms.html` | Kullanım şartları |
| `site/app-ads.txt` | AdMob yetkili satıcı doğrulaması (kökte olmalı) |
| `site/Dockerfile`, `site/docker-compose.yml`, `site/nginx.conf` | Konteyner (sunucuda 127.0.0.1:8086) |

Her sayfanın `<head>`'inde Google AdSense hesap etiketi var (`ca-pub-7447009773268822`); yeni sayfaya da eklenmeli.

## Yayın

`master`'a push'ta (`site/` değiştiyse) ya da elle (Actions > Siteyi yayınla > Run workflow) sunucuya dağıtılır:
dosyalar `/root/wordvoya-site`'a kopyalanır, imaj yeniden kurulur, ayağa kalkmazsa önceki imaja dönülür. Önünde
host nginx + HTTPS (certbot, `/etc/nginx/sites-available/wordvoya.com`).

Secret'lar (Settings > Secrets and variables > Actions): `DEPLOY_HOST`, `DEPLOY_PORT`, `DEPLOY_USER`,
`DEPLOY_PASSWORD` — Wordvoya deposundakilerle aynı değerler.

Yerelde bakmak için: `cd site && docker compose up --build` → http://127.0.0.1:8086

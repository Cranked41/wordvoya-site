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

## Skor tablosu API'si (`api/`)

Uygulamanın skor tablosu (2026-11-07'den beri Play Games yerine): `https://wordvoya.com/api/v1`. Bağımlılıksız Node 24
(TypeScript doğrudan çalışır), veritabanı tek SQLite dosyası. Sunucuda `/root/wordvoya-api`, konteyner
`127.0.0.1:8087`, veri `/root/wordvoya-api/data/wordvoya.db`, günlük yedek `data/backup/` (14 gün, cron 04:20).
Host nginx'te `location /api/` bu konteynere gider. `master` push'ta `api/` değiştiyse `.github/workflows/api.yml`
test edip dağıtır; ayağa kalkmazsa `:previous` imaja döner.

| Uç | İş |
|---|---|
| `POST /players {name}` | Yeni oyuncu: `{id, token, name}`. Belirteç yalnız cihazda; sunucuda SHA-256 özeti |
| `PATCH /players/me {name}` | Ad değiştir (Bearer belirteç) |
| `DELETE /players/me` | Kaydı tümüyle sil (uygulamada "Tablodan çık"; Play'in hesap silme şartı) |
| `PUT /players/me/scores {total, weekly, week, level, words, last?}` | Cihazdaki toplamlar; her tablo en iyiyi tutar |
| `GET /boards/{total,weekly,level,words}?scope=near` | İlk 25 ya da oyuncunun çevresi (11 satır) + `player` |

Ad 2-20 karakter, harf/rakam/boşluk/`._'-`, kaba söz listesi `src/validate.ts`. Hileli oyuncuyu gizlemek:
`docker exec -it wordvoya-api node -e "new (require('node:sqlite').DatabaseSync)('/data/wordvoya.db').prepare('UPDATE players SET hidden=1 WHERE name=?').run('AD')"`.
Yerelde: `cd api && npm test`.

### Yönetim paneli (`https://wordvoya.com/api/admin/`)

Oyuncular, puanları, bölüm sonuçları ve elmas bakiyeleri; admin rolü oyuncuya elmas hediye eder (oyuncu bir sonraki
senkronda alır, uygulamada "Sana hediye!" penceresi çıkar). Sayfa API ile birlikte kurulur (`api/admin/`), nginx
ayarı gerekmez.

- Roller: `admin` (görür, elmas verir/geri alır), `viewer` (yalnız görür).
- Şifreler scrypt özetiyle saklanır; oturum çerezi HttpOnly + SameSite=Strict, 7 gün. Girişte IP başına 15 dakikada 10 deneme.
- Hesaplar sunucuda açılır (şifre ekrana yazılmaz):

```sh
docker exec -it wordvoya-api node src/admin-cli.ts add <kullanıcı> admin
docker exec -it wordvoya-api node src/admin-cli.ts passwd <kullanıcı>
docker exec -it wordvoya-api node src/admin-cli.ts role <kullanıcı> viewer
docker exec -it wordvoya-api node src/admin-cli.ts remove <kullanıcı>
docker exec -it wordvoya-api node src/admin-cli.ts list
```

Elmas bakiyesi ve bölüm ayrıntısı uygulamanın 1.3.15 sürümünden itibaren gelir; eski sürümler yalnız toplamları gönderir.

### Güvenlik (2026-11-08 incelemesi)

- **Jeton:** sağlık (`/health`) ve kayıt dışında her oyuncu ucu `Authorization: Bearer <oyuncu jetonu>` ister (tablolar dahil).
  Jeton cihazda üretilir, sunucuda yalnız SHA-256'sı tutulur.
- **Kayıt (Play Integrity):** uygulama kayıt gövdesinin SHA-256'sına bağlı bir Standard API jetonu gönderir
  (`X-Integrity-Token`); sunucu `src/integrity.ts` ile Google'a çözdürür: paket adı, gövde özeti, tazelik (5 dk),
  `PLAY_RECOGNIZED`, cihazda en az temel bütünlük, gövdede nonce, aynı jeton ikinci kez değil. Modlar (`INTEGRITY_MODE`):
  `off` (denetim yok) → `report` (denetler, sayar, engellemez) → `enforce` (geçmeyen kayıt 403). Zorunlu modda anahtar
  okunamazsa kayıt hiç açılmaz (fail closed). Panel özetinde mod ve sebep sebep sayılar görünür.
- **Puan artışı** son gönderimden beri geçen gerçek süreyle sınırlı (`db.ts growthLimit`); fazlası kırpılır, oyuncu panelde
  "şüpheli" işaretlenir. İlk gönderim cihazdaki geçmişi taşır, tavanı `IMPORT_MAX_*`.
- **Panel:** scrypt şifre, HttpOnly + SameSite=Strict + Secure çerez, IP başına 15 dakikada 10, kullanıcı adı başına saatte
  30 giriş, aynı anda en çok 4 scrypt; CSRF için Origin + JSON şartı; sıkı CSP.
- **Konteyner:** salt okunur dosya sistemi, yetkiler kapalı, `no-new-privileges`, süreç ve günlük sınırı; `.dockerignore`
  veritabanını ve anahtarı imaja sokmaz. CI'daki üçüncü taraf eylemler commit özetine sabit.
- `npm run security`: 72 saldırı denemesi (yetki, IDOR, hile, enjeksiyon, CSRF, kaba kuvvet, sınırlar) bellekteki kopyaya.
- `postman/`: koleksiyon + ortam. Run collection ile baştan sona; deneme oyuncularını panel açar, sonda hepsi silinir.

**Play Integrity'yi açmak (bir kez):**

1. Play Console > Test ve yayınla > Uygulama bütünlüğü: bir Google Cloud projesi bağla. Proje NUMARASI uygulamadaki
   `integrityProjectNumber` (Wordvoya `app/androidApp/build.gradle.kts`) ile aynı olmalı.
2. O Cloud projesinde **Google Play Integrity API**'yi etkinleştir; bir servis hesabı aç (rol gerekmez), JSON anahtarı indir.
3. Sunucuya koy (anahtar depoya girmez):
   `mkdir -p /root/wordvoya-api/secrets && mv anahtar.json /root/wordvoya-api/secrets/play-integrity.json && chown 1000:1000 /root/wordvoya-api/secrets/play-integrity.json && chmod 400 /root/wordvoya-api/secrets/play-integrity.json`
4. `/root/wordvoya-api/.env` içine `INTEGRITY_MODE=report`, sonra `cd /root/wordvoya-api && docker compose up -d`.
5. Jeton gönderen uygulama sürümü yayınlandıktan sonra paneldeki Play Integrity kartına bak; eski sürümler azalıp
   geçmeyenler sıfıra yakınsa `INTEGRITY_MODE=enforce` ve yine `docker compose up -d`.

**nginx (bir kez):** `api/nginx-hardening.sh` HSTS ekler, nginx sürümünü gizler (`scp api\nginx-hardening.sh vds:/root/` ve `ssh vds sh /root/nginx-hardening.sh`).

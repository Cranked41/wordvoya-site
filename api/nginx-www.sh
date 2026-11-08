#!/bin/sh
# Bir kez, sunucuda çalıştırılır (2026-11-08): www.wordvoya.com'u wordvoya.com'a kalıcı (301) yönlendirir.
# Önceden www sitenin aynısını yönlendirmesiz gösteriyordu (Search Console'da yinelenen içerik).
#   https://www.wordvoya.com/x -> https://wordvoya.com/x   (tek atlama, HSTS'li)
#   http://www.wordvoya.com/x  -> https://wordvoya.com/x   (eskiden önce https://www'ye gidiyordu, iki atlama)
# ads.txt / app-ads.txt www'de de yönlendirmesiz 200 kalır (reklam tarayıcısı yönlendirmeyi her zaman izlemiyor).
# Sertifika zaten iki adı da kapsıyor (SAN: wordvoya.com, www.wordvoya.com); certbot yenilemesi etkilenmez.
# Yalnız wordvoya.com dosyasını değiştirir; yedek alır, nginx -t başarısızsa geri yükler.
# Kullanım (Windows cmd): scp api\nginx-www.sh vds:/root/  &&  ssh vds sh /root/nginx-www.sh
set -e
f=/etc/nginx/sites-available/wordvoya.com
if grep -q "server_name www.wordvoya.com;" "$f"; then echo "Zaten ekli, değişiklik yok."; exit 0; fi
bak="/root/wordvoya.com.nginx.bak-$(date +%Y%m%d%H%M%S)"
cp "$f" "$bak"
python3 - "$f" <<'PY'
import sys
p = sys.argv[1]
s = open(p).read()

both = "    server_name wordvoya.com www.wordvoya.com;\n"
assert s.count(both) == 2, "beklenen iki server_name satırı yok"
# 1) İlk blok (443): artık yalnız çıplak alan adı.
s = s.replace(both, "    server_name wordvoya.com;\n", 1)

# 2) 80 bloğu: www dahil her şey doğrudan https://wordvoya.com'a.
old = "return 301 https://$host$request_uri;"
assert s.count(old) == 1, "80 bloğundaki yönlendirme satırı bulunamadı"
s = s.replace(old, "return 301 https://wordvoya.com$request_uri;")

# 3) www için ayrı 443 bloğu: aynı sertifika, yalnız yönlendirme.
ads = 'default_type text/plain; return 200 "google.com, pub-7447009773268822, DIRECT, f08c47fec0942fa0\\n";'
s = s.rstrip("\n") + f"""

# www.wordvoya.com -> wordvoya.com (2026-11-08, nginx-www.sh)
server {{
    server_name www.wordvoya.com;
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/wordvoya.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/wordvoya.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    add_header Strict-Transport-Security "max-age=31536000" always;
    server_tokens off;

    location = /ads.txt {{ {ads} }}
    location = /app-ads.txt {{ {ads} }}
    location / {{ return 301 https://wordvoya.com$request_uri; }}
}}
"""
open(p, "w").write(s)
PY
if nginx -t; then
  systemctl reload nginx
  echo "Tamam: nginx yeniden yüklendi. Yedek: $bak"
  for u in https://www.wordvoya.com/en/ http://www.wordvoya.com/en/ http://wordvoya.com/en/ https://wordvoya.com/en/ https://www.wordvoya.com/ads.txt; do
    echo "$u -> $(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' "$u")"
  done
else
  echo "nginx -t başarısız, yedek geri yükleniyor."
  cp "$bak" "$f"
  exit 1
fi

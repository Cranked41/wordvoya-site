#!/bin/sh
# Bir kez, sunucuda çalıştırılır: host nginx'te https://wordvoya.com/api/ → wordvoya-api konteyneri (127.0.0.1:8087).
# Kullanım (Windows cmd): scp api\nginx-api.sh vds:/root/  &&  ssh vds sh /root/nginx-api.sh
set -e
f=/etc/nginx/sites-available/wordvoya.com
if grep -q "location /api/" "$f"; then echo "Zaten ekli, değişiklik yok."; exit 0; fi
cp "$f" "/root/wordvoya.com.nginx.bak-$(date +%Y%m%d%H%M)"
python3 - "$f" <<'PY'
import sys
p = sys.argv[1]
s = open(p).read()
block = """    # Skor tablosu API (wordvoya-site deposu api/, konteyner 127.0.0.1:8087; 2026-11-07)
    location /api/ {
        proxy_pass http://127.0.0.1:8087;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 8k;
    }

"""
i = s.index("    location / {")   # ilk server bloğu: 443 (HTTPS)
open(p, "w").write(s[:i] + block + s[i:])
PY
if nginx -t; then
  systemctl reload nginx
  echo "Tamam: nginx yeniden yüklendi."
  curl -s https://wordvoya.com/api/v1/health; echo
else
  echo "nginx -t başarısız, yedek geri yükleniyor."
  cp "$(ls -t /root/wordvoya.com.nginx.bak-* | head -1)" "$f"
  exit 1
fi

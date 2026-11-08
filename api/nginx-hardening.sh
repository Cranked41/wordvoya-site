#!/bin/sh
# Bir kez, sunucuda çalıştırılır (güvenlik incelemesi 2026-11-08): wordvoya.com HTTPS bloğuna HSTS ekler ve nginx
# sürümünü yanıtlardan gizler. Yalnız wordvoya.com'u etkiler (infidoc ve öbür siteler değişmez).
# Kullanım (Windows cmd): scp api\nginx-hardening.sh vds:/root/  &&  ssh vds sh /root/nginx-hardening.sh
set -e
f=/etc/nginx/sites-available/wordvoya.com
if grep -q "Strict-Transport-Security" "$f"; then echo "Zaten ekli, değişiklik yok."; exit 0; fi
cp "$f" "/root/wordvoya.com.nginx.bak-$(date +%Y%m%d%H%M)"
python3 - "$f" <<'PY'
import sys
p = sys.argv[1]
s = open(p).read()
anchor = "    server_name wordvoya.com www.wordvoya.com;\n"
i = s.index(anchor) + len(anchor)   # ilk server bloğu: 443 (HTTPS)
block = """    # Güvenlik (2026-11-08): tarayıcı bu siteye 1 yıl yalnız HTTPS ile gelir; nginx sürümü yanıtlarda görünmez
    add_header Strict-Transport-Security "max-age=31536000" always;
    server_tokens off;
"""
open(p, "w").write(s[:i] + block + s[i:])
PY
if nginx -t; then
  systemctl reload nginx
  echo "Tamam: nginx yeniden yüklendi."
  curl -sI https://wordvoya.com/api/v1/health | grep -iE "^server:|strict-transport"
else
  echo "nginx -t başarısız, yedek geri yükleniyor."
  cp "$(ls -t /root/wordvoya.com.nginx.bak-* | head -1)" "$f"
  exit 1
fi

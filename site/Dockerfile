# Wordvoya tanıtım sitesi: nginx ile statik servis (sunucuda 127.0.0.1:8086, önünde host nginx + HTTPS)
FROM nginx:1.27-alpine

RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
# app-ads.txt: AdMob yetkili satıcı doğrulaması (Play'deki geliştirici sitesinin kökünde olmalı)
COPY *.html robots.txt sitemap.xml favicon.ico app-ads.txt /usr/share/nginx/html/
COPY en /usr/share/nginx/html/en
COPY css /usr/share/nginx/html/css
COPY img /usr/share/nginx/html/img

EXPOSE 80

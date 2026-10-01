# Wordvoya tanıtım sitesi: TSX sayfalar derlenip statik HTML olarak nginx ile servis edilir
# (sunucuda 127.0.0.1:8086, önünde host nginx + HTTPS).

# 1) Derleme: src/**/*.tsx → dist/*.html, public/ olduğu gibi kopyalanır
#    (app-ads.txt: AdMob yetkili satıcı doğrulaması, sitenin kökünde olmalı)
FROM node:24-alpine AS build
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY tsconfig.json ./
COPY src src
COPY public public
RUN npm run build

# 2) Servis: yalnız derlenmiş dosyalar; tarayıcıya JavaScript gitmez
FROM nginx:1.27-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/dist /usr/share/nginx/html

EXPOSE 80

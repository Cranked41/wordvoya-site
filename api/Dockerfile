# Wordvoya skor tablosu API'si: bağımlılıksız Node (TypeScript doğrudan çalışır), veritabanı /data'da SQLite.
FROM node:24-alpine
ENV NODE_ENV=production PORT=8080 DB_PATH=/data/wordvoya.db NODE_NO_WARNINGS=1
WORKDIR /app
COPY package.json ./
COPY src src
RUN mkdir -p /data && chown node:node /data
USER node
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:8080/api/v1/health >/dev/null || exit 1
CMD ["node", "src/server.ts"]

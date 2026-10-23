<?xml version="1.0" encoding="UTF-8"?>
<!--
  sitemap.xml'in tarayıcıda okunur görünümü (site/src/build.tsx bağlar; arama motorları bu dosyayı kullanmaz, XML'i okur). Bazı tarayıcılar
  biçemsiz XML'i ağaç yerine düz yazı olarak döküyordu ("XML gelmiyor" sanıldı, 2026-10-23).
-->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  exclude-result-prefixes="s">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:variable name="freq" select="boolean(/s:urlset/s:url/s:changefreq)"/>
  <xsl:variable name="prio" select="boolean(/s:urlset/s:url/s:priority)"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex"/>
        <title>Sitemap — wordvoya.com</title>
        <style>
          body { font: 15px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 24px 16px;
                 color: #1f2a30; background: #f7f5f0; }
          main { max-width: 1040px; margin: 0 auto; }
          h1 { font-size: 1.5rem; margin: 0 0 4px; }
          p { color: #56656d; margin: 0 0 18px; }
          .wrap { overflow-x: auto; background: #fff; border: 1px solid #e4dccf; border-radius: 12px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #eee6da; white-space: nowrap; }
          th { background: #f3ede3; font-size: .85rem; color: #56656d; }
          tr:last-child td { border-bottom: 0; }
          td.n { color: #8a969c; width: 1%; }
          a { color: #1b5e7a; }
          @media (prefers-color-scheme: dark) {
            body { background: #0e171c; color: #e6edf0; }
            p, th { color: #a9b6bc; }
            .wrap { background: #16232a; border-color: #2a3a42; }
            th { background: #1c2b33; }
            th, td { border-color: #2a3a42; }
            a { color: #8cc8e0; }
          }
        </style>
      </head>
      <body>
        <main>
          <h1>Sitemap</h1>
          <p>
            This is the XML sitemap prepared for search engines (<xsl:value-of select="count(s:urlset/s:url)"/> addresses).
            Search engines read the same file as XML; this table is only for reading it in a browser.
          </p>
          <div class="wrap">
            <table>
              <thead>
                <tr><th>#</th><th>Address</th><th>Last modified</th><xsl:if test="$freq"><th>Frequency</th></xsl:if><xsl:if test="$prio"><th>Priority</th></xsl:if></tr>
              </thead>
              <tbody>
                <xsl:for-each select="s:urlset/s:url">
                  <tr>
                    <td class="n"><xsl:value-of select="position()"/></td>
                    <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
                    <td><xsl:value-of select="s:lastmod"/></td>
                    <xsl:if test="$freq"><td><xsl:value-of select="s:changefreq"/></td></xsl:if>
                    <xsl:if test="$prio"><td><xsl:value-of select="s:priority"/></td></xsl:if>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>

import { Metadata } from 'next'

/* https://realfavicongenerator.net/ */
/* Next.js App Router'da favicon'lar Metadata API ile app/[locale]/layout.tsx dosyasında tanımlanmıştır */

/**
 * Bu dosya artık kullanılmıyor.
 * Favicon'lar app/[locale]/layout.tsx dosyasında Metadata API ile tanımlanmıştır.
 * 
 * Favicon dosyaları: /public/assets/favicon/ klasöründe bulunmaktadır.
 */
export function getFaviconMetadata(): Metadata['icons'] {
  return {
    icon: [
      { url: "/assets/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/assets/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/assets/favicon/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/assets/favicon/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
      { url: "/assets/favicon/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "/assets/favicon/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/assets/favicon/apple-icon-76x76.png", sizes: "76x76", type: "image/png" },
      { url: "/assets/favicon/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/assets/favicon/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
      { url: "/assets/favicon/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/assets/favicon/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/assets/favicon/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "manifest", url: "/assets/favicon/manifest.json" },
    ],
  };
}
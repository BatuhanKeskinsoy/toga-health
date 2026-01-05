import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { GlobalContextProvider } from "@/app/Context/GlobalContext";
import LocaleSetter from "@/components/others/LocaleSetter";
import "@/public/styles/globals.css";

export const metadata: Metadata = {
  title: "TOGA Health",
  description: "TOGA Health",
  icons: {
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
  },
  manifest: "/assets/favicon/manifest.json",
  other: {
    "msapplication-TileColor": "#ffffff",
    "msapplication-TileImage": "/assets/favicon/ms-icon-144x144.png",
    "theme-color": "#ffffff",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (await import(`@/public/locales/${locale}.json`)).default;
  
  // Server-side'da location bilgilerini al
  return (
    <html
      lang={locale}
      dir={locale === "ar" || locale === "he" ? "rtl" : "ltr"}
    >
      <body>
        <GlobalContextProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
          <LocaleSetter locale={locale} />
        </GlobalContextProvider>
      </body>
    </html>
  );
}

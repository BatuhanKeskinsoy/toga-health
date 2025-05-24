import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import "@/public/styles/globals.css";

export const metadata: Metadata = {
  title: "TOGA Health",
  description: "TOGA Health",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const messages = (await import(`@/locales/${locale}.json`)).default;

  return (
    <html lang={locale} dir={locale === "ar" || locale === "he" ? "rtl" : "ltr"}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
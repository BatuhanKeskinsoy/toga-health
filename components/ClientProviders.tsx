import { NextIntlClientProvider } from 'next-intl';

export default function ClientProviders({ children, locale, messages }: { children: React.ReactNode, locale: string, messages: any }) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
} 
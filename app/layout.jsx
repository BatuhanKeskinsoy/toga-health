import '@/public/styles/globals.css'

export const metadata = {
  title: "TOGA Health",
  description: "TOGA Health",
};

export default function RootLayout({ children }) {
  const lang = 'en';
  const dir = lang === 'ar' || lang === 'he' ? 'rtl' : 'ltr';
  return (
    <html lang={lang} dir={dir}>
      <body>
        {children}
      </body>
    </html>
  );
}

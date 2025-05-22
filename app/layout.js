import '@/public/globals.css'

export const metadata = {
  title: "TOGA Health",
  description: "TOGA Health",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

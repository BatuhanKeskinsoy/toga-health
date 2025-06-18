import Header from "@/components/(front)/Inc/Header/Header";
import Footer from "@/components/(front)/Inc/Footer/Footer";
import { getGeneralSettings } from "@/lib/utils/getGeneralSettings";

export const metadata = {
  title: "TOGA Health",
  description: "TOGA Health",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const generals = await getGeneralSettings(locale);
  return (
    <>
      <Header generals={generals} />
      {children}
      <Footer />
    </>
  );
}

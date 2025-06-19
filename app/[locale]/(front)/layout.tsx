import Header from "@/components/(front)/Inc/Header/Header";
import Footer from "@/components/(front)/Inc/Footer/Footer";
import { getGeneralSettings } from "@/lib/utils/getGeneralSettings";

export default async function FrontLayout({
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
      <main className="flex-1 mt-5">{children}</main>
      <Footer />
    </>
  );
}

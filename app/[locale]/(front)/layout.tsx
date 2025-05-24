import Header from "@/components/(front)/Inc/Header/Header";
import Footer from "@/components/(front)/Inc/Footer/Footer";

export const metadata = {
  title: "TOGA Health",
  description: "TOGA Health",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

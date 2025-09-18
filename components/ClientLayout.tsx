import React from "react";
import ClientProviders from "@/components/ClientProviders";
import { PusherProvider } from "@/lib/context/PusherContext";
import Header from "@/components/(front)/Inc/Header/Header";
import Footer from "@/components/(front)/Inc/Footer/Footer";
import { UserTypes } from "@/lib/types/user/UserTypes";

export default function ClientLayout({ children, locale, messages, generals, translations, user }: {
  children: React.ReactNode;
  locale: string;
  messages: any;
  generals: any;
  translations: any;
  user?: UserTypes | null;
}) {
  return (
    <ClientProviders locale={locale} messages={messages}>
      <PusherProvider user={user}>
        <Header generals={generals} translations={translations} user={user} />
        <main className="flex-1 min-h-[calc(200vh)]">{children}</main>
        <Footer />
      </PusherProvider>
    </ClientProviders>
  );
} 
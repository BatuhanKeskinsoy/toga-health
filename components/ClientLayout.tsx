import React from "react";
import ClientProviders from "@/components/ClientProviders";
import Header from "@/components/(front)/Inc/Header/Header";
import Footer from "@/components/(front)/Inc/Footer/Footer";
import { UserTypes } from "@/lib/types/user/UserTypes";
import ClientPusherWrapper from "@/components/ClientPusherWrapper";

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
      <ClientPusherWrapper user={user}>
        <Header generals={generals} translations={translations} user={user} />
        <main className="flex-1 min-h-[calc(200vh)]">{children}</main>
        <Footer generals={generals} />
      </ClientPusherWrapper>
    </ClientProviders>
  );
} 
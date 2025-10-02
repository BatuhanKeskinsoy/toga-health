import React from "react";
import ClientProviders from "@/components/ClientProviders";
import Header from "@/components/(front)/Inc/Header/Header";
import Footer from "@/components/(front)/Inc/Footer/Footer";
import { UserTypes } from "@/lib/types/user/UserTypes";
import ClientPusherWrapper from "@/components/ClientPusherWrapper";
import { SettingsResponse } from "@/lib/types/settings/settingsTypes";

export default function ClientLayout({ children, locale, messages, generals, user }: {
  children: React.ReactNode;
  locale: string;
  messages: any;
  generals: SettingsResponse;
  user?: UserTypes | null;
}) {
  return (
    <ClientProviders locale={locale} messages={messages}>
      <ClientPusherWrapper user={user}>
        <Header generals={generals} />
        <main className="flex flex-col w-full pb-4 lg:pb-8">{children}</main>
        <Footer locale={locale} generals={generals} />
      </ClientPusherWrapper>
    </ClientProviders>
  );
} 
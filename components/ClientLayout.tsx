import React from "react";
import ClientProviders from "@/components/ClientProviders";
import Header from "@/components/(front)/Inc/Header/Header";
import Footer from "@/components/(front)/Inc/Footer/Footer";
import WhatsAppButton from "@/components/(front)/Inc/WhatsAppButton/WhatsAppButton";
import { UserTypes } from "@/lib/types/user/UserTypes";
import ClientPusherWrapper from "@/components/ClientPusherWrapper";
import { SettingsResponse } from "@/lib/types/settings/settingsTypes";
import type { Contract } from "@/lib/types/contracts";

export default function ClientLayout({ children, locale, messages, generals, user, contracts = [] }: {
  children: React.ReactNode;
  locale: string;
  messages: any;
  generals: SettingsResponse;
  user?: UserTypes | null;
  contracts?: Contract[];
}) {
  return (
    <ClientProviders locale={locale} messages={messages}>
      <ClientPusherWrapper user={user}>
        <Header generals={generals} user={user} />
        <main className="flex flex-col w-full">{children}</main>
        <Footer locale={locale} generals={generals} contracts={contracts} />
        <WhatsAppButton generals={generals} />
      </ClientPusherWrapper>
    </ClientProviders>
  );
}
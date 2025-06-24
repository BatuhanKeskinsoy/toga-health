"use client";
import React from "react";
import ClientProviders from "@/components/ClientProviders";
import { PusherProvider } from "@/lib/context/PusherContext";
import Header from "@/components/(front)/Inc/Header/Header";
import Footer from "@/components/(front)/Inc/Footer/Footer";

export default function ClientLayout({ children, locale, messages, generals, translations }: {
  children: React.ReactNode;
  locale: string;
  messages: any;
  generals: any;
  translations: any;
}) {
  return (
    <ClientProviders locale={locale} messages={messages}>
      <PusherProvider>
        <Header generals={generals} translations={translations} />
        <main className="flex-1 mt-5">{children}</main>
        <Footer />
      </PusherProvider>
    </ClientProviders>
  );
} 
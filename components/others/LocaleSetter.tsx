"use client";
import { useEffect } from "react";
import { useGlobalContext } from "@/app/Context/GlobalContext";

export default function LocaleSetter({ locale }: { locale: string }) {
  const { setLocale } = useGlobalContext();

  useEffect(() => {
    setLocale(locale);
    
    // Cookie'ye locale'i set et
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  }, [locale, setLocale]);
  
  return null;
}


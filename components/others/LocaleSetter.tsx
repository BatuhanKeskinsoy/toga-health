"use client";
import { useEffect } from "react";
import { useGlobalContext } from "@/app/[locale]/Context/store";

export default function LocaleSetter({ locale }: { locale: string }) {
  const { setLocale } = useGlobalContext();

  useEffect(() => {
    setLocale(locale);
  }, [locale, setLocale]);

  return null;
}
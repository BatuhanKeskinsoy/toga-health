import React from 'react'
import "@/public/styles/globals.css";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "TOGA Health",
  description: "TOGA Health",
};

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return { children };
}
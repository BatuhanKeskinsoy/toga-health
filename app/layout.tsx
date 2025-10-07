import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TOGA Health",
  description: "TOGA Health",
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

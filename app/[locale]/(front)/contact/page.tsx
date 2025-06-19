import React from "react";
import Contact from "@/components/(front)/Contact/Contact";
import Breadcrumb from "@/components/others/Breadcrumb";

export default function Page({ params }: { params: { locale: string } }) {
  const { locale } = params;
  console.log("Aktif dil (locale):", locale);
  const breadcrumbs = [
    { title: locale === "tr" ? "Anasayfa" : "Home", slug: "/" },
    { title: locale === "tr" ? "İletişim" : "Contact", slug: "/contact" },
  ];
  return (
    <>
      <div className="container mx-auto px-4 lg:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} />
      </div>
      <Contact />
    </>
  );
}

import React from "react";
import Contact from "@/components/(front)/Contact/Contact";
import Breadcrumb from "@/components/others/Breadcrumb";

export default function Page() {
  const breadcrumbs = [
    { title: 'İletişim', slug: '/contact' },
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
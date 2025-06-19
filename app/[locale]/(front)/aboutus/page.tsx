import React from "react";
import AboutUs from "@/components/(front)/AboutUs/AboutUs";
import Breadcrumb from "@/components/others/Breadcrumb";

export default function Page() {
  const breadcrumbs = [
    { title: "Hakkımızda", slug: "/aboutus" },
  ];
  return (
    <>
      <div className="container mx-auto px-4 lg:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} />
      </div>
      <AboutUs />
    </>
  );
}
import React from "react";
import { Metadata } from "next";
import { TbError404 } from "react-icons/tb";
import "@/public/styles/globals.css";

export const metadata: Metadata = {
  title: "TOGA Health",
  description: "TOGA Health",
  robots: "noindex, nofollow",
};

async function NotFound() {
  return (
    <div className="relative w-screen h-screen flex items-center justify-center gap-4 py-4 bg-gray-100">
      <div className="flex flex-col items-center justify-center xl:gap-12 gap-8">
        <div className="xl:p-12 p-6 bg-sitePrimary/10 rounded-full">
          <TbError404 className="xl:size-62 size-48 max-w-full text-sitePrimary" />
        </div>
      </div>
    </div>
  );
}

export default NotFound;

"use client";
import { navLinksAuthIndividual } from "@/constants";
import { Link, usePathname } from "@/i18n/navigation";
import React from "react";

export default function ProfileSidebar() {
  const path = usePathname();

  const isActive = (linkUrl: string) =>
    path === linkUrl || (path.startsWith(linkUrl + "/en/") && linkUrl !== "/en/profile");

  return (
    <nav className="flex flex-col gap-2 w-full rounded-md bg-white shadow-md shadow-gray-200 p-3">
      {navLinksAuthIndividual.map(link => (
        <Link
          key={link.url}
          href={link.url}
          title={link.title}
          className={`lg:py-2.5 py-3 px-4 w-full transition-all duration-300 last:border-b-0 border-b border-gray-200 ${
            isActive(link.url)
              ? "text-white bg-sitePrimary rounded-md border-transparent"
              : "bg-white hover:text-sitePrimary hover:bg-sitePrimary/10 hover:rounded-md hover:border-transparent"
          }`}
        >
          {link.title}
        </Link>
      ))}
    </nav>
  );
}
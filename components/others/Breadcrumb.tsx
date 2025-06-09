import React from "react";
import Link from "next/link";
import { IoChevronForwardOutline } from "react-icons/io5";

interface Crumb { title: string; slug?: string }
interface BreadcrumbProps { crumbs: Crumb[] }

export default function Breadcrumb({ crumbs }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className="md:flex hidden items-center my-5 gap-3">
      <Link href="/" title="Ana Sayfa" className="text-sm hover:text-sitePrimary">
        Anasayfa
      </Link>
      {crumbs.map((c, i) => (
        <div key={i} className="flex items-center gap-2">
          <IoChevronForwardOutline size={16} className="opacity-70" />
          {c.slug ? (
            <Link href={c.slug} title={c.title} className={`text-sm ${i === crumbs.length - 1 ? "text-sitePrimary font-semibold" : "hover:text-sitePrimary"}`}>
              {c.title}
            </Link>
          ) : (
            <span className="text-sm text-gray-600">{c.title}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

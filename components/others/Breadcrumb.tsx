import { Link } from "@/i18n/navigation";
import { IoChevronForwardOutline } from "react-icons/io5";

interface BreadcrumbProps {
  crumbs: { title: string; slug?: string }[];
}

export default function Breadcrumb({ crumbs }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className="md:flex hidden items-center my-5 gap-3">
      {crumbs.map((c, i) => (
        <div key={`${c.title}-${i}`} className="flex items-center gap-2">
          {i !== 0 && (
            <IoChevronForwardOutline size={16} className="opacity-70 ltr:rotate-0 rtl:rotate-180" />
          )}
          {c.slug ? (
            <Link href={c.slug} title={c.title} className={`text-sm ${i === crumbs.length - 1 ? "text-sitePrimary font-medium" : "hover:text-sitePrimary"}`}>
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

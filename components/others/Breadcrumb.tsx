import { Link } from "@/i18n/navigation";
import { IoChevronForwardOutline } from "react-icons/io5";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";

interface BreadcrumbProps {
  crumbs: { title: string; slug?: string; slugPattern?: string; params?: Record<string, string> }[];
  locale: string;
}

export default function Breadcrumb({ crumbs, locale }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className="lg:flex hidden items-center mt-10 mb-4 gap-3">
      {crumbs.map((c, i) => {
        // slugPattern ve params varsa dinamik, yoksa statik
        const href = c.slugPattern
          ? getLocalizedUrl(c.slugPattern, locale, c.params)
          : c.slug;
        return (
          <div key={`${c.title}-${i}`} className="flex items-center gap-2">
            {i !== 0 && (
              <IoChevronForwardOutline size={16} className="opacity-70 ltr:rotate-0 rtl:rotate-180" />
            )}
            {href ? (
              <Link
                href={href}
                title={c.title}
                className={`text-sm transition-all duration-300 ${
                  i === crumbs.length - 1 ? "text-sitePrimary font-medium" : "hover:text-sitePrimary"
                }`}
              >
                {c.title}
              </Link>
            ) : (
              <span className="text-sm text-gray-600">{c.title}</span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

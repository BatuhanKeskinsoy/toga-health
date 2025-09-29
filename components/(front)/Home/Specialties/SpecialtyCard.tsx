import React from "react";
import { PopularSpecialty } from "@/lib/types/pages/homeTypes";
import { IoMedicalOutline } from "react-icons/io5";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { Link } from "@/i18n/navigation";

interface SpecialtyCardProps {
  specialty: PopularSpecialty;
  locale: string;
}

export default function SpecialtyCard({
  specialty,
  locale,
}: SpecialtyCardProps) {
  return (
    <Link
      href={getLocalizedUrl("/branches/[slug]", locale, {
        slug: specialty.slug,
      })}
      className="relative flex gap-3 bg-gray-50 rounded-md p-4 shadow-md shadow-transparent hover:shadow-gray-200 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:-translate-y-1 h-full hover:bg-blue-50 hover:border-blue-200 group"
      aria-label={`${specialty.name} branşını görüntüle`}
    >
      <div className="w-16 h-16 min-w-16 bg-gradient-to-br from-blue-400 to-blue-700 rounded-md flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-md">
        <IoMedicalOutline className="text-3xl text-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center gap-0.5">
        <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-700 transition-colors duration-300 line-clamp-1">
          {specialty.name}
        </h3>
        <div className="text-sm font-medium">
          {specialty.doctors_count} doktor
        </div>
      </div>
    </Link>
  );
}

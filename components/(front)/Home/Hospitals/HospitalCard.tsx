import React from "react";
import { HomeHospital } from "@/lib/types/pages/homeTypes";
import { IoLocationOutline } from "react-icons/io5";
import { getStar } from "@/lib/functions/getStar";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { Link } from "@/i18n/navigation";
import ProfilePhoto from "@/components/others/ProfilePhoto";

interface HospitalCardProps {
  hospital: HomeHospital;
  locale: string;
}

export default function HospitalCard({ hospital, locale }: HospitalCardProps) {
  return (
    <Link
      href={getLocalizedUrl("/hospital/[...slug]", locale, {
        slug: [
          hospital.slug,
          hospital.location.country_slug,
          hospital.location.city_slug,
        ].join("/"),
      })}
      className="relative flex gap-3 bg-gray-50 rounded-md p-4 shadow-md shadow-transparent hover:shadow-gray-200 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:-translate-y-1 h-full hover:bg-sitePrimary/5 hover:border-sitePrimary/20 group"
      aria-label={`${hospital.name} hastanesini görüntüle`}
    >
      <div className="relative min-w-20 w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
        <ProfilePhoto
          photo={hospital.photo}
          name={hospital.name}
          size={80}
          fontSize={26}
          responsiveSizes={{
            desktop: 80,
            mobile: 64,
          }}
          responsiveFontSizes={{
            desktop: 22,
            mobile: 16,
          }}
        />
      </div>
      <div className="flex-1 flex flex-col justify-center gap-0.5">
        <h3 className="text-lg font-medium text-gray-900 group-hover:text-sitePrimary transition-colors duration-300 line-clamp-1">
          {hospital.name}
        </h3>
        <div className="flex items-center gap-1 mt-1">
          {getStar(hospital.rating, 5, 16)}
          {hospital.rating && (
            <span className="text-xs font-semibold text-gray-700">
              {hospital.rating.toFixed(1)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
          <IoLocationOutline className="text-sm" />
          <span className="line-clamp-1">
            {hospital.location.city}, {hospital.location.country}
          </span>
        </div>
      </div>
    </Link>
  );
}

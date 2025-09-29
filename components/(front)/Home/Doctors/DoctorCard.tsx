import React from "react";
import { HomeDoctor } from "@/lib/types/pages/homeTypes";
import { IoLocationOutline } from "react-icons/io5";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import Link from "next/link";
import ProfilePhoto from "@/components/others/ProfilePhoto";
import { getStar } from "@/lib/functions/getStar";

interface DoctorCardProps {
  doctor: HomeDoctor;
  locale: string;
}

export default function DoctorCard({ doctor, locale }: DoctorCardProps) {
  return (
    <Link
      href={getLocalizedUrl(`/doktor/${doctor.slug}`, locale)}
      className="group relative block h-full"
      aria-label={`${doctor.name} doktorunu görüntüle`}
    >
      <div className="relative flex gap-3 bg-white rounded-md p-4 shadow-md shadow-transparent hover:shadow-gray-200 hover:shadow-lg transition-all duration-300 border border-gray-200 group-hover:-translate-y-1">
        <div className="relative min-w-20 w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-300">
          <ProfilePhoto
            photo={doctor.photo}
            name={doctor.name}
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
            {doctor.name}
          </h3>
          {doctor.specialty && (
            <div className="text-sm font-medium text-gray-600 line-clamp-1">
              {doctor.specialty.name}
            </div>
          )}
          {doctor.rating && (
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, index) => (
                  <React.Fragment key={index}>
                    {getStar(index + 1, doctor.rating || 0, 16)}
                  </React.Fragment>
                ))}
              </div>
              <span className="text-xs opacity-70">
                {doctor.rating.toFixed(1)}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <IoLocationOutline className="text-sm" />
            <span className="line-clamp-1">
              {doctor.location.city}, {doctor.location.country}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

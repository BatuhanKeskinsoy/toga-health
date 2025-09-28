"use client";
import React from "react";
import { HomeHospital } from "@/lib/types/pages/homeTypes";
import { IoStar, IoLocationOutline, IoBusinessOutline } from "react-icons/io5";
import { getStar } from "@/lib/functions/getStar";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import Link from "next/link";

interface HospitalCardProps {
  hospital: HomeHospital;
  locale: string;
}

export default function HospitalCard({ hospital, locale }: HospitalCardProps) {
  const getHospitalTypeColor = (type: string | null) => {
    switch (type) {
      case "hospital":
        return "text-red-600";
      case "clinic":
        return "text-green-600";
      case "medical_center":
        return "text-purple-600";
      case "laboratory":
        return "text-indigo-600";
      default:
        return "text-gray-600";
    }
  };

  const getHospitalTypeName = (type: string | null) => {
    switch (type) {
      case "hospital":
        return "Hastane";
      case "clinic":
        return "Klinik";
      case "medical_center":
        return "Tıp Merkezi";
      case "laboratory":
        return "Laboratuvar";
      default:
        return "Sağlık Kurumu";
    }
  };

  return (
    <Link
      href={getLocalizedUrl(`/hastane/${hospital.slug}`, locale)}
      className="group relative block h-full"
      aria-label={`${hospital.name} hastanesini görüntüle`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative flex gap-3 bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group-hover:-translate-y-1">
        <div className="w-16 h-16 min-w-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md overflow-hidden">
          <img
            src={hospital.photo}
            alt={hospital.name}
            className="object-cover w-full h-full rounded-2xl"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${hospital.name}&background=random&color=fff&size=200&format=png`;
            }}
          />
        </div>
        <div className="flex-1 flex flex-col justify-center gap-0.5">
          <h3 className="text-lg font-medium text-gray-900 group-hover:text-emerald-600 transition-colors duration-300 line-clamp-1">
            {hospital.name}
          </h3>
          {hospital.type && (
            <div className={`text-sm font-medium line-clamp-1 ${getHospitalTypeColor(hospital.type)}`}>
              {getHospitalTypeName(hospital.type)}
            </div>
          )}
          <div className="flex items-center gap-1 mt-1">
            {getStar(hospital.rating)}
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
      </div>
    </Link>
  );
}
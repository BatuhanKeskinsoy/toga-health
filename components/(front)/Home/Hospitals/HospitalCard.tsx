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

const getHospitalTypeLabel = (type: string | null) => {
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

const getHospitalTypeColor = (type: string | null) => {
  switch (type) {
    case "hospital":
      return "bg-gradient-to-r from-red-500 to-red-600 text-white";
    case "clinic":
      return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
    case "medical_center":
      return "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white";
    case "laboratory":
      return "bg-gradient-to-r from-purple-500 to-purple-600 text-white";
    default:
      return "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
  }
};

export default function HospitalCard({ hospital, locale }: HospitalCardProps) {
  return (
    <article
      className="group relative h-full"
      itemScope
      itemType="https://schema.org/MedicalOrganization"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group-hover:-translate-y-1 h-full flex flex-col min-h-[320px]">
        <div className="p-6 flex-1 flex flex-col">
          {/* Hastane Fotoğrafı */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shadow-md group-hover:scale-105 transition-transform duration-300">
              <img
                src={hospital.photo}
                alt={`${hospital.name} hastane fotoğrafı`}
                className="w-full h-full object-cover"
                itemProp="image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(hospital.name)}&background=random&color=fff&size=200&format=png`;
                }}
              />
            </div>
          </div>

          {/* Hastane Bilgileri */}
          <div className="text-center mb-4 flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2" itemProp="name">
              {hospital.name}
            </h3>
            
            {/* Tip Badge */}
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold mb-3 shadow-md ${getHospitalTypeColor(hospital.type)}`}>
              <IoBusinessOutline className="text-sm" />
              <span itemProp="medicalSpecialty">{getHospitalTypeLabel(hospital.type)}</span>
            </div>

            {/* Rating */}
            {hospital.rating && (
              <div className="flex items-center justify-center gap-1 mb-3">
                <div className="flex text-yellow-400">
                  {getStar(hospital.rating)}
                </div>
                <span className="text-sm font-semibold text-gray-700" itemProp="aggregateRating">
                  {hospital.rating.toFixed(1)}
                </span>
              </div>
            )}

            {/* Konum */}
            <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
              <IoLocationOutline className="text-sm" />
              <span className="line-clamp-1" itemProp="address">
                {hospital.location.city}, {hospital.location.country}
              </span>
            </div>
          </div>

        {/* Detay Butonu */}
        <Link
          href={getLocalizedUrl(`/hastane/${hospital.slug}`, locale)}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-center py-2.5 px-4 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 inline-block"
        >
          <span className="text-sm">Detayları Gör</span>
        </Link>
        </div>
      </div>
    </article>
  );
}

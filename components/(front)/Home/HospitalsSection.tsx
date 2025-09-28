"use client";
import React from "react";
import { HomeHospital } from "@/lib/types/pages/homeTypes";
import { IoStar, IoLocationOutline, IoBusinessOutline } from "react-icons/io5";
import { getStar } from "@/lib/functions/getStar";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import CustomButton from "@/components/others/CustomButton";
import Link from "next/link";

interface HospitalsSectionProps {
  hospitals: HomeHospital[];
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

export default function HospitalsSection({ hospitals, locale }: HospitalsSectionProps) {
  return (
    <section className="mb-16" aria-labelledby="featured-hospitals-heading">
      <div className="text-center mb-12">
        <h2 id="featured-hospitals-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Öne Çıkan Hastaneler
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          Modern sağlık tesislerimizden birini seçin
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {hospitals.slice(0, 6).map((hospital) => (
          <article
            key={hospital.id}
            className="group relative"
            itemScope
            itemType="https://schema.org/MedicalOrganization"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:-translate-y-2">
              <div className="p-6 md:p-8">
                {/* Hastane Fotoğrafı */}
                <div className="flex justify-center mb-4 md:mb-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-gray-100 shadow-lg group-hover:scale-110 transition-transform duration-300">
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
                <div className="text-center mb-4 md:mb-6">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3" itemProp="name">
                    {hospital.name}
                  </h3>
                  
                  {/* Tip Badge */}
                  <div className={`inline-flex items-center gap-2 px-3 md:px-4 py-1 md:py-2 rounded-2xl text-xs md:text-sm font-semibold mb-4 shadow-lg ${getHospitalTypeColor(hospital.type)}`}>
                    <IoBusinessOutline className="text-sm md:text-lg" />
                    <span itemProp="medicalSpecialty">{getHospitalTypeLabel(hospital.type)}</span>
                  </div>

                  {/* Rating */}
                  {hospital.rating && (
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="flex text-yellow-400">
                        {getStar(hospital.rating)}
                      </div>
                      <span className="text-sm font-semibold text-gray-700" itemProp="aggregateRating">
                        {hospital.rating.toFixed(1)}
                      </span>
                    </div>
                  )}

                  {/* Konum */}
                  <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-500">
                    <IoLocationOutline className="text-sm md:text-lg" />
                    <span itemProp="address">
                      {hospital.location.city}, {hospital.location.country}
                    </span>
                  </div>
                </div>

                {/* Detay Butonu */}
                <CustomButton
                  handleClick={() => window.location.href = getLocalizedUrl(`/hastane/${hospital.slug}`, locale)}
                  text="Detayları Gör"
                  containerStyles="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-center py-2 md:py-3 px-4 md:px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  textStyles="text-sm md:text-base"
                />
              </div>
            </div>
          </article>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <CustomButton
          handleClick={() => window.location.href = getLocalizedUrl("/hastaneler", locale)}
          text="Tüm Hastaneleri Gör"
          containerStyles="inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-6 md:px-8 py-3 md:py-4 rounded-2xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          textStyles="text-sm md:text-base"
        />
      </div>
    </section>
  );
}

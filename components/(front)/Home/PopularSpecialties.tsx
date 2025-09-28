"use client";
import React from "react";
import { PopularSpecialty } from "@/lib/types/pages/homeTypes";
import { IoMedicalOutline } from "react-icons/io5";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import CustomButton from "@/components/others/CustomButton";
import Link from "next/link";

interface PopularSpecialtiesProps {
  specialties: PopularSpecialty[];
  locale: string;
}

export default function PopularSpecialties({ specialties, locale }: PopularSpecialtiesProps) {
  return (
    <section className="mb-16" aria-labelledby="popular-specialties-heading">
      <div className="text-center mb-12">
        <h2 id="popular-specialties-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Popüler Branşlar
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          En çok tercih edilen uzmanlık alanlarından birini seçin
        </p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {specialties.slice(0, 12).map((specialty) => (
          <Link
            key={specialty.id}
            href={getLocalizedUrl(`/uzmanlik-alanlari/${specialty.slug}`, locale)}
            className="group relative"
            aria-label={`${specialty.name} branşını görüntüle`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-white rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-blue-200 group-hover:-translate-y-1">
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <IoMedicalOutline className="text-lg md:text-2xl text-white" />
                </div>
                <div className="text-xs md:text-sm font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                  {specialty.name}
                </div>
                <div className="text-xs text-gray-500 bg-gray-50 rounded-full px-2 md:px-3 py-1 inline-block">
                  {specialty.doctors_count} doktor
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <CustomButton
          handleClick={() => window.location.href = getLocalizedUrl("/uzmanlik-alanlari", locale)}
          text="Tüm Branşları Gör"
          containerStyles="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          textStyles="text-sm md:text-base"
        />
      </div>
    </section>
  );
}

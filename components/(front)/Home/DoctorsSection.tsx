"use client";
import React from "react";
import { HomeDoctor } from "@/lib/types/pages/homeTypes";
import { IoStar, IoLocationOutline, IoMedicalOutline } from "react-icons/io5";
import { getStar } from "@/lib/functions/getStar";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import CustomButton from "@/components/others/CustomButton";
import Link from "next/link";

interface DoctorsSectionProps {
  doctors: HomeDoctor[];
  locale: string;
}

export default function DoctorsSection({ doctors, locale }: DoctorsSectionProps) {
  return (
    <section className="mb-16" aria-labelledby="featured-doctors-heading">
      <div className="text-center mb-12">
        <h2 id="featured-doctors-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Öne Çıkan Doktorlar
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          Deneyimli ve uzman doktorlarımızdan randevu alın
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {doctors.slice(0, 8).map((doctor) => (
          <article
            key={doctor.id}
            className="group relative"
            itemScope
            itemType="https://schema.org/Person"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:-translate-y-2">
              <div className="p-6 md:p-8">
                {/* Doktor Fotoğrafı */}
                <div className="flex justify-center mb-4 md:mb-6">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-gray-100 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={doctor.photo}
                      alt={`${doctor.name} doktor fotoğrafı`}
                      className="w-full h-full object-cover"
                      itemProp="image"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=random&color=fff&size=200&format=png`;
                      }}
                    />
                  </div>
                </div>

                {/* Doktor Bilgileri */}
                <div className="text-center mb-4 md:mb-6">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2" itemProp="name">
                    {doctor.name}
                  </h3>
                  
                  {doctor.specialty && (
                    <div className="inline-flex items-center gap-2 text-xs md:text-sm text-blue-600 mb-3 bg-blue-50 rounded-full px-3 md:px-4 py-1 md:py-2">
                      <IoMedicalOutline className="text-sm md:text-lg" />
                      <span className="font-semibold" itemProp="jobTitle">{doctor.specialty.name}</span>
                    </div>
                  )}

                  {/* Rating */}
                  {doctor.rating && (
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="flex text-yellow-400">
                        {getStar(doctor.rating)}
                      </div>
                      <span className="text-sm font-semibold text-gray-700" itemProp="aggregateRating">
                        {doctor.rating.toFixed(1)}
                      </span>
                    </div>
                  )}

                  {/* Konum */}
                  <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-500">
                    <IoLocationOutline className="text-sm md:text-lg" />
                    <span itemProp="address">
                      {doctor.location.city}, {doctor.location.country}
                    </span>
                  </div>
                </div>

                {/* Randevu Butonu */}
                <CustomButton
                  handleClick={() => window.location.href = getLocalizedUrl(`/doktor/${doctor.slug}`, locale)}
                  text="Randevu Al"
                  containerStyles="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-center py-2 md:py-3 px-4 md:px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  textStyles="text-sm md:text-base"
                />
              </div>
            </div>
          </article>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <CustomButton
          handleClick={() => window.location.href = getLocalizedUrl("/doktorlar", locale)}
          text="Tüm Doktorları Gör"
          containerStyles="inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-6 md:px-8 py-3 md:py-4 rounded-2xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          textStyles="text-sm md:text-base"
        />
      </div>
    </section>
  );
}

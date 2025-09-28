"use client";
import React from "react";
import { HomeDoctor } from "@/lib/types/pages/homeTypes";
import { IoStar, IoLocationOutline, IoMedicalOutline } from "react-icons/io5";
import { getStar } from "@/lib/functions/getStar";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import CustomButton from "@/components/others/CustomButton";
import Link from "next/link";

interface DoctorCardProps {
  doctor: HomeDoctor;
  locale: string;
}

export default function DoctorCard({ doctor, locale }: DoctorCardProps) {
  return (
    <article
      className="group relative h-full"
      itemScope
      itemType="https://schema.org/Person"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group-hover:-translate-y-1 h-full flex flex-col min-h-[320px]">
        <div className="p-6 flex-1 flex flex-col">
          {/* Doktor Fotoğrafı */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shadow-md group-hover:scale-105 transition-transform duration-300">
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
          <div className="text-center mb-4 flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2" itemProp="name">
              {doctor.name}
            </h3>
            
            {doctor.specialty && (
              <div className="inline-flex items-center gap-1 text-xs text-blue-600 mb-3 bg-blue-50 rounded-full px-3 py-1">
                <IoMedicalOutline className="text-sm" />
                <span className="font-medium" itemProp="jobTitle">{doctor.specialty.name}</span>
              </div>
            )}

            {/* Rating */}
            {doctor.rating && (
              <div className="flex items-center justify-center gap-1 mb-3">
                <div className="flex text-yellow-400">
                  {getStar(doctor.rating)}
                </div>
                <span className="text-sm font-semibold text-gray-700" itemProp="aggregateRating">
                  {doctor.rating.toFixed(1)}
                </span>
              </div>
            )}

            {/* Konum */}
            <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
              <IoLocationOutline className="text-sm" />
              <span className="line-clamp-1" itemProp="address">
                {doctor.location.city}, {doctor.location.country}
              </span>
            </div>
          </div>

          {/* Randevu Butonu */}
          <CustomButton
            handleClick={() => window.location.href = getLocalizedUrl(`/doktor/${doctor.slug}`, locale)}
            title="Randevu Al"
            containerStyles="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-center py-2.5 px-4 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            textStyles="text-sm"
          />
        </div>
      </div>
    </article>
  );
}

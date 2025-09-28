"use client";
import React from "react";
import { PopularSpecialty } from "@/lib/types/pages/homeTypes";
import { IoMedicalOutline } from "react-icons/io5";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import Link from "next/link";

interface SpecialtyCardProps {
  specialty: PopularSpecialty;
  locale: string;
}

export default function SpecialtyCard({ specialty, locale }: SpecialtyCardProps) {
  return (
    <Link
      href={getLocalizedUrl(`/uzmanlik-alanlari/${specialty.slug}`, locale)}
      className="group relative block h-full"
      aria-label={`${specialty.name} branşını görüntüle`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group-hover:-translate-y-1 h-full flex flex-col min-h-[180px]">
        <div className="text-center flex-1 flex flex-col justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
            <IoMedicalOutline className="text-2xl text-white" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
            {specialty.name}
          </h3>
          <div className="text-xs text-gray-500 bg-gray-50 rounded-full px-3 py-1 inline-block">
            {specialty.doctors_count} doktor
          </div>
        </div>
      </div>
    </Link>
  );
}

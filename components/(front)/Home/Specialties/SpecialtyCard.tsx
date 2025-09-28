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

export default function SpecialtyCard({
  specialty,
  locale,
}: SpecialtyCardProps) {
  return (
    <Link
      href={getLocalizedUrl(`/uzmanlik-alanlari/${specialty.slug}`, locale)}
      className="group relative block h-full"
      aria-label={`${specialty.name} branşını görüntüle`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative flex gap-3 bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group-hover:-translate-y-1">
        <div className="w-16 h-16 min-w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
          <IoMedicalOutline className="text-3xl text-white" />
        </div>
        <div className="flex-1 flex flex-col justify-center gap-0.5">
          <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
            {specialty.name}
          </h3>
          <div className="text-sm font-medium">
            {specialty.doctors_count} doktor
          </div>
        </div>
      </div>
    </Link>
  );
}

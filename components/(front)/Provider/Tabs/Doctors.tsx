"use client";
import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";

import { TabComponentProps, isHospitalDetailData } from "@/lib/types/provider/providerTypes";

function Doctors({
  isHospital = false,
  providerData,
}: TabComponentProps) {
  const t = useTranslations();
  
  if (!providerData) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">{t("Yükleniyor")}</p>
        </div>
      </div>
    );
  }

  // Sadece hastane detay sayfasında doktorlar gösterilir
  if (!isHospital) {
    return null;
  }

  // API response'una göre doktorları al
  const doctors = isHospitalDetailData(providerData) ? providerData.doctors : null;

  if (!doctors || doctors.length === 0) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <h3 className="text-lg font-semibold text-gray-800">{t("Doktorlar")}</h3>
        <p className="text-gray-600 leading-relaxed">
          {t("Bu hastanede çalışan doktorlar hakkında bilgi")}
        </p>
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">{t("Henüz doktor bilgisi bulunmuyor")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-800">{t("Doktorlar")}</h3>
        <span className="bg-sitePrimary/10 text-sitePrimary text-sm font-medium px-2.5 py-0.5 rounded-full">
          {doctors.length}
        </span>
      </div>
      <p className="text-gray-600 leading-relaxed">
        {t("Bu hastanede çalışan uzman doktorlarımız")}
      </p>
      
      {/* Doktorlar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor: any, index: number) => (
          <Link
            key={doctor.id || index}
            href={`/doctor/${doctor.slug}`}
            className="group bg-white rounded-lg border border-gray-200 hover:border-sitePrimary/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="p-6">
              {/* Doktor Fotoğrafı */}
              <div className="flex justify-center mb-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                  {doctor.photo ? (
                    <Image
                      src={doctor.photo}
                      alt={doctor.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-sitePrimary/10">
                      <span className="text-sitePrimary text-2xl font-semibold">
                        {doctor.name.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Doktor Bilgileri */}
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-800 group-hover:text-sitePrimary transition-colors duration-300">
                  {doctor.name}
                </h4>
                <p className="text-sm text-sitePrimary font-medium mt-1">
                  {doctor.position}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {doctor.department}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Doctors;

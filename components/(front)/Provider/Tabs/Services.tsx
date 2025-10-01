"use client";
import React from "react";
import { useTranslations } from 'next-intl'

import { TabComponentProps, isHospitalData, isDoctorData, isHospitalDetailData, isDoctorDetailData } from "@/lib/types/provider/providerTypes";

function Services({
  isHospital = false,
  providerData,
}: TabComponentProps) {
  const t = useTranslations()
  
  if (!providerData) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">{t('Yükleniyor')}</p>
        </div>
      </div>
    );
  }

  // API response'una göre treatments'ı al
  const treatments = isHospitalDetailData(providerData) || isDoctorDetailData(providerData)
    ? providerData.treatments
    : null;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {isHospital ? t('Hastane Hizmetleri') : t('Sunulan Hizmetler')}
        </h3>
        <p className="text-gray-600">
          {isHospital
            ? "Modern tıbbi cihazlar ve uzman kadrosuyla hastanemizde sunulan kapsamlı sağlık hizmetleri. Hasta odaklı yaklaşımımız ile kaliteli ve güvenilir tedavi hizmetleri sunuyoruz."
            : "Uzman tarafından sunulan kapsamlı sağlık hizmetleri. Modern tıbbi teknoloji ve deneyimli yaklaşım ile kaliteli tedavi hizmetleri sunuyoruz."}
        </p>
      </div>

      {treatments && treatments.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {treatments.map((treatment: any, index: number) => (
            <div
              key={index}
              className="flex flex-col gap-2 bg-white border border-gray-200 p-4 rounded-lg"
            >
              <h4 className="font-medium text-sitePrimary">{treatment.treatment_name}</h4>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Fiyat:</span>
                <span className="font-medium text-green-600">
                  {treatment.price} {treatment.currency}
                </span>
              </div>
              {treatment.is_primary === 1 && (
                <span className="bg-sitePrimary/10 text-sitePrimary px-2 py-1 rounded-full text-xs w-fit">
                  Ana Hizmet
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Henüz hizmet bilgisi bulunmuyor</p>
        </div>
      )}
    </div>
  );
}

export default Services;

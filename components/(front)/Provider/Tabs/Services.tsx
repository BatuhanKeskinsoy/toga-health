"use client";
import React from "react";
import { useTranslations } from 'next-intl'

import { TabComponentProps, isHospitalData, isDoctorData } from "@/lib/types/provider/providerTypes";

function Services({
  isHospital = false,
  providerData,
}: TabComponentProps) {
  const t = useTranslations()
  
  const services = providerData && isHospitalData(providerData)
    ? providerData.active_services
    : providerData && isDoctorData(providerData)
    ? providerData.active_services
    : null;

  if (!services) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">{t('Yükleniyor')}</p>
        </div>
      </div>
    );
  }

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service: any, index: number) => (
          <div
            key={index}
            className="flex flex-col gap-2 bg-white border border-gray-200 p-4 rounded-lg"
          >
            <h4 className="font-medium text-sitePrimary">{service.title}</h4>
            <p className="text-sm text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;

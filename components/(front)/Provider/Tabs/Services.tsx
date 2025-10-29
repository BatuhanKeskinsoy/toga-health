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
        <div className="text-center p-4 bg-gray-50 rounded-md">
          <p className="text-gray-500">{t('Yükleniyor')}</p>
        </div>
      </div>
    );
  }

  // API response'una göre treatments ve diseases'ı al
  const treatments = isHospitalDetailData(providerData) || isDoctorDetailData(providerData)
    ? ('treatments' in providerData ? providerData.treatments : providerData.data?.treatments)
    : null;

  const diseases = isHospitalDetailData(providerData) || isDoctorDetailData(providerData)
    ? ('diseases' in providerData ? providerData.diseases : providerData.data?.diseases)
    : null;

  const hasTreatments = treatments && Array.isArray(treatments) && treatments.length > 0;
  const hasDiseases = diseases && Array.isArray(diseases) && diseases.length > 0;

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

      {/* Diseases Section */}
      {hasDiseases && (
        <div className="flex flex-col gap-3">
          <h4 className="text-md font-medium text-gray-700">
            {t('Tedavi Edilen Hastalıklar')}
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {diseases.map((disease: any, index: number) => (
              <div
                key={disease.id || index}
                className="flex flex-col gap-2 bg-white border border-gray-200 p-4 rounded-md"
              >
                <h4 className="font-medium text-sitePrimary">
                  {disease.name || disease.disease_name}
                </h4>
                {disease.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {disease.description}
                  </p>
                )}
                {disease.is_primary === 1 && (
                  <span className="bg-sitePrimary/10 text-sitePrimary px-2 py-1 rounded-full text-xs w-fit">
                    Ana Alan
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Treatments Section */}
      {hasTreatments && (
        <div className="flex flex-col gap-3">
          <h4 className="text-md font-medium text-gray-700">
            {t('Sunulan Tedaviler')}
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {treatments.map((treatment: any, index: number) => (
              <div
                key={treatment.id || index}
                className="flex flex-col gap-2 bg-white border border-gray-200 p-4 rounded-md"
              >
                <h4 className="font-medium text-sitePrimary">
                  {treatment.name || treatment.treatment_name}
                </h4>
                {treatment.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {treatment.description}
                  </p>
                )}
                {treatment.price && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{t('Fiyat')}:</span>
                    <span className="font-medium text-green-600">
                      {treatment.price} {treatment.currency || ''}
                    </span>
                  </div>
                )}
                {treatment.is_primary === 1 && (
                  <span className="bg-sitePrimary/10 text-sitePrimary px-2 py-1 rounded-full text-xs w-fit">
                    {t('Ana Hizmet')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!hasTreatments && !hasDiseases && (
        <div className="text-center p-8 bg-gray-50 rounded-md">
          <p className="text-gray-500">{t('Henüz hizmet bilgisi bulunmuyor')}</p>
        </div>
      )}
    </div>
  );
}

export default Services;

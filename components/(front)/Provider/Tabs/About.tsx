"use client";
import React from 'react'
import { useTranslations } from 'next-intl'

import { TabComponentProps, isHospitalData, isDoctorData, isHospitalDetailData, isDoctorDetailData } from "@/lib/types/provider/providerTypes";

function About({ isHospital = false, providerData, selectedAddress }: TabComponentProps) {
  const t = useTranslations()
  
  if (!providerData) {
    return (
      <div className='flex flex-col gap-4 w-full'>
        <div className="text-center p-4 bg-gray-50 rounded-md">
          <p className="text-gray-500">{t('Yükleniyor')}</p>
        </div>
      </div>
    );
  }

  // API response'una göre data'yı al
  const infoData = isHospitalDetailData(providerData) 
    ? ('corporate_info' in providerData ? providerData.corporate_info : providerData.data?.corporate_info)
    : isDoctorDetailData(providerData)
    ? ('doctor_info' in providerData ? providerData.doctor_info : providerData.data?.doctor_info)
    : null;

  // Description bilgisini al
  const description = infoData && 'description' in infoData
    ? infoData.description
    : null;

  // About bilgisini al
  const about = infoData && 'about' in infoData
    ? infoData.about
    : null;

  // Map location (Hospital için)
  const mapLocation = isHospitalDetailData(providerData) && infoData && 'map_location' in infoData
    ? infoData.map_location
    : null;

  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {t('Hakkında')}
        </h3>
      </div>

      {/* Description */}
      {description && (
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-md font-medium text-gray-800 mb-2">
            {t('Açıklama')}
          </h4>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {description}
          </p>
        </div>
      )}

      {/* Map Location (Hospital için) */}
      {mapLocation && (
        <div className="flex flex-col gap-2">
          <h4 className="text-md font-medium text-gray-700">
            {t('Konum')}
          </h4>
          <div 
            className="w-full h-96 rounded-md overflow-hidden border border-gray-200 *:w-full *:h-full"
            dangerouslySetInnerHTML={{ __html: mapLocation }}
          />
        </div>
      )}

      {/* Selected Address (eğer varsa) */}
      {selectedAddress && (
        <div className="flex flex-col gap-2">
          <h4 className="text-md font-medium text-gray-700">
            {t('Adres Bilgisi')}
          </h4>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm font-medium text-gray-800 mb-1">
              {selectedAddress.name}
            </p>
            <p className="text-sm text-gray-600">
              {selectedAddress.address}
            </p>
            <p className="text-sm text-gray-600">
              {selectedAddress.district}, {selectedAddress.city}, {selectedAddress.country}
            </p>
            {selectedAddress.postal_code && (
              <p className="text-sm text-gray-600">
                {t('Posta Kodu')}: {selectedAddress.postal_code}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default About; 
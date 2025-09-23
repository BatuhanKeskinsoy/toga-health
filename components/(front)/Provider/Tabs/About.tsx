"use client";
import React from 'react'
import { useTranslations } from 'next-intl'

import { TabComponentProps, isHospitalData, isDoctorData, isHospitalDetailData, isDoctorDetailData } from "@/lib/types/provider/providerTypes";

function About({ isHospital = false, providerData, selectedAddress }: TabComponentProps) {
  const t = useTranslations()
  
  if (!providerData) {
    return (
      <div className='flex flex-col gap-4 w-full'>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">{t('Yükleniyor')}</p>
        </div>
      </div>
    );
  }

  // API response'una göre data'yı al
  const data = isHospitalDetailData(providerData) 
    ? providerData.corporate_info 
    : isDoctorDetailData(providerData)
    ? providerData.doctor_info
    : null;

  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {t('Hakkında')}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {data.description}
        </p>
      </div>
      
      <div className="flex flex-col gap-4">
        {isHospital ? (
          <>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">{t('Tarihçe')}</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {data.history?.map((item: string, index: number) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">{t('Başarılar')}</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {data.achievements?.map((item: string, index: number) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">{t('Değerlerimiz')}</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {data.values?.map((item: string, index: number) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <>
            {data?.specialty && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">{t('Uzmanlık Alanı')}</h4>
                <p className="text-sm text-gray-600">{data.specialty.name}</p>
              </div>
            )}
            
            {data?.experience && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">{t('Deneyim')}</h4>
                <p className="text-sm text-gray-600">{data.experience}</p>
              </div>
            )}
            
            {data?.consultation_fee && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">{t('Konsültasyon Ücreti')}</h4>
                <p className="text-sm text-gray-600">{data.consultation_fee} TL</p>
              </div>
            )}
            
            {data?.examination_fee && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">{t('Muayene Ücreti')}</h4>
                <p className="text-sm text-gray-600">{data.examination_fee} TL</p>
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">{t('Hizmetler')}</h4>
              <div className="flex flex-wrap gap-2">
                {data?.online_consultation && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    Online Konsültasyon
                  </span>
                )}
                {data?.home_visit && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                    Evde Muayene
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {selectedAddress && (
        <div className="flex flex-col gap-3">
          <h4 className="text-md font-medium text-gray-700">{t('Konum')}</h4>
          <div className="w-full h-64 rounded-lg overflow-hidden">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(selectedAddress.address)}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="text-sm text-gray-600">{selectedAddress.address}</p>
        </div>
      )}
    </div>
  )
}

export default About 
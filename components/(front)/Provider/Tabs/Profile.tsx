"use client";
import React from 'react'
import { useTranslations } from 'next-intl'

interface ProfileProps {
  isHospital?: boolean;
  hospitalData?: any;
  specialistData?: any;
  selectedAddress?: any;
}

function Profile({ isHospital = false, hospitalData, specialistData, selectedAddress }: ProfileProps) {
  const t = useTranslations()
  const data = isHospital ? hospitalData?.profile : specialistData?.profile;

  if (!data) {
    return (
      <div className='flex flex-col gap-4 w-full'>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">{t('Yükleniyor')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {isHospital ? t('Hastane Bilgileri') : t('Profil Bilgileri')}
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600 leading-relaxed">
            {data.description}
          </p>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <h4 className="text-md font-medium text-gray-700">
          {t('Uzmanlık Alanları')}
        </h4>
        <div className="flex flex-wrap gap-2">
          {data.specialties?.map((specialty: string, index: number) => (
            <span key={index} className="bg-sitePrimary/10 text-sitePrimary px-3 py-1 rounded-full text-sm">
              {specialty}
            </span>
          ))}
        </div>
      </div>

      {isHospital && data.facilities && (
        <>
          <div className="flex flex-col gap-3">
            <h4 className="text-md font-medium text-gray-700">{t('Hastane Olanakları')}</h4>
            <div className="flex flex-wrap gap-2">
              {data.facilities.map((facility: string, index: number) => (
                <span key={index} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  {facility}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-md font-medium text-gray-700">{t('Hastane İstatistikleri')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{data.yearFounded}</div>
                <div className="text-sm text-gray-600">{t('Kuruluş Yılı')}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{data.bedCount}</div>
                <div className="text-sm text-gray-600">{t('Yatak Sayısı')}</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{data.doctorCount}</div>
                <div className="text-sm text-gray-600">{t('Uzman Sayısı')}</div>
              </div>
            </div>
          </div>
        </>
      )}

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

export default Profile 
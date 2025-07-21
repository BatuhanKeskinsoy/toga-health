"use client";
import React from 'react'
import { useTranslations } from 'next-intl'

interface AboutProps {
  isHospital?: boolean;
  hospitalData?: any;
  specialistData?: any;
  selectedAddress?: any;
}

function About({ isHospital = false, hospitalData, specialistData, selectedAddress }: AboutProps) {
  const t = useTranslations()
  const data = isHospital ? hospitalData?.about : specialistData?.about;

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
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">{t('Eğitim')}</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {data.education?.map((item: string, index: number) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">{t('Deneyim')}</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {data.experience?.map((item: string, index: number) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">{t('Branşlar')}</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {data.branches?.map((item: string, index: number) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
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
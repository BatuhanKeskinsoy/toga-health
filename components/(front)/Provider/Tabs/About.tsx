import React from 'react'

interface AboutProps {
  isHospital?: boolean;
  hospitalData?: any;
  specialistData?: any;
}

function About({ isHospital = false, hospitalData, specialistData }: AboutProps) {
  // Server-side'dan gelen veriyi kullan
  const data = isHospital ? hospitalData?.about : specialistData?.about;

  if (!data) {
    return (
      <div className='flex flex-col gap-4 w-full'>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Veri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {isHospital ? "Hastane Hakkında" : "Hakkında"}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {data.description}
        </p>
      </div>
      
      <div className="flex flex-col gap-4">
        {isHospital ? (
          <>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Tarihçe</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {data.history?.map((item: string, index: number) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Başarılar</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {data.achievements?.map((item: string, index: number) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Değerlerimiz</h4>
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
              <h4 className="font-medium text-gray-800 mb-2">Eğitim</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {data.education?.map((item: string, index: number) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Deneyim</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {data.experience?.map((item: string, index: number) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Uzmanlık Alanları</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {data.specialties?.map((item: string, index: number) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default About 
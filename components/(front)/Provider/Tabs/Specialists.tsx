import React from 'react'

interface SpecialistsProps {
  isHospital?: boolean;
  hospitalData?: any;
  specialistData?: any;
  onSpecialistSelect?: (specialist: any) => void;
}

function Specialists({ isHospital = false, hospitalData, specialistData, onSpecialistSelect }: SpecialistsProps) {
  // Sadece hastane için uzmanları göster
  if (!isHospital || !hospitalData?.specialists) {
    return (
      <div className='flex flex-col gap-4 w-full'>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Uzman bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  const handleSpecialistClick = (specialist: any) => {
    if (onSpecialistSelect) {
      onSpecialistSelect(specialist);
    }
  };

  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-gray-800">
          Hastane Uzmanları
        </h3>
        <p className="text-gray-600">
          Hastanemizde görev yapan uzman doktorlarımız. Uzman seçerek randevu alabilirsiniz.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitalData.specialists.map((specialist: any, index: number) => (
          <div 
            key={specialist.id || index} 
            className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer"
            onClick={() => handleSpecialistClick(specialist)}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                <img 
                  src={specialist.photo} 
                  alt={specialist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 text-lg">{specialist.name}</h4>
                <p className="text-sitePrimary font-medium">{specialist.specialty}</p>
                <p className="text-sm text-gray-600">{specialist.experience} deneyim</p>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {specialist.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="text-sm font-medium">{specialist.rating}</span>
              </div>
              <button 
                className="px-4 py-2 bg-sitePrimary text-white rounded-md text-sm hover:bg-sitePrimary/90 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpecialistClick(specialist);
                }}
              >
                Uzmanı Seç
              </button>
            </div>
            
            {specialist.specialties && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Uzmanlık Alanları:</p>
                <div className="flex flex-wrap gap-1">
                  {specialist.specialties.slice(0, 3).map((specialty: string, idx: number) => (
                    <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {specialty}
                    </span>
                  ))}
                  {specialist.specialties.length > 3 && (
                    <span className="text-xs text-gray-500">+{specialist.specialties.length - 3} daha</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Specialists 
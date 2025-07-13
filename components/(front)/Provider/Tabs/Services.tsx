import React from 'react'

interface ServicesProps {
  isHospital?: boolean;
  hospitalData?: any;
  specialistData?: any;
}

function Services({ isHospital = false, hospitalData, specialistData }: ServicesProps) {
  // Server-side'dan gelen veriyi kullan
  const services = isHospital ? hospitalData?.services : specialistData?.services;

  if (!services) {
    return (
      <div className='flex flex-col gap-4 w-full'>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Veri yükleniyor...</p>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Acil": "bg-red-100 text-red-700",
      "Kritik": "bg-orange-100 text-orange-700",
      "Cerrahi": "bg-blue-100 text-blue-700",
      "Tanı": "bg-green-100 text-green-700",
      "Görüntüleme": "bg-purple-100 text-purple-700",
      "Rehabilitasyon": "bg-yellow-100 text-yellow-700",
      "Muayene": "bg-indigo-100 text-indigo-700",
      "Koruyucu": "bg-teal-100 text-teal-700",
      "Takip": "bg-pink-100 text-pink-700",
      "Test": "bg-gray-100 text-gray-700",
      "Tedavi": "bg-emerald-100 text-emerald-700"
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {isHospital ? "Hastane Hizmetleri" : "Sunulan Hizmetler"}
        </h3>
        <p className="text-gray-600">
          {isHospital 
            ? "Modern tıbbi cihazlar ve uzman kadrosuyla hastanemizde sunulan kapsamlı sağlık hizmetleri. Hasta odaklı yaklaşımımız ile kaliteli ve güvenilir tedavi hizmetleri sunuyoruz."
            : "Uzman doktorumuz tarafından sunulan kapsamlı sağlık hizmetleri. Modern tıbbi teknoloji ve deneyimli yaklaşım ile kaliteli tedavi hizmetleri sunuyoruz."
          }
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service: any, index: number) => (
          <div key={index} className="bg-white border border-gray-200 p-4 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-800">{service.title}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(service.category)}`}>
                {service.category}
              </span>
            </div>
            <p className="text-sm text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Services 
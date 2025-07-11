import React from 'react'

interface ServicesProps {
  isHospital?: boolean;
}

function Services({ isHospital = false }: ServicesProps) {
  // Hastane hizmetleri
  const hospitalServices = [
    {
      title: "Acil Servis",
      description: "7/24 acil tıbbi müdahale ve tedavi hizmetleri",
      category: "Acil"
    },
    {
      title: "Yoğun Bakım Ünitesi",
      description: "Kritik hastalar için özel bakım ve tedavi",
      category: "Kritik"
    },
    {
      title: "Ameliyathane",
      description: "Modern ameliyathane ekipmanları ile cerrahi müdahaleler",
      category: "Cerrahi"
    },
    {
      title: "Laboratuvar",
      description: "Kapsamlı tıbbi test ve analiz hizmetleri",
      category: "Tanı"
    },
    {
      title: "Radyoloji Merkezi",
      description: "MR, CT, Ultrason ve X-Ray görüntüleme hizmetleri",
      category: "Görüntüleme"
    },
    {
      title: "Fizik Tedavi",
      description: "Rehabilitasyon ve fizik tedavi hizmetleri",
      category: "Rehabilitasyon"
    },
    {
      title: "Poliklinik Hizmetleri",
      description: "Tüm branşlarda poliklinik muayene hizmetleri",
      category: "Muayene"
    },
    {
      title: "Check-up Paketleri",
      description: "Kapsamlı sağlık tarama ve check-up hizmetleri",
      category: "Koruyucu"
    }
  ];

  // Doktor hizmetleri
  const doctorServices = [
    {
      title: "Kardiyoloji Muayenesi",
      description: "Detaylı kalp sağlığı kontrolü ve değerlendirmesi",
      category: "Muayene"
    },
    {
      title: "EKG Çekimi",
      description: "Kalp ritmi ve fonksiyonlarının analizi",
      category: "Tanı"
    },
    {
      title: "Holter Monitör",
      description: "24 saat kalp ritmi takibi",
      category: "Takip"
    },
    {
      title: "Efor Testi",
      description: "Egzersiz sırasında kalp performansı ölçümü",
      category: "Test"
    }
  ];

  const services = isHospital ? hospitalServices : doctorServices;

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
      "Test": "bg-gray-100 text-gray-700"
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
            : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error omnis, adipisci sit perferendis sint vero a quia expedita dolorem optio, consequuntur nulla, quaerat magni modi impedit rerum ea delectus maiores."
          }
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service, index) => (
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
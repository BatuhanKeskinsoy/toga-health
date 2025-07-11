import React from 'react'

interface AboutProps {
  isHospital?: boolean;
}

function About({ isHospital = false }: AboutProps) {
  // Hastane verileri
  const hospitalData = {
    description: "Özel Memorial Hastanesi, 2005 yılından bu yana modern tıbbi cihazlar ve uzman kadrosuyla hizmet vermektedir. Hastanemiz, hasta odaklı yaklaşımı ve kaliteli sağlık hizmetleri ile öne çıkmaktadır.",
    history: [
      "2005 - Hastane kuruluşu",
      "2010 - Yoğun bakım ünitesi açılışı",
      "2015 - Radyoloji merkezi modernizasyonu",
      "2020 - Yeni ameliyathane blokları",
      "2023 - Akıllı hastane sistemleri entegrasyonu"
    ],
    achievements: [
      "150+ yatak kapasitesi",
      "45+ uzman doktor",
      "25+ yıllık deneyim",
      "50,000+ başarılı tedavi",
      "ISO 9001 kalite belgesi",
      "JCI akreditasyonu"
    ],
    values: [
      "Hasta odaklı yaklaşım",
      "Kaliteli sağlık hizmeti",
      "Modern tıbbi teknoloji",
      "Uzman kadro",
      "7/24 hizmet",
      "Güvenilir tedavi"
    ]
  };

  // Doktor verileri
  const doctorData = {
    description: "Dr. Ahmet Yılmaz, 15 yıllık deneyimi ile ortopedi alanında uzmanlaşmış bir hekimdir. Özellikle spor yaralanmaları ve eklem cerrahisi konularında uzmanlaşmıştır.",
    education: [
      "Tıp Fakültesi - İstanbul Üniversitesi (2010-2016)",
      "Kardiyoloji Uzmanlığı - Hacettepe Üniversitesi (2016-2020)",
      "İleri Kardiyoloji Eğitimi - Mayo Clinic (2021)"
    ],
    experience: [
      "8+ yıl kardiyoloji deneyimi",
      "5000+ başarılı hasta tedavisi",
      "50+ bilimsel makale yayını",
      "Uluslararası kongrelerde sunum"
    ],
    specialties: [
      "Koroner Arter Hastalıkları",
      "Kalp Yetmezliği",
      "Ritim Bozuklukları",
      "Hipertansiyon",
      "Koroner Anjiyografi"
    ]
  };

  const data = isHospital ? hospitalData : doctorData;

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
                {data.history.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Başarılar</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {data.achievements.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Değerlerimiz</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {data.values.map((item, index) => (
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
                {data.education.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Deneyim</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {data.experience.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Uzmanlık Alanları</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {data.specialties.map((item, index) => (
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
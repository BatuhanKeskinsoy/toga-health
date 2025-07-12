import { NextResponse } from 'next/server';

// Hastane verileri
const hospitals = [
  {
    id: "hosp-001",
    slug: "memorial-hastanesi",
    name: "Memorial Hastanesi",
    type: "hospital",
    photo: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop",
    rating: 4.8,
    experience: "25 yıl",
    description: "Modern tıbbi cihazlar ve uzman kadrosu ile hizmet veren özel hastane",
    address: "Bağdat Caddesi No:123, Kadıköy/İstanbul",
    phone: "+90 216 123 45 67",
    email: "info@memorial.com",
    website: "https://www.memorial.com",
    specialties: [
      "Kardiyoloji",
      "Nöroloji", 
      "Ortopedi",
      "Onkoloji",
      "Genel Cerrahi",
      "Dahiliye"
    ],
    facilities: [
      "Acil Servis",
      "Yoğun Bakım",
      "Ameliyathane",
      "Laboratuvar",
      "Radyoloji",
      "Fizik Tedavi"
    ],
    workingHours: {
      monday: "08:00-18:00",
      tuesday: "08:00-18:00", 
      wednesday: "08:00-18:00",
      thursday: "08:00-18:00",
      friday: "08:00-18:00",
      saturday: "08:00-14:00",
      sunday: "Kapalı"
    },
    isAvailable: true,
    addresses: [
      {
        id: "addr-001",
        name: "Ana Bina",
        address: "Bağdat Caddesi No:123, Kadıköy/İstanbul",
        phone: "+90 216 123 45 67",
        isDefault: true,
        isActive: true
      },
      {
        id: "addr-002", 
        name: "Şube - Beşiktaş",
        address: "Beşiktaş Caddesi No:456, Beşiktaş/İstanbul",
        phone: "+90 212 987 65 43",
        isDefault: false,
        isActive: true
      }
    ],
    specialists: [
      {
        id: "dr-001",
        slug: "ahmet-yilmaz",
        name: "Ahmet Yılmaz",
        type: "specialist",
        specialty: "Kardiyoloji",
        photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&crop=face",
        rating: 4.2,
        experience: "15 yıl",
        description: "Kardiyoloji alanında uzman doktor",
        education: ["İstanbul Üniversitesi Tıp Fakültesi"],
        experienceList: ["Memorial Hastanesi - Başhekim (2018-2023)"],
        specialties: ["Koroner Arter Hastalığı", "Kalp Yetmezliği"],
        isAvailable: true,
        addresses: []
      },
      {
        id: "dr-002",
        slug: "fatma-demir",
        name: "Fatma Demir",
        type: "specialist",
        specialty: "Nöroloji",
        photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=120&h=120&fit=crop&crop=face",
        rating: 4.5,
        experience: "12 yıl",
        description: "Nöroloji alanında uzman doktor",
        education: ["Ankara Üniversitesi Tıp Fakültesi"],
        experienceList: ["Acıbadem Hastanesi - Nöroloji Uzmanı (2019-2023)"],
        specialties: ["Beyin Damar Hastalıkları", "Epilepsi"],
        isAvailable: true,
        addresses: []
      },
      {
        id: "dr-003",
        slug: "mehmet-kaya",
        name: "Mehmet Kaya",
        type: "specialist",
        specialty: "Ortopedi",
        photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=120&h=120&fit=crop&crop=face",
        rating: 4.3,
        experience: "18 yıl",
        description: "Ortopedi alanında uzman doktor",
        education: ["Hacettepe Üniversitesi Tıp Fakültesi"],
        experienceList: ["Memorial Hastanesi - Ortopedi Uzmanı (2015-2023)"],
        specialties: ["Eklem Cerrahisi", "Spor Yaralanmaları"],
        isAvailable: true,
        addresses: []
      }
    ]
  },
  {
    id: "hosp-002",
    slug: "acibadem-hastanesi",
    name: "Acıbadem Hastanesi",
    type: "hospital", 
    photo: "https://images.unsplash.com/photo-1519494026892-4752b94289f0?w=400&h=300&fit=crop",
    rating: 4.6,
    experience: "30 yıl",
    description: "Türkiye'nin önde gelen sağlık kuruluşlarından biri",
    address: "Atatürk Bulvarı No:789, Çankaya/Ankara",
    phone: "+90 312 456 78 90",
    email: "info@acibadem.com",
    website: "https://www.acibadem.com",
    specialties: [
      "Kardiyoloji",
      "Nöroloji",
      "Ortopedi", 
      "Onkoloji",
      "Çocuk Sağlığı",
      "Kadın Hastalıkları"
    ],
    facilities: [
      "Acil Servis",
      "Yoğun Bakım",
      "Ameliyathane",
      "Laboratuvar",
      "Radyoloji",
      "Fizik Tedavi"
    ],
    workingHours: {
      monday: "07:00-19:00",
      tuesday: "07:00-19:00",
      wednesday: "07:00-19:00", 
      thursday: "07:00-19:00",
      friday: "07:00-19:00",
      saturday: "08:00-16:00",
      sunday: "Kapalı"
    },
    isAvailable: true,
    addresses: [
      {
        id: "addr-003",
        name: "Ana Bina",
        address: "Atatürk Bulvarı No:789, Çankaya/Ankara",
        phone: "+90 312 456 78 90",
        isDefault: true,
        isActive: true
      }
    ],
    specialists: [
      {
        id: "dr-004",
        slug: "ayse-ozturk",
        name: "Ayşe Öztürk",
        type: "specialist",
        specialty: "Kardiyoloji",
        photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&crop=face",
        rating: 4.7,
        experience: "20 yıl",
        description: "Kardiyoloji alanında uzman doktor",
        education: ["Ankara Üniversitesi Tıp Fakültesi"],
        experienceList: ["Acıbadem Hastanesi - Kardiyoloji Uzmanı (2010-2023)"],
        specialties: ["Koroner Arter Hastalığı", "Kalp Yetmezliği", "Ritim Bozuklukları"],
        isAvailable: true,
        addresses: []
      },
      {
        id: "dr-005",
        slug: "ali-yildiz",
        name: "Ali Yıldız",
        type: "specialist",
        specialty: "Nöroloji",
        photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=120&h=120&fit=crop&crop=face",
        rating: 4.4,
        experience: "14 yıl",
        description: "Nöroloji alanında uzman doktor",
        education: ["Gazi Üniversitesi Tıp Fakültesi"],
        experienceList: ["Acıbadem Hastanesi - Nöroloji Uzmanı (2012-2023)"],
        specialties: ["Beyin Damar Hastalıkları", "Epilepsi", "Baş Ağrısı"],
        isAvailable: true,
        addresses: []
      }
    ]
  }
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Simüle edilmiş gecikme
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const hospital = hospitals.find(h => h.slug === slug);
    
    if (!hospital) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Hastane bulunamadı" 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: hospital
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Hastane verisi yüklenirken hata oluştu" 
      },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';

// Türkçe karakterleri normalize eden fonksiyon
const normalizeSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

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
    location: "Türkiye / İstanbul / Kadıköy",
    reviewCount: 156,
    email: "info@memorial.com",
    website: "https://www.memorial.com",
    branches: [
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
        isDefault: true,
        isActive: true
      },
      {
        id: "addr-002", 
        name: "Şube - Beşiktaş",
        address: "Beşiktaş Caddesi No:456, Beşiktaş/İstanbul",
        isDefault: false,
        isActive: true
      }
    ],
    // Tab verileri
    about: {
      description: "Memorial Hastanesi, 25 yıllık deneyimi ile Türkiye'nin önde gelen sağlık kuruluşlarından biridir. Modern tıbbi cihazlar ve uzman kadrosu ile hizmet vermektedir.",
      facilities: [
        "Acil Servis",
        "Yoğun Bakım",
        "Ameliyathane",
        "Laboratuvar",
        "Radyoloji",
        "Fizik Tedavi"
      ],
      branches: [
        "Kardiyoloji",
        "Nöroloji", 
        "Ortopedi",
        "Onkoloji",
        "Genel Cerrahi",
        "Dahiliye"
      ]
    },
    profile: {
      description: "Memorial Hastanesi, 25 yıllık deneyimi ile Türkiye'nin önde gelen sağlık kuruluşlarından biridir.",
      branches: ["Genel Hastane", "Özel Hastane", "Çok Disiplinli"]
    },
    services: [
      {
        title: "Acil Servis",
        description: "7/24 acil sağlık hizmeti",
      },
      {
        title: "Yoğun Bakım",
        description: "Kritik hasta bakımı",
      },
      {
        title: "Ameliyathane",
        description: "Modern ameliyathane üniteleri",
      },
      {
        title: "Laboratuvar",
        description: "Gelişmiş laboratuvar hizmetleri",
      }
    ],
    gallery: [
      {
        id: "gallery-001",
        title: "Hastane Dış Görünüm",
        image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop",
        description: "Memorial Hastanesi dış görünüm"
      },
      {
        id: "gallery-002",
        title: "Acil Servis",
        image: "https://images.unsplash.com/photo-1519494026892-4752b94289f0?w=400&h=300&fit=crop",
        description: "Modern acil servis ünitesi"
      },
      {
        id: "gallery-003",
        title: "Ameliyathane",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
        description: "Modern ameliyathane"
      }
    ],
    comments: [
      {
        id: "comment-001",
        author: "Ali K.",
        rating: 5,
        date: "2024-01-12",
        comment: "Çok profesyonel bir hastane, herkese tavsiye ederim."
      },
      {
        id: "comment-002",
        author: "Zeynep Y.",
        rating: 4,
        date: "2024-01-08",
        comment: "Doktorlar çok deneyimli ve ilgiliydi."
      },
      {
        id: "comment-003",
        author: "Mustafa D.",
        rating: 5,
        date: "2024-01-05",
        comment: "Temiz ve modern tesisler, kaliteli hizmet."
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
    location: "Türkiye / Ankara / Çankaya",
    reviewCount: 234,
    email: "info@acibadem.com",
    website: "https://www.acibadem.com",
    branches: [
      "Kardiyoloji",
      "Nöroloji",
      "Ortopedi", 
      "Onkoloji",
      "Genel Cerrahi",
      "Dahiliye",
      "Kadın Hastalıkları",
      "Çocuk Sağlığı"
    ],
    facilities: [
      "Acil Servis",
      "Yoğun Bakım",
      "Ameliyathane",
      "Laboratuvar",
      "Radyoloji",
      "Fizik Tedavi",
      "Kadın Doğum",
      "Çocuk Kliniği"
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
        id: "addr-003",
        name: "Ana Bina",
        address: "Atatürk Bulvarı No:789, Çankaya/Ankara",
        isDefault: true,
        isActive: true
      }
    ],
    // Tab verileri
    about: {
      description: "Acıbadem Hastanesi, 30 yıllık deneyimi ile Türkiye'nin önde gelen sağlık kuruluşlarından biridir. Çok disiplinli yaklaşım ile hizmet vermektedir.",
      facilities: [
        "Acil Servis",
        "Yoğun Bakım",
        "Ameliyathane",
        "Laboratuvar",
        "Radyoloji",
        "Fizik Tedavi",
        "Kadın Doğum",
        "Çocuk Kliniği"
      ],
      branches: [
        "Kardiyoloji",
        "Nöroloji",
        "Ortopedi", 
        "Onkoloji",
        "Genel Cerrahi",
        "Dahiliye",
        "Kadın Hastalıkları",
        "Çocuk Sağlığı"
      ]
    },
    profile: {
      description: "Acıbadem Hastanesi, 30 yıllık deneyimi ile Türkiye'nin önde gelen sağlık kuruluşlarından biridir.",
      branches: ["Genel Hastane", "Özel Hastane", "Çok Disiplinli"]
    },
    services: [
      {
        title: "Acil Servis",
        description: "7/24 acil sağlık hizmeti",
      },
      {
        title: "Yoğun Bakım",
        description: "Kritik hasta bakımı",
      },
      {
        title: "Ameliyathane",
        description: "Modern ameliyathane üniteleri",
      },
      {
        title: "Laboratuvar",
        description: "Gelişmiş laboratuvar hizmetleri",
      }
    ],
    gallery: [
      {
        id: "gallery-004",
        title: "Hastane Dış Görünüm",
        image: "https://images.unsplash.com/photo-1519494026892-4752b94289f0?w=400&h=300&fit=crop",
        description: "Acıbadem Hastanesi dış görünüm"
      },
      {
        id: "gallery-005",
        title: "Acil Servis",
        image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop",
        description: "Modern acil servis ünitesi"
      },
      {
        id: "gallery-006",
        title: "Ameliyathane",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
        description: "Modern ameliyathane"
      }
    ],
    comments: [
      {
        id: "comment-004",
        author: "Ali K.",
        rating: 5,
        date: "2024-01-12",
        comment: "Çok profesyonel bir hastane, herkese tavsiye ederim."
      },
      {
        id: "comment-005",
        author: "Zeynep Y.",
        rating: 4,
        date: "2024-01-08",
        comment: "Doktorlar çok deneyimli ve ilgiliydi."
      },
      {
        id: "comment-006",
        author: "Mustafa D.",
        rating: 5,
        date: "2024-01-05",
        comment: "Temiz ve modern tesisler, kaliteli hizmet."
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
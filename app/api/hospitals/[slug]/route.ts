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
    location: "Türkiye / İstanbul / Kadıköy",
    reviewCount: 156,
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
    ],
    // Tab verileri
    about: {
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
    },
    profile: {
      description: "Özel Memorial Hastanesi, modern tıbbi cihazlar ve uzman kadrosuyla 2005 yılından bu yana hizmet vermektedir. Hastanemiz, hasta odaklı yaklaşımı ve kaliteli sağlık hizmetleri ile öne çıkmaktadır.",
      specialties: ["Kardiyoloji", "Nöroloji", "Onkoloji", "Ortopedi", "Dermatoloji", "Göz Hastalıkları", "Kadın Hastalıkları", "Çocuk Sağlığı"],
      facilities: ["7/24 Acil Servis", "Yoğun Bakım Ünitesi", "Ameliyathane", "Laboratuvar", "Radyoloji Merkezi", "Fizik Tedavi Merkezi"],
      yearFounded: "2005",
      bedCount: "150",
      doctorCount: "45"
    },
    services: [
      {
        title: "Acil Servis",
        description: "7/24 acil tıbbi müdahale ve tedavi hizmetleri",
      },
      {
        title: "Yoğun Bakım Ünitesi",
        description: "Kritik hastalar için özel bakım ve tedavi",
      },
      {
        title: "Ameliyathane",
        description: "Modern ameliyathane ekipmanları ile cerrahi müdahaleler",
      },
      {
        title: "Laboratuvar",
        description: "Kapsamlı tıbbi test ve analiz hizmetleri",
      },
      {
        title: "Radyoloji Merkezi",
        description: "MR, CT, Ultrason ve X-Ray görüntüleme hizmetleri",
      },
      {
        title: "Fizik Tedavi",
        description: "Rehabilitasyon ve fizik tedavi hizmetleri",
      },
      {
        title: "Poliklinik Hizmetleri",
        description: "Tüm branşlarda poliklinik muayene hizmetleri",
      },
      {
        title: "Check-up Paketleri",
        description: "Kapsamlı sağlık tarama ve check-up hizmetleri",
      }
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&h=1200&fit=crop&crop=center",
        alt: "Hastane Dış Görünüm"
      },
      {
        src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=1200&fit=crop&crop=center",
        alt: "Acil Servis"
      },
      {
        src: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&h=1200&fit=crop&crop=center",
        alt: "Ameliyathane"
      },
      {
        src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=1200&fit=crop&crop=center",
        alt: "Yoğun Bakım Ünitesi"
      },
      {
        src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=1200&fit=crop&crop=center",
        alt: "Laboratuvar"
      },
      {
        src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=1200&fit=crop&crop=center",
        alt: "Radyoloji Merkezi"
      },
      {
        src: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&h=1200&fit=crop&crop=center",
        alt: "Fizik Tedavi Merkezi"
      },
      {
        src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=1200&fit=crop&crop=center",
        alt: "Poliklinik"
      }
    ],
    videos: [
      {
        url: "https://www.youtube.com/watch?v=05z5ciHMmcA",
        title: "Hastane Tanıtım Videosu"
      },
      {
        url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
        title: "Modern Tıbbi Cihazlar"
      }
    ],
    comments: [
      {
        id: "comment-001",
        author: "Ayşe K.",
        rating: 5,
        date: "2024-01-15",
        comment: "Çok memnun kaldım, doktorlar çok ilgiliydi."
      },
      {
        id: "comment-002",
        author: "Mehmet Y.",
        rating: 4,
        date: "2024-01-10",
        comment: "Temiz ve modern bir hastane, tavsiye ederim."
      },
      {
        id: "comment-003",
        author: "Fatma D.",
        rating: 5,
        date: "2024-01-08",
        comment: "Personel çok nazik ve profesyoneldi."
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
    ],
    // Tab verileri
    about: {
      description: "Acıbadem Hastanesi, 1990 yılından bu yana Türkiye'nin önde gelen sağlık kuruluşlarından biri olarak hizmet vermektedir. Modern tıbbi teknoloji ve uzman kadrosuyla kaliteli sağlık hizmetleri sunmaktayız.",
      history: [
        "1990 - Hastane kuruluşu",
        "2000 - İlk JCI akreditasyonu",
        "2010 - Yeni teknoloji merkezi açılışı",
        "2015 - Organ nakli merkezi",
        "2020 - Robotik cerrahi sistemi",
        "2023 - Yapay zeka destekli tanı sistemi"
      ],
      achievements: [
        "200+ yatak kapasitesi",
        "60+ uzman doktor",
        "30+ yıllık deneyim",
        "100,000+ başarılı tedavi",
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
    },
    profile: {
      description: "Acıbadem Hastanesi, modern tıbbi cihazlar ve uzman kadrosuyla 1990 yılından bu yana hizmet vermektedir. Hastanemiz, hasta odaklı yaklaşımı ve kaliteli sağlık hizmetleri ile öne çıkmaktadır.",
      specialties: ["Kardiyoloji", "Nöroloji", "Onkoloji", "Ortopedi", "Dermatoloji", "Göz Hastalıkları", "Kadın Hastalıkları", "Çocuk Sağlığı"],
      facilities: ["7/24 Acil Servis", "Yoğun Bakım Ünitesi", "Ameliyathane", "Laboratuvar", "Radyoloji Merkezi", "Fizik Tedavi Merkezi"],
      yearFounded: "1990",
      bedCount: "200",
      doctorCount: "60"
    },
    services: [
      {
        title: "Acil Servis",
        description: "7/24 acil tıbbi müdahale ve tedavi hizmetleri",
      },
      {
        title: "Yoğun Bakım Ünitesi",
        description: "Kritik hastalar için özel bakım ve tedavi",
      },
      {
        title: "Ameliyathane",
        description: "Modern ameliyathane ekipmanları ile cerrahi müdahaleler",
      },
      {
        title: "Laboratuvar",
        description: "Kapsamlı tıbbi test ve analiz hizmetleri",
      },
      {
        title: "Radyoloji Merkezi",
        description: "MR, CT, Ultrason ve X-Ray görüntüleme hizmetleri",
        },
      {
        title: "Fizik Tedavi",
        description: "Rehabilitasyon ve fizik tedavi hizmetleri",
      },
      {
        title: "Poliklinik Hizmetleri",
        description: "Tüm branşlarda poliklinik muayene hizmetleri",
      },
      {
        title: "Check-up Paketleri",
        description: "Kapsamlı sağlık tarama ve check-up hizmetleri",
      }
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&h=1200&fit=crop&crop=center",
        alt: "Hastane Dış Görünüm"
      },
      {
        src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=1200&fit=crop&crop=center",
        alt: "Acil Servis"
      },
      {
        src: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&h=1200&fit=crop&crop=center",
        alt: "Ameliyathane"
      },
      {
        src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=1200&fit=crop&crop=center",
        alt: "Yoğun Bakım Ünitesi"
      },
      {
        src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=1200&fit=crop&crop=center",
        alt: "Laboratuvar"
      },
      {
        src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=1200&fit=crop&crop=center",
        alt: "Radyoloji Merkezi"
      },
      {
        src: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&h=1200&fit=crop&crop=center",
        alt: "Fizik Tedavi Merkezi"
      },
      {
        src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=1200&fit=crop&crop=center",
        alt: "Poliklinik"
      }
    ],
    videos: [
      {
        url: "https://www.youtube.com/watch?v=05z5ciHMmcA",
        title: "Hastane Tanıtım Videosu"
      },
      {
        url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
        title: "Modern Tıbbi Cihazlar"
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
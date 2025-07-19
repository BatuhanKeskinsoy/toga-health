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

// Specialist (doktor) verileri
const specialists = [
  {
    id: "dr-001",
    slug: "ahmet-yilmaz",
    name: "Ahmet Yılmaz",
    type: "specialist",
    specialty: "Kardiyoloji",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&h=1200&fit=crop&crop=face",
    rating: 4.2,
    experience: "15 yıl",
    location: "Türkiye / İstanbul / Kadıköy",
    hospital: "Memorial Hastanesi",
    reviewCount: 34,
    description: "Kardiyoloji alanında uzman doktor, kalp hastalıkları konusunda deneyimli",
    education: [
      "İstanbul Üniversitesi Tıp Fakültesi",
      "Kardiyoloji Uzmanlığı - Hacettepe Üniversitesi",
      "İleri Kardiyoloji Eğitimi - Mayo Clinic"
    ],
    experienceList: [
      "Memorial Hastanesi - Başhekim (2018-2023)",
      "Acıbadem Hastanesi - Kardiyoloji Uzmanı (2015-2018)",
      "Hacettepe Üniversitesi - Araştırma Görevlisi (2010-2015)"
    ],
    specialties: [
      "Koroner Arter Hastalığı",
      "Kalp Yetmezliği",
      "Hipertansiyon",
      "Ritim Bozuklukları",
      "Kardiyak Girişimsel İşlemler"
    ],
    isAvailable: true,
    addresses: [
      {
        id: "addr-004",
        name: "Ana Muayenehane",
        address: "Bağdat Caddesi No:123, Kadıköy/İstanbul",
        isDefault: true,
        isActive: true
      },
      {
        id: "addr-005",
        name: "Şube - Beşiktaş",
        address: "Beşiktaş Caddesi No:456, Beşiktaş/İstanbul", 
        isDefault: false,
        isActive: true
      }
    ],
    // Tab verileri
    about: {
      description: "Dr. Ahmet Yılmaz, 15 yıllık deneyimi ile kardiyoloji alanında uzmanlaşmış bir hekimdir. Kalp hastalıkları konusunda deneyimlidir.",
      education: [
        "Tıp Fakültesi - İstanbul Üniversitesi (2006-2012)",
        "Kardiyoloji Uzmanlığı - Hacettepe Üniversitesi (2012-2016)",
        "İleri Kardiyoloji Eğitimi - Mayo Clinic (2017)"
      ],
      experience: [
        "15+ yıl kardiyoloji deneyimi",
        "5000+ başarılı işlem",
        "150+ bilimsel makale yayını",
        "Uluslararası kongrelerde sunum"
      ],
      specialties: [
        "Koroner Arter Hastalığı",
        "Kalp Yetmezliği",
        "Hipertansiyon",
        "Ritim Bozuklukları",
        "Kardiyak Girişimsel İşlemler"
      ]
    },
    profile: {
      description: "Dr. Ahmet Yılmaz, 15 yıllık deneyimi ile kardiyoloji alanında uzmanlaşmış bir hekimdir. Kalp hastalıkları konusunda deneyimlidir.",
      specialties: ["Kardiyoloji", "Girişimsel Kardiyoloji", "Ekokardiyografi"]
    },
    services: [
      {
        title: "Kardiyoloji Muayenesi",
        description: "Detaylı kardiyolojik muayene ve değerlendirme",
      },
      {
        title: "EKG",
        description: "Elektrokardiyografi testi",
      },
      {
        title: "Efor Testi",
        description: "Kardiyak stres testi",
      },
      {
        title: "Ekokardiyografi",
        description: "Kalp ultrasonu",
      }
    ],
    gallery: [
      {
        id: "gallery-001",
        title: "Muayene Odası",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
        description: "Modern muayene odası"
      },
      {
        id: "gallery-002",
        title: "EKG Cihazı",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
        description: "Profesyonel EKG cihazı"
      },
      {
        id: "gallery-003",
        title: "Ekokardiyografi",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop",
        description: "Ekokardiyografi cihazı"
      }
    ],
    comments: [
      {
        id: "comment-001",
        author: "Mehmet K.",
        rating: 5,
        date: "2024-01-15",
        comment: "Çok profesyonel bir doktor, tedavim çok başarılı geçti."
      },
      {
        id: "comment-002",
        author: "Ayşe Y.",
        rating: 5,
        date: "2024-01-12",
        comment: "Doktor çok deneyimli ve ilgiliydi, herkese tavsiye ederim."
      },
      {
        id: "comment-003",
        author: "Ali D.",
        rating: 4,
        date: "2024-01-10",
        comment: "Muayene süreci çok detaylıydı, teşekkürler."
      }
    ]
  },
  {
    id: "dr-002",
    slug: "fatma-demir",
    name: "Fatma Demir",
    type: "specialist",
    specialty: "Nöroloji",
    photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=1200&h=1200&fit=crop&crop=face",
    rating: 4.5,
    experience: "12 yıl",
    location: "Türkiye / Ankara / Çankaya",
    hospital: "Acıbadem Hastanesi",
    reviewCount: 28,
    description: "Nöroloji alanında uzman doktor, beyin ve sinir sistemi hastalıkları konusunda deneyimli",
    education: [
      "Ankara Üniversitesi Tıp Fakültesi",
      "Nöroloji Uzmanlığı - Hacettepe Üniversitesi",
      "İleri Nöroloji Eğitimi - Johns Hopkins"
    ],
    experienceList: [
      "Acıbadem Hastanesi - Nöroloji Uzmanı (2018-2023)",
      "Hacettepe Üniversitesi - Araştırma Görevlisi (2015-2018)",
      "Ankara Üniversitesi - Asistan (2012-2015)"
    ],
    specialties: [
      "Beyin Damar Hastalıkları",
      "Epilepsi",
      "Multiple Skleroz",
      "Parkinson Hastalığı",
      "Baş Ağrıları"
    ],
    isAvailable: true,
    addresses: [
      {
        id: "addr-006",
        name: "Ana Muayenehane",
        address: "Atatürk Bulvarı No:789, Çankaya/Ankara",
        isDefault: true,
        isActive: true
      }
    ],
    // Tab verileri
    about: {
      description: "Dr. Fatma Demir, 12 yıllık deneyimi ile nöroloji alanında uzmanlaşmış bir hekimdir. Beyin ve sinir sistemi hastalıkları konusunda deneyimlidir.",
      education: [
        "Tıp Fakültesi - Ankara Üniversitesi (2008-2014)",
        "Nöroloji Uzmanlığı - Hacettepe Üniversitesi (2014-2018)",
        "İleri Nöroloji Eğitimi - Johns Hopkins (2019)"
      ],
      experience: [
        "12+ yıl nöroloji deneyimi",
        "3000+ başarılı tedavi",
        "80+ bilimsel makale yayını",
        "Uluslararası kongrelerde sunum"
      ],
      specialties: [
        "Beyin Damar Hastalıkları",
        "Epilepsi",
        "Multiple Skleroz",
        "Parkinson Hastalığı",
        "Baş Ağrıları"
      ]
    },
    profile: {
      description: "Dr. Fatma Demir, 12 yıllık deneyimi ile nöroloji alanında uzmanlaşmış bir hekimdir. Beyin ve sinir sistemi hastalıkları konusunda deneyimlidir.",
      specialties: ["Nöroloji", "Epilepsi", "Beyin Damar Hastalıkları"]
    },
    services: [
      {
        title: "Nöroloji Muayenesi",
        description: "Detaylı nörolojik muayene ve değerlendirme",
      },
      {
        title: "EEG",
        description: "Elektroensefalografi testi",
      },
      {
        title: "EMG",
        description: "Elektromiyografi testi",
      },
      {
        title: "Beyin MR",
        description: "Beyin manyetik rezonans görüntüleme",
      }
    ],
    gallery: [
      {
        id: "gallery-004",
        title: "Nöroloji Muayene Odası",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
        description: "Modern nöroloji muayene odası"
      },
      {
        id: "gallery-005",
        title: "EEG Cihazı",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
        description: "Profesyonel EEG cihazı"
      }
    ],
    comments: [
      {
        id: "comment-004",
        author: "Zeynep K.",
        rating: 5,
        date: "2024-01-14",
        comment: "Doktor çok deneyimli ve sabırlıydı."
      },
      {
        id: "comment-005",
        author: "Can Y.",
        rating: 4,
        date: "2024-01-11",
        comment: "Tedavim çok başarılı geçti, teşekkürler."
      },
      {
        id: "comment-006",
        author: "Deniz D.",
        rating: 5,
        date: "2024-01-08",
        comment: "Çok profesyonel bir yaklaşım."
      }
    ]
  },
  {
    id: "dr-003",
    slug: "mehmet-kaya",
    name: "Mehmet Kaya",
    type: "specialist",
    specialty: "Ortopedi",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=1200&h=1200&fit=crop&crop=face",
    rating: 4.3,
    experience: "18 yıl",
    location: "Türkiye / İzmir / Konak",
    hospital: "Medical Park Hastanesi",
    reviewCount: 42,
    description: "Ortopedi alanında uzman doktor, kemik ve eklem hastalıkları konusunda deneyimli",
    education: [
      "İzmir Üniversitesi Tıp Fakültesi",
      "Ortopedi Uzmanlığı - Dokuz Eylül Üniversitesi",
      "Spor Ortopedisi Eğitimi - Harvard Medical School"
    ],
    experienceList: [
      "Medical Park Hastanesi - Ortopedi Uzmanı (2018-2023)",
      "Dokuz Eylül Üniversitesi - Araştırma Görevlisi (2015-2018)",
      "İzmir Üniversitesi - Asistan (2010-2015)"
    ],
    specialties: [
      "Eklem Cerrahisi",
      "Spor Yaralanmaları",
      "Omurga Cerrahisi",
      "Artroskopi",
      "Protez Cerrahisi"
    ],
    isAvailable: true,
    addresses: [
      {
        id: "addr-007",
        name: "Ana Muayenehane",
        address: "Alsancak Mahallesi No:456, Konak/İzmir",
        isDefault: true,
        isActive: true
      }
    ],
    // Tab verileri
    about: {
      description: "Dr. Mehmet Kaya, 18 yıllık deneyimi ile ortopedi alanında uzmanlaşmış bir hekimdir. Kemik ve eklem hastalıkları konusunda deneyimlidir.",
      education: [
        "Tıp Fakültesi - İzmir Üniversitesi (2008-2014)",
        "Ortopedi Uzmanlığı - Dokuz Eylül Üniversitesi (2014-2018)",
        "Spor Ortopedisi Eğitimi - Harvard Medical School (2019)"
      ],
      experience: [
        "18+ yıl ortopedi deneyimi",
        "8000+ başarılı ameliyat",
        "100+ bilimsel makale yayını",
        "Uluslararası kongrelerde sunum"
      ],
      specialties: [
        "Eklem Cerrahisi",
        "Spor Yaralanmaları",
        "Omurga Cerrahisi",
        "Artroskopi",
        "Protez Cerrahisi"
      ]
    },
    profile: {
      description: "Dr. Mehmet Kaya, 18 yıllık deneyimi ile ortopedi alanında uzmanlaşmış bir hekimdir. Kemik ve eklem hastalıkları konusunda deneyimlidir.",
      specialties: ["Ortopedi", "Spor Hekimliği", "Fizik Tedavi"]
    },
    services: [
      {
        title: "Ortopedi Muayenesi",
        description: "Detaylı ortopedik muayene ve değerlendirme",
      },
      {
        title: "Artroskopi",
        description: "Kapalı eklem cerrahisi",
      },
      {
        title: "Protez Cerrahisi",
        description: "Eklem protezi ameliyatları",
      },
      {
        title: "Spor Yaralanmaları",
        description: "Sporcu yaralanmalarının tedavisi",
      }
    ],
    gallery: [
      {
        id: "gallery-006",
        title: "Ortopedi Muayene Odası",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
        description: "Modern ortopedi muayene odası"
      },
      {
        id: "gallery-007",
        title: "Artroskopi Cihazı",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
        description: "Artroskopi cihazı"
      }
    ],
    comments: [
      {
        id: "comment-007",
        author: "Selin K.",
        rating: 5,
        date: "2024-01-16",
        comment: "Tedavim çok başarılı geçti, doktor çok profesyoneldi."
      },
      {
        id: "comment-008",
        author: "Can Y.",
        rating: 4,
        date: "2024-01-13",
        comment: "Ameliyat sonrası süreç çok iyi yönetildi."
      },
      {
        id: "comment-009",
        author: "Deniz D.",
        rating: 5,
        date: "2024-01-10",
        comment: "Doktor çok deneyimli ve ilgiliydi."
      }
    ]
  },
  {
    id: "dr-004",
    slug: "ayse-ozkan",
    name: "Ayşe Özkan",
    type: "specialist",
    specialty: "Onkoloji",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&h=1200&fit=crop&crop=face",
    rating: 4.7,
    experience: "20 yıl",
    location: "Türkiye / Bursa / Nilüfer",
    hospital: "Özel Bursa Hastanesi",
    reviewCount: 38,
    description: "Onkoloji alanında uzman doktor, kanser tedavisi konusunda deneyimli",
    education: [
      "Hacettepe Üniversitesi Tıp Fakültesi",
      "Onkoloji Uzmanlığı - Ankara Üniversitesi",
      "İleri Onkoloji Eğitimi - MD Anderson Cancer Center"
    ],
    experienceList: [
      "Özel Bursa Hastanesi - Onkoloji Uzmanı (2018-2023)",
      "Ankara Üniversitesi - Araştırma Görevlisi (2015-2018)",
      "Hacettepe Üniversitesi - Asistan (2010-2015)"
    ],
    specialties: [
      "Meme Kanseri",
      "Akciğer Kanseri",
      "Kolorektal Kanser",
      "Lenfoma",
      "Kemoterapi"
    ],
    isAvailable: true,
    addresses: [
      {
        id: "addr-008",
        name: "Ana Muayenehane",
        address: "Nilüfer Caddesi No:789, Nilüfer/Bursa",
        isDefault: true,
        isActive: true
      }
    ],
    // Tab verileri
    about: {
      description: "Dr. Ayşe Özkan, 20 yıllık deneyimi ile onkoloji alanında uzmanlaşmış bir hekimdir. Kanser tedavisi konusunda deneyimlidir.",
      education: [
        "Tıp Fakültesi - Hacettepe Üniversitesi (2006-2012)",
        "Onkoloji Uzmanlığı - Ankara Üniversitesi (2012-2016)",
        "İleri Onkoloji Eğitimi - MD Anderson Cancer Center (2017)"
      ],
      experience: [
        "20+ yıl onkoloji deneyimi",
        "10000+ başarılı tedavi",
        "200+ bilimsel makale yayını",
        "Uluslararası kongrelerde sunum"
      ],
      specialties: [
        "Meme Kanseri",
        "Akciğer Kanseri",
        "Kolorektal Kanser",
        "Lenfoma",
        "Kemoterapi"
      ]
    },
    profile: {
      description: "Dr. Ayşe Özkan, 20 yıllık deneyimi ile onkoloji alanında uzmanlaşmış bir hekimdir. Kanser tedavisi konusunda deneyimlidir.",
      specialties: ["Onkoloji", "Radyasyon Onkolojisi", "Hematoloji"]
    },
    services: [
      {
        title: "Onkoloji Muayenesi",
        description: "Detaylı onkolojik muayene ve değerlendirme",
      },
      {
        title: "Kemoterapi",
        description: "Kanser tedavisi için kemoterapi",
      },
      {
        title: "Radyoterapi",
        description: "Işın tedavisi",
      },
      {
        title: "Biyopsi",
        description: "Doku örneği alma işlemi",
      }
    ],
    gallery: [
      {
        id: "gallery-008",
        title: "Onkoloji Muayene Odası",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
        description: "Modern onkoloji muayene odası"
      },
      {
        id: "gallery-009",
        title: "Kemoterapi Ünitesi",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
        description: "Kemoterapi ünitesi"
      }
    ],
    comments: [
      {
        id: "comment-010",
        author: "Selin K.",
        rating: 5,
        date: "2024-01-16",
        comment: "Tedavim çok başarılı geçti, doktor çok profesyoneldi."
      },
      {
        id: "comment-011",
        author: "Can Y.",
        rating: 5,
        date: "2024-01-14",
        comment: "Kemoterapi sürecim çok iyi yönetildi."
      },
      {
        id: "comment-012",
        author: "Deniz D.",
        rating: 4,
        date: "2024-01-12",
        comment: "Doktor çok deneyimli ve ilgiliydi."
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
    
    const specialist = specialists.find(s => s.slug === slug);
    
    if (!specialist) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Uzman bulunamadı" 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: specialist
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Uzman verisi yüklenirken hata oluştu" 
      },
      { status: 500 }
    );
  }
} 
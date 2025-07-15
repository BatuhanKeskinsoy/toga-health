import { NextResponse } from 'next/server';

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
    },
    profile: {
      description: "Dr. Ahmet Yılmaz, 15 yıllık deneyimi ile ortopedi alanında uzmanlaşmış bir hekimdir. Özellikle spor yaralanmaları ve eklem cerrahisi konularında uzmanlaşmıştır.",
      specialties: ["Kardiyoloji", "İç Hastalıkları", "Acil Tıp"]
    },
    services: [
      {
        title: "Kardiyoloji Muayenesi",
        description: "Detaylı kalp sağlığı kontrolü ve değerlendirmesi",
      },
      {
        title: "EKG Çekimi",
        description: "Kalp ritmi ve fonksiyonlarının analizi",
      },
      {
        title: "Holter Monitör",
        description: "24 saat kalp ritmi takibi",
      },
      {
        title: "Efor Testi",
        description: "Egzersiz sırasında kalp performansı ölçümü",
      }
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      },
      {
        src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      },
      {
        src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      },
      {
        src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      },
      {
        src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      },
      {
        src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      },
      {
        src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      },
      {
        src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      }
    ],
    videos: [
      {
        url: "https://www.youtube.com/watch?v=05z5ciHMmcA",
        title: "Sağlıklı Yaşam İçin Öneriler"
      },
      {
        url: "https://www.youtube.com/watch?v=fbelrTRlls8",
        title: "Düzenli Egzersizin Faydaları"
      }
    ],
    comments: [
      {
        id: "comment-007",
        author: "Mehmet K.",
        rating: 5,
        date: "2024-01-14",
        comment: "Çok deneyimli bir doktor, herkese tavsiye ederim."
      },
      {
        id: "comment-008",
        author: "Ayşe Y.",
        rating: 4,
        date: "2024-01-12",
        comment: "Uzman çok ilgili ve profesyoneldi."
      },
      {
        id: "comment-009",
        author: "Ali D.",
        rating: 5,
        date: "2024-01-10",
        comment: "Tedavi sürecim çok başarılı geçti."
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
      "Nöroloji Uzmanlığı - İstanbul Üniversitesi",
      "İleri Nöroloji Eğitimi - Johns Hopkins"
    ],
    experienceList: [
      "Acıbadem Hastanesi - Nöroloji Uzmanı (2019-2023)",
      "Hacettepe Üniversitesi - Nöroloji Uzmanı (2015-2019)",
      "Ankara Üniversitesi - Araştırma Görevlisi (2010-2015)"
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
        "Tıp Fakültesi - Ankara Üniversitesi (2010-2016)",
        "Nöroloji Uzmanlığı - İstanbul Üniversitesi (2016-2020)",
        "İleri Nöroloji Eğitimi - Johns Hopkins (2021)"
      ],
      experience: [
        "12+ yıl nöroloji deneyimi",
        "3000+ başarılı hasta tedavisi",
        "30+ bilimsel makale yayını",
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
      specialties: ["Nöroloji", "Beyin Cerrahisi", "Psikiyatri"]
    },
    services: [
      {
        title: "Nöroloji Muayenesi",
        description: "Detaylı nörolojik muayene ve değerlendirme",
      },
      {
        title: "EEG Çekimi",
        description: "Beyin dalgalarının analizi",
      },
      {
        title: "EMG Testi",
        description: "Sinir ve kas fonksiyonlarının ölçümü",
      },
      {
        title: "Baş Ağrısı Tedavisi",
        description: "Migren ve diğer baş ağrılarının tedavisi",
      }
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      },
      {
        src: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      },
      {
        src: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      },
      {
        src: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      },
      {
        src: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      },
      {
        src: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      },
      {
        src: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      },
      {
        src: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      }
    ],
    videos: [
      {
        url: "https://www.youtube.com/watch?v=05z5ciHMmcA",
        title: "Beyin Sağlığı İçin Öneriler"
      },
      {
        url: "https://www.youtube.com/watch?v=fbelrTRlls8",
        title: "Migren Tedavisi"
      }
    ],
    comments: [
      {
        id: "comment-010",
        author: "Zeynep K.",
        rating: 5,
        date: "2024-01-13",
        comment: "Çok profesyonel bir uzman, tedavim başarılı oldu."
      },
      {
        id: "comment-011",
        author: "Mustafa Y.",
        rating: 4,
        date: "2024-01-11",
        comment: "Uzman çok deneyimli ve ilgiliydi."
      },
      {
        id: "comment-012",
        author: "Fatma D.",
        rating: 5,
        date: "2024-01-09",
        comment: "Migren sorunum çözüldü, çok teşekkürler."
      }
    ]
  },
  {
    id: "dr-003",
    slug: "mehmet-kaya",
    name: "Mehmet Kaya",
    type: "specialist",
    specialty: "Ortopedi",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&h=1200&fit=crop&crop=face",
    rating: 4.1,
    experience: "18 yıl",
    location: "Türkiye / İzmir / Konak",
    hospital: "Memorial Hastanesi",
    reviewCount: 42,
    description: "Ortopedi alanında uzman doktor, kemik ve eklem hastalıkları konusunda deneyimli",
    education: [
      "İzmir Üniversitesi Tıp Fakültesi",
      "Ortopedi Uzmanlığı - Dokuz Eylül Üniversitesi",
      "Spor Ortopedisi Eğitimi - Harvard Medical School"
    ],
    experienceList: [
      "Memorial Hastanesi - Ortopedi Uzmanı (2020-2023)",
      "Dokuz Eylül Üniversitesi - Ortopedi Uzmanı (2016-2020)",
      "İzmir Üniversitesi - Araştırma Görevlisi (2012-2016)"
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
        address: "Alsancak Mahallesi No:321, Konak/İzmir",
        phone: "+90 232 789 12 34",
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
        src: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      },
      {
        src: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      },
      {
        src: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      },
      {
        src: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      },
      {
        src: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      },
      {
        src: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      },
      {
        src: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      },
      {
        src: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      }
    ],
    videos: [
      {
        url: "https://www.youtube.com/watch?v=05z5ciHMmcA",
        title: "Spor Yaralanmaları ve Tedavisi"
      },
      {
        url: "https://www.youtube.com/watch?v=fbelrTRlls8",
        title: "Eklem Sağlığı İçin Öneriler"
      }
    ],
    comments: [
      {
        id: "comment-013",
        author: "Ahmet K.",
        rating: 5,
        date: "2024-01-15",
        comment: "Ameliyatım çok başarılı geçti, uzman çok deneyimli."
      },
      {
        id: "comment-014",
        author: "Elif Y.",
        rating: 4,
        date: "2024-01-13",
        comment: "Spor yaralanmamın tedavisi mükemmel oldu."
      },
      {
        id: "comment-015",
        author: "Burak D.",
        rating: 5,
        date: "2024-01-11",
        comment: "Protez ameliyatımdan sonra çok rahatım."
      }
    ]
  },
  {
    id: "dr-004",
    slug: "ayse-ozkan",
    name: "Ayşe Özkan",
    type: "specialist",
    specialty: "Onkoloji",
    photo: "https://images.unsplash.com/photo-1551601651-bc60f254d532?w=1200&h=1200&fit=crop&crop=face",
    rating: 4.7,
    experience: "20 yıl",
    location: "Türkiye / Ankara / Çankaya",
    hospital: "Acıbadem Hastanesi",
    reviewCount: 56,
    description: "Onkoloji alanında uzman doktor, kanser tedavisi konusunda deneyimli",
    education: [
      "Hacettepe Üniversitesi Tıp Fakültesi",
      "Onkoloji Uzmanlığı - Ankara Üniversitesi",
      "İleri Onkoloji Eğitimi - MD Anderson Cancer Center"
    ],
    experienceList: [
      "Acıbadem Hastanesi - Onkoloji Uzmanı (2018-2023)",
      "Ankara Üniversitesi - Onkoloji Uzmanı (2014-2018)",
      "Hacettepe Üniversitesi - Araştırma Görevlisi (2010-2014)"
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
        address: "Atatürk Bulvarı No:789, Çankaya/Ankara",
        phone: "+90 312 456 78 90",
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
        src: "https://images.unsplash.com/photo-1551601651-bc60f254d532?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      },
      {
        src: "https://images.unsplash.com/photo-1551601651-bc60f254d532?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      },
      {
        src: "https://images.unsplash.com/photo-1551601651-bc60f254d532?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      },
      {
        src: "https://images.unsplash.com/photo-1551601651-bc60f254d532?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      },
      {
        src: "https://images.unsplash.com/photo-1551601651-bc60f254d532?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      },
      {
        src: "https://images.unsplash.com/photo-1551601651-bc60f254d532?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      },
      {
        src: "https://images.unsplash.com/photo-1551601651-bc60f254d532?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      },
      {
        src: "https://images.unsplash.com/photo-1551601651-bc60f254d532?w=1200&h=1200&fit=crop&crop=face",
        alt: "Uzman Muayene"
      }
    ],
    videos: [
      {
        url: "https://www.youtube.com/watch?v=05z5ciHMmcA",
        title: "Kanser Tedavisi Hakkında"
      },
      {
        url: "https://www.youtube.com/watch?v=fbelrTRlls8",
        title: "Erken Tanının Önemi"
      }
    ],
    comments: [
      {
        id: "comment-016",
        author: "Selin K.",
        rating: 5,
        date: "2024-01-16",
        comment: "Tedavim çok başarılı geçti, doktor çok profesyoneldi."
      },
      {
        id: "comment-017",
        author: "Can Y.",
        rating: 5,
        date: "2024-01-14",
        comment: "Kemoterapi sürecim çok iyi yönetildi."
      },
      {
        id: "comment-018",
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
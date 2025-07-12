import { NextResponse } from 'next/server';

// Specialist (doktor) verileri
const specialists = [
  {
    id: "dr-001",
    slug: "ahmet-yilmaz",
    name: "Ahmet Yılmaz",
    type: "specialist",
    specialty: "Kardiyoloji",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&crop=face",
    rating: 4.2,
    experience: "15 yıl",
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
        phone: "+90 216 123 45 67",
        isDefault: true,
        isActive: true
      },
      {
        id: "addr-005",
        name: "Şube - Beşiktaş",
        address: "Beşiktaş Caddesi No:456, Beşiktaş/İstanbul", 
        phone: "+90 212 987 65 43",
        isDefault: false,
        isActive: true
      }
    ]
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
        phone: "+90 312 456 78 90",
        isDefault: true,
        isActive: true
      }
    ]
  },
  {
    id: "dr-003",
    slug: "mehmet-kaya",
    name: "Mehmet Kaya",
    type: "specialist",
    specialty: "Ortopedi",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=120&h=120&fit=crop&crop=face",
    rating: 4.1,
    experience: "18 yıl",
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
    ]
  },
  {
    id: "dr-004",
    slug: "ayse-ozkan",
    name: "Ayşe Özkan",
    type: "specialist",
    specialty: "Onkoloji",
    photo: "https://images.unsplash.com/photo-1551601651-bc60f254d532?w=120&h=120&fit=crop&crop=face",
    rating: 4.7,
    experience: "20 yıl",
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
    ]
  }
];

export async function GET() {
  try {
    // Simüle edilmiş gecikme
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return NextResponse.json({
      success: true,
      data: specialists
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Doktor verileri yüklenirken hata oluştu" 
      },
      { status: 500 }
    );
  }
} 
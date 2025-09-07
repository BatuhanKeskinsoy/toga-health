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

const specialists = [
  {
    id: 1,
    slug: "ahmet-yilmaz",
    name: "Ahmet Yılmaz",
    type: "specialist",
    branch: "Kardiyoloji",
    branchSlug: "kardiyoloji",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&crop=face",
    rating: 4.2,
    experience: "15 yıl",
    description: "Kardiyoloji alanında uzman doktor, kalp hastalıkları konusunda deneyimli",
    city: "İstanbul",
    country: "Türkiye",
    countryId: 1,
    cityId: 34,
    hastaliklar: [
      "Koroner Arter Hastalığı",
      "Kalp Yetmezliği",
      "Hipertansiyon",
      "Ritim Bozuklukları",
      "Kalp Krizi"
    ],
    tedaviHizmetler: [
      "Kardiyak Girişimsel İşlemler",
      "EKG",
      "Efor Testi",
      "Ekokardiyografi",
      "Holter Monitör"
    ]
  },
  {
    id: 2,
    slug: "fatma-demir",
    name: "Fatma Demir",
    type: "specialist",
    branch: "Nöroloji",
    branchSlug: "noroloji",
    photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=120&h=120&fit=crop&crop=face",
    rating: 4.5,
    experience: "12 yıl",
    description: "Nöroloji alanında uzman doktor, beyin ve sinir sistemi hastalıkları konusunda deneyimli",
    city: "Ankara",
    country: "Türkiye",
    countryId: 1,
    cityId: 6,
    hastaliklar: [
      "Beyin Damar Hastalıkları",
      "Epilepsi",
      "Multiple Skleroz",
      "Parkinson Hastalığı",
      "Baş Ağrıları"
    ],
    tedaviHizmetler: [
      "EEG",
      "EMG",
      "Beyin MR",
      "Nörolojik Muayene",
      "Sinir Sistemi Testleri"
    ]
  },
  {
    id: 3,
    slug: "mehmet-kaya",
    name: "Mehmet Kaya",
    type: "specialist",
    branch: "Ortopedi",
    branchSlug: "ortopedi",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&h=120&fit=crop&crop=face",
    rating: 4.3,
    experience: "18 yıl",
    description: "Ortopedi alanında uzman doktor, kemik ve eklem hastalıkları konusunda deneyimli",
    city: "İzmir",
    country: "Türkiye",
    countryId: 1,
    cityId: 35,
    hastaliklar: [
      "Eklem Hastalıkları",
      "Kırık ve Çıkıklar",
      "Spor Yaralanmaları",
      "Omurga Hastalıkları",
      "Artrit"
    ],
    tedaviHizmetler: [
      "Artroskopi",
      "Protez Cerrahisi",
      "Fizik Tedavi",
      "Spor Hekimliği",
      "Omurga Cerrahisi"
    ]
  },
  {
    id: 4,
    slug: "ayse-ozkan",
    name: "Ayşe Özkan",
    type: "specialist",
    branch: "Onkoloji",
    branchSlug: "onkoloji",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&crop=face",
    rating: 4.7,
    experience: "20 yıl",
    description: "Onkoloji alanında uzman doktor, kanser tedavisi konusunda deneyimli",
    city: "Bursa",
    country: "Türkiye",
    countryId: 1,
    cityId: 16,
    hastaliklar: [
      "Meme Kanseri",
      "Akciğer Kanseri",
      "Kolorektal Kanser",
      "Lenfoma",
      "Lösemi"
    ],
    tedaviHizmetler: [
      "Kemoterapi",
      "Radyoterapi",
      "Hedefli Tedavi",
      "İmmünoterapi",
      "Palyatif Bakım"
    ]
  },
  {
    id: 5,
    slug: "ali-celik",
    name: "Ali Çelik",
    type: "specialist",
    branch: "Dahiliye",
    branchSlug: "dahiliye",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&h=120&fit=crop&crop=face",
    rating: 4.3,
    experience: "14 yıl",
    description: "Dahiliye alanında uzman doktor, genel hastalıklar konusunda deneyimli",
    city: "Eskişehir",
    country: "Türkiye",
    countryId: 1,
    cityId: 26,
    hastaliklar: ["Diyabet", "Hipertansiyon", "Tiroit Hastalıkları", "Böbrek Hastalıkları"],
    tedaviHizmetler: ["Genel Muayene", "Kan Testleri", "İlaç Tedavisi", "Beslenme Danışmanlığı"]
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
        error: "Uzman verileri yüklenirken hata oluştu" 
      },
      { status: 500 }
    );
  }
} 
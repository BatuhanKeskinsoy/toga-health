import { NextResponse } from 'next/server';

const specialists = [
  {
    id: "dr-001",
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
    id: "dr-002",
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
    id: "dr-003",
    slug: "mehmet-kaya",
    name: "Mehmet Kaya",
    type: "specialist",
    branch: "Ortopedi",
    branchSlug: "ortopedi",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=120&h=120&fit=crop&crop=face",
    rating: 4.1,
    experience: "18 yıl",
    description: "Ortopedi alanında uzman doktor, kemik ve eklem hastalıkları konusunda deneyimli",
    city: "İzmir",
    country: "Türkiye",
    countryId: 1,
    cityId: 35,
    hastaliklar: [
      "Eklem Ağrıları",
      "Spor Yaralanmaları",
      "Omurga Hastalıkları",
      "Kırık ve Çıkıklar",
      "Artrit"
    ],
    tedaviHizmetler: [
      "Eklem Cerrahisi",
      "Artroskopi",
      "Protez Cerrahisi",
      "Omurga Cerrahisi",
      "Fizik Tedavi"
    ]
  },
  {
    id: "dr-004",
    slug: "ayse-ozkan",
    name: "Ayşe Özkan",
    type: "specialist",
    branch: "Onkoloji",
    branchSlug: "onkoloji",
    photo: "https://images.unsplash.com/photo-1551601651-bc60f254d532?w=120&h=120&fit=crop&crop=face",
    rating: 4.7,
    experience: "20 yıl",
    description: "Onkoloji alanında uzman doktor, kanser tedavisi konusunda deneyimli",
    city: "İstanbul",
    country: "Türkiye",
    countryId: 1,
    cityId: 34,
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
      "İmmünoterapi",
      "Hedefli Tedavi",
      "Kemik İliği Nakli"
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
        error: "Uzman verileri yüklenirken hata oluştu" 
      },
      { status: 500 }
    );
  }
} 
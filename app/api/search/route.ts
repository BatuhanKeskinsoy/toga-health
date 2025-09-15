import { NextRequest, NextResponse } from "next/server";

interface SearchResult {
  id: number;
  name: string;
  type: "specialist" | "hospital" | "hastalik" | "tedavi";
  branch?: string;
  branchSlug?: string;
  category?: string;
  description?: string;
  photo?: string;
  rating?: number;
  experience?: string;
  address?: string;
  phone?: string;
  slug?: string;
}

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

// HASTALIKLAR: Service'ten çekilecek şekilde import
import { getDiseases } from "@/lib/services/categories/diseases";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const countryId = searchParams.get("countryId");
    const cityId = searchParams.get("cityId");
    const districtId = searchParams.get("districtId");

    // Query boşsa popüler branşları döndür
    if (!query || query.trim() === "") {
      const popularBranches = [
        { name: "Kardiyoloji", slug: "kardiyoloji", description: "Kalp ve damar hastalıkları" },
        { name: "Nöroloji", slug: "noroloji", description: "Beyin ve sinir sistemi hastalıkları" },
        { name: "Ortopedi", slug: "ortopedi", description: "Kemik ve eklem hastalıkları" },
        { name: "Onkoloji", slug: "onkoloji", description: "Kanser tedavisi" },
        { name: "Dahiliye", slug: "dahiliye", description: "Genel hastalıklar" },
        { name: "Kadın Hastalıkları", slug: "kadin-hastaliklari", description: "Kadın sağlığı" },
        { name: "Çocuk Sağlığı", slug: "cocuk-sagligi", description: "Çocuk hastalıkları" },
        { name: "Dermatoloji", slug: "dermatoloji", description: "Cilt hastalıkları" },
        { name: "Göz Hastalıkları", slug: "goz-hastaliklari", description: "Göz sağlığı" },
        { name: "Kulak Burun Boğaz", slug: "kulak-burun-bogaz", description: "KBB hastalıkları" }
      ];

      return NextResponse.json({
        success: true,
        data: {
          query: "",
          countryId,
          cityId,
          districtId,
          results: {
            specialists: [],
            hospitals: [],
            hastaliklar: [],
            tedaviHizmetler: [],
            popularBranches
          },
          totalCount: popularBranches.length
        }
      });
    }

    if (query.length < 2) {
      return NextResponse.json({ 
        success: false, 
        message: "En az 2 karakter gerekli" 
      }, { status: 400 });
    }

    if (!countryId || !cityId) {
      return NextResponse.json({ 
        success: false, 
        message: "Ülke ve şehir seçimi gerekli" 
      }, { status: 400 });
    }

    // Hastalıklar listesi
    const diseasesList = await getDiseases();
    const hastaliklar = diseasesList.map(disease => disease.name);

    // Tedavi ve hizmetler listesi
    const tedaviHizmetler = [
      "Kemoterapi",
      "Radyoterapi",
      "Fizik Tedavi",
      "Psikoterapi",
      "Akupunktur",
      "Masaj Terapisi",
      "Yoga Terapisi",
      "Beslenme Danışmanlığı",
      "Spor Hekimliği",
      "Estetik Cerrahi",
      "Plastik Cerrahi",
      "Lazer Tedavisi",
      "Botoks",
      "Dolgu",
      "Cilt Bakımı",
      "Saç Ekimi",
      "Diş Tedavisi",
      "Ortodonti",
      "Göz Lazer",
      "İşitme Cihazı"
    ];

    // Gerçek veriler - 50 Uzman (örnek)
    const specialists = [
      {
        id: 1,
        name: "Ahmet Yılmaz",
        type: "specialist" as const,
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
        districtId: 15, // Kadıköy
        district: "Kadıköy",
        slug: "ahmet-yilmaz",
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
        name: "Fatma Demir",
        type: "specialist" as const,
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
        districtId: 1, // Çankaya
        district: "Çankaya",
        slug: "fatma-demir",
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
        name: "Mehmet Kaya",
        type: "specialist" as const,
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
        districtId: 3, // Konak
        district: "Konak",
        slug: "mehmet-kaya",
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
        name: "Ayşe Özkan",
        type: "specialist" as const,
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
        districtId: 4, // Nilüfer
        district: "Nilüfer",
        slug: "ayse-ozkan",
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
        name: "Ali Çelik",
        type: "specialist" as const,
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
        districtId: 2, // Odunpazarı
        district: "Odunpazarı",
        slug: "ali-celik",
        hastaliklar: ["Diyabet", "Hipertansiyon", "Tiroit Hastalıkları", "Böbrek Hastalıkları"],
        tedaviHizmetler: ["Genel Muayene", "Kan Testleri", "İlaç Tedavisi", "Beslenme Danışmanlığı"]
      }
    ];

    const hospitals = [
      {
        id: 1,
        name: "Memorial Hastanesi",
        type: "hospital" as const,
        category: "Hastane",
        photo: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop",
        rating: 4.8,
        experience: "25 yıl",
        description: "Modern tıbbi cihazlar ve uzman kadrosu ile hizmet veren özel hastane",
        address: "Bağdat Caddesi No:123, Kadıköy/İstanbul",
        phone: "+90 216 123 45 67",
        slug: "memorial-hastanesi"
      },
      {
        id: 2,
        name: "Acıbadem Hastanesi",
        type: "hospital" as const,
        category: "Hastane",
        photo: "https://images.unsplash.com/photo-1519494026892-4752b94289f0?w=400&h=300&fit=crop",
        rating: 4.6,
        experience: "30 yıl",
        description: "Türkiye'nin önde gelen sağlık kuruluşlarından biri",
        address: "Atatürk Bulvarı No:789, Çankaya/Ankara",
        phone: "+90 312 456 78 90",
        slug: "acibadem-hastanesi"
      }
    ];

    // Query'ye göre filtreleme
    const queryLower = query.toLowerCase();
    const searchResults: SearchResult[] = [];
    
    // Kelime bazlı arama fonksiyonu
    const matchesSearch = (text: string, query: string): boolean => {
      const textLower = text.toLowerCase();
      const queryLower = query.toLowerCase();
      
      // Basit substring arama - daha esnek
      return textLower.includes(queryLower);
    };

    // Location filtresi - seçilen ülke ve şehre göre filtrele
    // GEÇİCİ: Location filtresini kaldırıyoruz test için
    const filteredSpecialists = specialists;
    
    // Orijinal kod (test için kapalı):
    // const filteredSpecialists = specialists.filter(specialist => {
    //   const countryMatch = specialist.countryId === parseInt(countryId);
    //   const cityMatch = specialist.cityId === parseInt(cityId);
    //   
    //   // İlçe filtresi varsa uygula
    //   if (districtId) {
    //     return countryMatch && cityMatch && specialist.districtId === parseInt(districtId);
    //   }
    //   
    //   return countryMatch && cityMatch;
    // });
    
    // Uzmanları filtrele
    filteredSpecialists.forEach(specialist => {
      if (
        matchesSearch(specialist.name, queryLower) ||
        matchesSearch(specialist.branch, queryLower) ||
        specialist.hastaliklar.some(h => matchesSearch(h, queryLower)) ||
        specialist.tedaviHizmetler.some(t => matchesSearch(t, queryLower))
      ) {
        searchResults.push({
          ...specialist,
          slug: specialist.slug
        });
      }
    });

    // Hastaneleri filtrele
    hospitals.forEach(hospital => {
      if (
        matchesSearch(hospital.name, queryLower) ||
        matchesSearch(hospital.category, queryLower)
      ) {
        searchResults.push(hospital);
      }
    });

    // Hastalıkları filtrele
    hastaliklar.forEach(hastalik => {
      if (matchesSearch(hastalik, queryLower)) {
        searchResults.push({
          id: 0,
          name: hastalik,
          type: "hastalik" as const,
          category: "Hastalık",
          slug: normalizeSlug(hastalik)
        });
      }
    });

    // Tedavi ve hizmetleri filtrele
    tedaviHizmetler.forEach(tedavi => {
      if (matchesSearch(tedavi, queryLower)) {
        searchResults.push({
          id: 0,
          name: tedavi,
          type: "tedavi" as const,
          category: "Tedavi ve Hizmet",
          slug: normalizeSlug(tedavi)
        });
      }
    });

    // Kategorilere göre gruplama
    const groupedResults = {
      specialists: searchResults.filter(result => result.type === "specialist"),
      hospitals: searchResults.filter(result => result.type === "hospital"),
      hastaliklar: searchResults.filter(result => result.type === "hastalik"),
      tedaviHizmetler: searchResults.filter(result => result.type === "tedavi")
    };


    return NextResponse.json({
      success: true,
      data: {
        query,
        countryId,
        cityId,
        districtId,
        results: groupedResults,
        totalCount: searchResults.length
      }
    });

  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Arama sırasında hata oluştu" 
    }, { status: 500 });
  }
} 
import { NextRequest, NextResponse } from "next/server";

interface SearchResult {
  id: string;
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
    const hastaliklar = [
      "Kalp Krizi",
      "Hipertansiyon",
      "Diyabet",
      "Astım",
      "Migren",
      "Depresyon",
      "Anksiyete",
      "Kanser",
      "Artrit",
      "Epilepsi",
      "Parkinson Hastalığı",
      "Multiple Skleroz",
      "Alzheimer",
      "Osteoporoz",
      "Tiroit Hastalıkları",
      "Böbrek Hastalıkları",
      "Karaciğer Hastalıkları",
      "Akciğer Hastalıkları",
      "Sindirim Sistemi Hastalıkları",
      "Cilt Hastalıkları"
    ];

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
        id: "dr-001",
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
        id: "dr-002",
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
        districtId: 67, // Çankaya
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
        id: "dr-003",
        name: "Mehmet Kaya",
        type: "specialist" as const,
        branch: "Ortopedi",
        branchSlug: "ortopedi",
        photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=120&h=120&fit=crop&crop=face",
        rating: 4.1,
        experience: "18 yıl",
        description: "Ortopedi alanında uzman doktor, kemik ve eklem hastalıkları konusunda deneyimli",
        city: "Eskişehir",
        country: "Türkiye",
        countryId: 1,
        cityId: 26,
        districtId: 1, // Tepebaşı
        district: "Tepebaşı",
        slug: "mehmet-kaya",
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
        name: "Ayşe Özkan",
        type: "specialist" as const,
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
        districtId: 16, // Beşiktaş
        district: "Beşiktaş",
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
          "İmmünoterapi",
          "Hedefli Tedavi",
          "Kemik İliği Nakli"
        ]
      },
      {
        id: "dr-005",
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
        id: "hosp-001",
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
        id: "hosp-002",
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
    const filteredSpecialists = specialists.filter(specialist => {
      const countryMatch = specialist.countryId === parseInt(countryId);
      const cityMatch = specialist.cityId === parseInt(cityId);
      
      // İlçe filtresi varsa uygula
      if (districtId) {
        return countryMatch && cityMatch && specialist.districtId === parseInt(districtId);
      }
      
      return countryMatch && cityMatch;
    });
    
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
          id: `hastalik-${hastalik.toLowerCase().replace(/\s+/g, '-')}`,
          name: hastalik,
          type: "hastalik" as const,
          category: "Hastalık",
          slug: hastalik.toLowerCase().replace(/\s+/g, '-')
        });
      }
    });

    // Tedavi ve hizmetleri filtrele
    tedaviHizmetler.forEach(tedavi => {
      if (matchesSearch(tedavi, queryLower)) {
        searchResults.push({
          id: `tedavi-${tedavi.toLowerCase().replace(/\s+/g, '-')}`,
          name: tedavi,
          type: "tedavi" as const,
          category: "Tedavi ve Hizmet",
          slug: tedavi.toLowerCase().replace(/\s+/g, '-')
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
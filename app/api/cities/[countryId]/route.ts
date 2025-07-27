import { NextRequest, NextResponse } from "next/server";

// Örnek şehir verileri - gerçek uygulamada veritabanından gelecek
const citiesByCountry = {
  "turkiye": [ // Türkiye - Tüm 81 şehir
    { id: 1, name: "Adana", slug: "adana", countrySlug: "turkiye" },
    { id: 2, name: "Adıyaman", slug: "adiyaman", countrySlug: "turkiye" },
    { id: 3, name: "Afyonkarahisar", slug: "afyonkarahisar", countrySlug: "turkiye" },
    { id: 4, name: "Ağrı", slug: "agri", countrySlug: "turkiye" },
    { id: 5, name: "Amasya", slug: "amasya", countrySlug: "turkiye" },
    { id: 6, name: "Ankara", slug: "ankara", countrySlug: "turkiye" },
    { id: 7, name: "Antalya", slug: "antalya", countrySlug: "turkiye" },
    { id: 8, name: "Artvin", slug: "artvin", countrySlug: "turkiye" },
    { id: 9, name: "Aydın", slug: "aydin", countrySlug: "turkiye" },
    { id: 10, name: "Balıkesir", slug: "balikesir", countrySlug: "turkiye" },
    { id: 11, name: "Bilecik", slug: "bilecik", countrySlug: "turkiye" },
    { id: 12, name: "Bingöl", slug: "bingol", countrySlug: "turkiye" },
    { id: 13, name: "Bitlis", slug: "bitlis", countrySlug: "turkiye" },
    { id: 14, name: "Bolu", slug: "bolu", countrySlug: "turkiye" },
    { id: 15, name: "Burdur", slug: "burdur", countrySlug: "turkiye" },
    { id: 16, name: "Bursa", slug: "bursa", countrySlug: "turkiye" },
    { id: 17, name: "Çanakkale", slug: "canakkale", countrySlug: "turkiye" },
    { id: 18, name: "Çankırı", slug: "cankiri", countrySlug: "turkiye" },
    { id: 19, name: "Çorum", slug: "corum", countrySlug: "turkiye" },
    { id: 20, name: "Denizli", slug: "denizli", countrySlug: "turkiye" },
    { id: 21, name: "Diyarbakır", slug: "diyarbakir", countrySlug: "turkiye" },
    { id: 22, name: "Edirne", slug: "edirne", countrySlug: "turkiye" },
    { id: 23, name: "Elazığ", slug: "elazig", countrySlug: "turkiye" },
    { id: 24, name: "Erzincan", slug: "erzincan", countrySlug: "turkiye" },
    { id: 25, name: "Erzurum", slug: "erzurum", countrySlug: "turkiye" },
    { id: 26, name: "Eskişehir", slug: "eskisehir", countrySlug: "turkiye" },
    { id: 27, name: "Gaziantep", slug: "gaziantep", countrySlug: "turkiye" },
    { id: 28, name: "Giresun", slug: "giresun", countrySlug: "turkiye" },
    { id: 29, name: "Gümüşhane", slug: "gumushane", countrySlug: "turkiye" },
    { id: 30, name: "Hakkari", slug: "hakkari", countrySlug: "turkiye" },
    { id: 31, name: "Hatay", slug: "hatay", countrySlug: "turkiye" },
    { id: 32, name: "Isparta", slug: "isparta", countrySlug: "turkiye" },
    { id: 33, name: "Mersin", slug: "mersin", countrySlug: "turkiye" },
    { id: 34, name: "İstanbul", slug: "istanbul", countrySlug: "turkiye" },
    { id: 35, name: "İzmir", slug: "izmir", countrySlug: "turkiye" },
    { id: 36, name: "Kars", slug: "kars", countrySlug: "turkiye" },
    { id: 37, name: "Kastamonu", slug: "kastamonu", countrySlug: "turkiye" },
    { id: 38, name: "Kayseri", slug: "kayseri", countrySlug: "turkiye" },
    { id: 39, name: "Kırklareli", slug: "kirklareli", countrySlug: "turkiye" },
    { id: 40, name: "Kırşehir", slug: "kirsehir", countrySlug: "turkiye" },
    { id: 41, name: "Kocaeli", slug: "kocaeli", countrySlug: "turkiye" },
    { id: 42, name: "Konya", slug: "konya", countrySlug: "turkiye" },
    { id: 43, name: "Kütahya", slug: "kutahya", countrySlug: "turkiye" },
    { id: 44, name: "Malatya", slug: "malatya", countrySlug: "turkiye" },
    { id: 45, name: "Manisa", slug: "manisa", countrySlug: "turkiye" },
    { id: 46, name: "Kahramanmaraş", slug: "kahramanmaras", countrySlug: "turkiye" },
    { id: 47, name: "Mardin", slug: "mardin", countrySlug: "turkiye" },
    { id: 48, name: "Muğla", slug: "mugla", countrySlug: "turkiye" },
    { id: 49, name: "Muş", slug: "mus", countrySlug: "turkiye" },
    { id: 50, name: "Nevşehir", slug: "nevsehir", countrySlug: "turkiye" },
    { id: 51, name: "Niğde", slug: "nigde", countrySlug: "turkiye" },
    { id: 52, name: "Ordu", slug: "ordu", countrySlug: "turkiye" },
    { id: 53, name: "Rize", slug: "rize", countrySlug: "turkiye" },
    { id: 54, name: "Sakarya", slug: "sakarya", countrySlug: "turkiye" },
    { id: 55, name: "Samsun", slug: "samsun", countrySlug: "turkiye" },
    { id: 56, name: "Siirt", slug: "siirt", countrySlug: "turkiye" },
    { id: 57, name: "Sinop", slug: "sinop", countrySlug: "turkiye" },
    { id: 58, name: "Sivas", slug: "sivas", countrySlug: "turkiye" },
    { id: 59, name: "Tekirdağ", slug: "tekirdag", countrySlug: "turkiye" },
    { id: 60, name: "Tokat", slug: "tokat", countrySlug: "turkiye" },
    { id: 61, name: "Trabzon", slug: "trabzon", countrySlug: "turkiye" },
    { id: 62, name: "Tunceli", slug: "tunceli", countrySlug: "turkiye" },
    { id: 63, name: "Şanlıurfa", slug: "sanliurfa", countrySlug: "turkiye" },
    { id: 64, name: "Uşak", slug: "usak", countrySlug: "turkiye" },
    { id: 65, name: "Van", slug: "van", countrySlug: "turkiye" },
    { id: 66, name: "Yozgat", slug: "yozgat", countrySlug: "turkiye" },
    { id: 67, name: "Zonguldak", slug: "zonguldak", countrySlug: "turkiye" },
    { id: 68, name: "Aksaray", slug: "aksaray", countrySlug: "turkiye" },
    { id: 69, name: "Bayburt", slug: "bayburt", countrySlug: "turkiye" },
    { id: 70, name: "Karaman", slug: "karaman", countrySlug: "turkiye" },
    { id: 71, name: "Kırıkkale", slug: "kirikkale", countrySlug: "turkiye" },
    { id: 72, name: "Batman", slug: "batman", countrySlug: "turkiye" },
    { id: 73, name: "Şırnak", slug: "sirnak", countrySlug: "turkiye" },
    { id: 74, name: "Bartın", slug: "bartin", countrySlug: "turkiye" },
    { id: 75, name: "Ardahan", slug: "ardahan", countrySlug: "turkiye" },
    { id: 76, name: "Iğdır", slug: "igdir", countrySlug: "turkiye" },
    { id: 77, name: "Yalova", slug: "yalova", countrySlug: "turkiye" },
    { id: 78, name: "Karabük", slug: "karabuk", countrySlug: "turkiye" },
    { id: 79, name: "Kilis", slug: "kilis", countrySlug: "turkiye" },
    { id: 80, name: "Osmaniye", slug: "osmaniye", countrySlug: "turkiye" },
    { id: 81, name: "Düzce", slug: "duzce", countrySlug: "turkiye" },
  ],
  "almanya": [ // Almanya
    { id: 82, name: "Berlin", slug: "berlin", countrySlug: "almanya" },
    { id: 83, name: "Münih", slug: "munih", countrySlug: "almanya" },
    { id: 84, name: "Hamburg", slug: "hamburg", countrySlug: "almanya" },
    { id: 85, name: "Köln", slug: "koln", countrySlug: "almanya" },
    { id: 86, name: "Frankfurt", slug: "frankfurt", countrySlug: "almanya" },
  ],
  "fransa": [ // Fransa
    { id: 87, name: "Paris", slug: "paris", countrySlug: "fransa" },
    { id: 88, name: "Marsilya", slug: "marsilya", countrySlug: "fransa" },
    { id: 89, name: "Lyon", slug: "lyon", countrySlug: "fransa" },
    { id: 90, name: "Toulouse", slug: "toulouse", countrySlug: "fransa" },
  ],
  "italya": [ // İtalya
    { id: 91, name: "Roma", slug: "roma", countrySlug: "italya" },
    { id: 92, name: "Milano", slug: "milano", countrySlug: "italya" },
    { id: 93, name: "Napoli", slug: "napoli", countrySlug: "italya" },
    { id: 94, name: "Torino", slug: "torino", countrySlug: "italya" },
  ],
  "ispanya": [ // İspanya
    { id: 95, name: "Madrid", slug: "madrid", countrySlug: "ispanya" },
    { id: 96, name: "Barselona", slug: "barselona", countrySlug: "ispanya" },
    { id: 97, name: "Valencia", slug: "valencia", countrySlug: "ispanya" },
    { id: 98, name: "Sevilla", slug: "sevilla", countrySlug: "ispanya" },
  ],
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ countryId: string }> }
) {
  try {
    const resolvedParams = await params;
    const countrySlug = resolvedParams.countryId;
    
    if (!countrySlug) {
      return NextResponse.json(
        {
          success: false,
          message: "Geçersiz ülke slug'ı",
        },
        { status: 400 }
      );
    }

    const cities = citiesByCountry[countrySlug as keyof typeof citiesByCountry] || [];

    return NextResponse.json({
      success: true,
      data: cities,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Şehirler yüklenirken hata oluştu",
      },
      { status: 500 }
    );
  }
} 
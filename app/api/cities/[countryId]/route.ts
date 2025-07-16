import { NextRequest, NextResponse } from "next/server";

// Örnek şehir verileri - gerçek uygulamada veritabanından gelecek
const citiesByCountry = {
  1: [ // Türkiye - Tüm 81 şehir
    { id: 1, name: "Adana", countryId: 1 },
    { id: 2, name: "Adıyaman", countryId: 1 },
    { id: 3, name: "Afyonkarahisar", countryId: 1 },
    { id: 4, name: "Ağrı", countryId: 1 },
    { id: 5, name: "Amasya", countryId: 1 },
    { id: 6, name: "Ankara", countryId: 1 },
    { id: 7, name: "Antalya", countryId: 1 },
    { id: 8, name: "Artvin", countryId: 1 },
    { id: 9, name: "Aydın", countryId: 1 },
    { id: 10, name: "Balıkesir", countryId: 1 },
    { id: 11, name: "Bilecik", countryId: 1 },
    { id: 12, name: "Bingöl", countryId: 1 },
    { id: 13, name: "Bitlis", countryId: 1 },
    { id: 14, name: "Bolu", countryId: 1 },
    { id: 15, name: "Burdur", countryId: 1 },
    { id: 16, name: "Bursa", countryId: 1 },
    { id: 17, name: "Çanakkale", countryId: 1 },
    { id: 18, name: "Çankırı", countryId: 1 },
    { id: 19, name: "Çorum", countryId: 1 },
    { id: 20, name: "Denizli", countryId: 1 },
    { id: 21, name: "Diyarbakır", countryId: 1 },
    { id: 22, name: "Edirne", countryId: 1 },
    { id: 23, name: "Elazığ", countryId: 1 },
    { id: 24, name: "Erzincan", countryId: 1 },
    { id: 25, name: "Erzurum", countryId: 1 },
    { id: 26, name: "Eskişehir", countryId: 1 },
    { id: 27, name: "Gaziantep", countryId: 1 },
    { id: 28, name: "Giresun", countryId: 1 },
    { id: 29, name: "Gümüşhane", countryId: 1 },
    { id: 30, name: "Hakkari", countryId: 1 },
    { id: 31, name: "Hatay", countryId: 1 },
    { id: 32, name: "Isparta", countryId: 1 },
    { id: 33, name: "Mersin", countryId: 1 },
    { id: 34, name: "İstanbul", countryId: 1 },
    { id: 35, name: "İzmir", countryId: 1 },
    { id: 36, name: "Kars", countryId: 1 },
    { id: 37, name: "Kastamonu", countryId: 1 },
    { id: 38, name: "Kayseri", countryId: 1 },
    { id: 39, name: "Kırklareli", countryId: 1 },
    { id: 40, name: "Kırşehir", countryId: 1 },
    { id: 41, name: "Kocaeli", countryId: 1 },
    { id: 42, name: "Konya", countryId: 1 },
    { id: 43, name: "Kütahya", countryId: 1 },
    { id: 44, name: "Malatya", countryId: 1 },
    { id: 45, name: "Manisa", countryId: 1 },
    { id: 46, name: "Kahramanmaraş", countryId: 1 },
    { id: 47, name: "Mardin", countryId: 1 },
    { id: 48, name: "Muğla", countryId: 1 },
    { id: 49, name: "Muş", countryId: 1 },
    { id: 50, name: "Nevşehir", countryId: 1 },
    { id: 51, name: "Niğde", countryId: 1 },
    { id: 52, name: "Ordu", countryId: 1 },
    { id: 53, name: "Rize", countryId: 1 },
    { id: 54, name: "Sakarya", countryId: 1 },
    { id: 55, name: "Samsun", countryId: 1 },
    { id: 56, name: "Siirt", countryId: 1 },
    { id: 57, name: "Sinop", countryId: 1 },
    { id: 58, name: "Sivas", countryId: 1 },
    { id: 59, name: "Tekirdağ", countryId: 1 },
    { id: 60, name: "Tokat", countryId: 1 },
    { id: 61, name: "Trabzon", countryId: 1 },
    { id: 62, name: "Tunceli", countryId: 1 },
    { id: 63, name: "Şanlıurfa", countryId: 1 },
    { id: 64, name: "Uşak", countryId: 1 },
    { id: 65, name: "Van", countryId: 1 },
    { id: 66, name: "Yozgat", countryId: 1 },
    { id: 67, name: "Zonguldak", countryId: 1 },
    { id: 68, name: "Aksaray", countryId: 1 },
    { id: 69, name: "Bayburt", countryId: 1 },
    { id: 70, name: "Karaman", countryId: 1 },
    { id: 71, name: "Kırıkkale", countryId: 1 },
    { id: 72, name: "Batman", countryId: 1 },
    { id: 73, name: "Şırnak", countryId: 1 },
    { id: 74, name: "Bartın", countryId: 1 },
    { id: 75, name: "Ardahan", countryId: 1 },
    { id: 76, name: "Iğdır", countryId: 1 },
    { id: 77, name: "Yalova", countryId: 1 },
    { id: 78, name: "Karabük", countryId: 1 },
    { id: 79, name: "Kilis", countryId: 1 },
    { id: 80, name: "Osmaniye", countryId: 1 },
    { id: 81, name: "Düzce", countryId: 1 },
  ],
  2: [ // Almanya
    { id: 82, name: "Berlin", countryId: 2 },
    { id: 83, name: "Münih", countryId: 2 },
    { id: 84, name: "Hamburg", countryId: 2 },
    { id: 85, name: "Köln", countryId: 2 },
    { id: 86, name: "Frankfurt", countryId: 2 },
  ],
  3: [ // Fransa
    { id: 87, name: "Paris", countryId: 3 },
    { id: 88, name: "Marsilya", countryId: 3 },
    { id: 89, name: "Lyon", countryId: 3 },
    { id: 90, name: "Toulouse", countryId: 3 },
  ],
  4: [ // İtalya
    { id: 91, name: "Roma", countryId: 4 },
    { id: 92, name: "Milano", countryId: 4 },
    { id: 93, name: "Napoli", countryId: 4 },
    { id: 94, name: "Torino", countryId: 4 },
  ],
  5: [ // İspanya
    { id: 95, name: "Madrid", countryId: 5 },
    { id: 96, name: "Barselona", countryId: 5 },
    { id: 97, name: "Valencia", countryId: 5 },
    { id: 98, name: "Sevilla", countryId: 5 },
  ],
};

export async function GET(
  request: NextRequest,
  { params }: { params: { countryId: string } }
) {
  try {
    const countryId = parseInt(params.countryId);
    
    if (!countryId || isNaN(countryId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Geçersiz ülke ID'si",
        },
        { status: 400 }
      );
    }

    const cities = citiesByCountry[countryId as keyof typeof citiesByCountry] || [];

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
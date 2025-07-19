import { NextRequest, NextResponse } from "next/server";

// Örnek ilçe verileri - gerçek uygulamada veritabanından gelecek
const districtsByCity = {
  26: [ // Eskişehir - Detaylı ilçe listesi
    { id: 1, name: "Tepebaşı", cityId: 26 },
    { id: 2, name: "Odunpazarı", cityId: 26 },
    { id: 3, name: "Alpu", cityId: 26 },
    { id: 4, name: "Beylikova", cityId: 26 },
    { id: 5, name: "Çifteler", cityId: 26 },
    { id: 6, name: "Günyüzü", cityId: 26 },
    { id: 7, name: "Han", cityId: 26 },
    { id: 8, name: "İnönü", cityId: 26 },
    { id: 9, name: "Mahmudiye", cityId: 26 },
    { id: 10, name: "Mihalgazi", cityId: 26 },
    { id: 11, name: "Mihalıççık", cityId: 26 },
    { id: 12, name: "Sarıcakaya", cityId: 26 },
    { id: 13, name: "Seyitgazi", cityId: 26 },
    { id: 14, name: "Sivrihisar", cityId: 26 },
  ],
  34: [ // İstanbul
    { id: 15, name: "Kadıköy", cityId: 34 },
    { id: 16, name: "Beşiktaş", cityId: 34 },
    { id: 17, name: "Şişli", cityId: 34 },
    { id: 18, name: "Beyoğlu", cityId: 34 },
    { id: 19, name: "Fatih", cityId: 34 },
    { id: 20, name: "Üsküdar", cityId: 34 },
    { id: 21, name: "Bakırköy", cityId: 34 },
    { id: 22, name: "Maltepe", cityId: 34 },
    { id: 23, name: "Pendik", cityId: 34 },
    { id: 24, name: "Kartal", cityId: 34 },
    { id: 25, name: "Sultanbeyli", cityId: 34 },
    { id: 26, name: "Sancaktepe", cityId: 34 },
    { id: 27, name: "Başakşehir", cityId: 34 },
    { id: 28, name: "Esenyurt", cityId: 34 },
    { id: 29, name: "Büyükçekmece", cityId: 34 },
    { id: 30, name: "Avcılar", cityId: 34 },
    { id: 31, name: "Küçükçekmece", cityId: 34 },
    { id: 32, name: "Gaziosmanpaşa", cityId: 34 },
    { id: 33, name: "Sultangazi", cityId: 34 },
    { id: 34, name: "Esenler", cityId: 34 },
    { id: 35, name: "Bağcılar", cityId: 34 },
    { id: 36, name: "Güngören", cityId: 34 },
    { id: 37, name: "Zeytinburnu", cityId: 34 },
    { id: 38, name: "Bayrampaşa", cityId: 34 },
    { id: 39, name: "Eyüpsultan", cityId: 34 },
    { id: 40, name: "Kağıthane", cityId: 34 },
    { id: 41, name: "Sarıyer", cityId: 34 },
  ],
  6: [ // Ankara
    { id: 67, name: "Çankaya", cityId: 6 },
    { id: 68, name: "Keçiören", cityId: 6 },
    { id: 69, name: "Mamak", cityId: 6 },
    { id: 70, name: "Yenimahalle", cityId: 6 },
    { id: 71, name: "Etimesgut", cityId: 6 },
    { id: 72, name: "Sincan", cityId: 6 },
    { id: 73, name: "Altındağ", cityId: 6 },
    { id: 74, name: "Gölbaşı", cityId: 6 },
    { id: 75, name: "Polatlı", cityId: 6 },
    { id: 76, name: "Kazan", cityId: 6 },
    { id: 77, name: "Akyurt", cityId: 6 },
    { id: 78, name: "Ayaş", cityId: 6 },
    { id: 79, name: "Bala", cityId: 6 },
    { id: 80, name: "Beypazarı", cityId: 6 },
    { id: 81, name: "Çamlıdere", cityId: 6 },
    { id: 82, name: "Çubuk", cityId: 6 },
    { id: 83, name: "Elmadağ", cityId: 6 },
    { id: 84, name: "Evren", cityId: 6 },
    { id: 85, name: "Güdül", cityId: 6 },
    { id: 86, name: "Haymana", cityId: 6 },
    { id: 87, name: "Kalecik", cityId: 6 },
    { id: 88, name: "Kızılcahamam", cityId: 6 },
    { id: 89, name: "Nallıhan", cityId: 6 },
    { id: 90, name: "Şereflikoçhisar", cityId: 6 },
    { id: 91, name: "Yenikent", cityId: 6 },
  ],
  35: [ // İzmir
    { id: 92, name: "Konak", cityId: 35 },
    { id: 93, name: "Bornova", cityId: 35 },
    { id: 94, name: "Karşıyaka", cityId: 35 },
    { id: 95, name: "Buca", cityId: 35 },
    { id: 96, name: "Çiğli", cityId: 35 },
    { id: 97, name: "Bayraklı", cityId: 35 },
    { id: 98, name: "Gaziemir", cityId: 35 },
    { id: 99, name: "Güzelbahçe", cityId: 35 },
    { id: 100, name: "Narlıdere", cityId: 35 },
    { id: 101, name: "Urla", cityId: 35 },
    { id: 102, name: "Seferihisar", cityId: 35 },
    { id: 103, name: "Çeşme", cityId: 35 },
    { id: 104, name: "Karaburun", cityId: 35 },
    { id: 105, name: "Dikili", cityId: 35 },
    { id: 106, name: "Bergama", cityId: 35 },
    { id: 107, name: "Aliağa", cityId: 35 },
    { id: 108, name: "Foça", cityId: 35 },
    { id: 109, name: "Menemen", cityId: 35 },
    { id: 110, name: "Kemalpaşa", cityId: 35 },
    { id: 111, name: "Ödemiş", cityId: 35 },
    { id: 112, name: "Tire", cityId: 35 },
    { id: 113, name: "Bayındır", cityId: 35 },
    { id: 114, name: "Kiraz", cityId: 35 },
    { id: 115, name: "Çeşme", cityId: 35 },
    { id: 116, name: "Selçuk", cityId: 35 },
    { id: 117, name: "Torbalı", cityId: 35 },
    { id: 118, name: "Menderes", cityId: 35 },
    { id: 119, name: "Balçova", cityId: 35 },
    { id: 120, name: "Karabağlar", cityId: 35 },
    { id: 121, name: "Konak", cityId: 35 },
  ],
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cityId: string }> }
) {
  try {
    const resolvedParams = await params;
    
    const cityId = parseInt(resolvedParams.cityId);
    
    if (!cityId || isNaN(cityId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Geçersiz şehir ID'si",
        },
        { status: 400 }
      );
    }

    const districts = districtsByCity[cityId as keyof typeof districtsByCity] || [];

    return NextResponse.json({
      success: true,
      data: districts,
      message: `Şehir ID: ${cityId} için ${districts.length} ilçe bulundu`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "İlçeler yüklenirken hata oluştu",
      },
      { status: 500 }
    );
  }
} 
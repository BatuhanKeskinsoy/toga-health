import { NextRequest, NextResponse } from "next/server";

// Örnek ilçe verileri - gerçek uygulamada veritabanından gelecek
const districtsByCity = {
  "eskisehir": [ // Eskişehir - Detaylı ilçe listesi
    { id: 1, name: "Tepebaşı", slug: "tepebasi", citySlug: "eskisehir" },
    { id: 2, name: "Odunpazarı", slug: "odunpazari", citySlug: "eskisehir" },
    { id: 3, name: "Alpu", slug: "alpu", citySlug: "eskisehir" },
    { id: 4, name: "Beylikova", slug: "beylikova", citySlug: "eskisehir" },
    { id: 5, name: "Çifteler", slug: "cifteler", citySlug: "eskisehir" },
    { id: 6, name: "Günyüzü", slug: "gunyuzu", citySlug: "eskisehir" },
    { id: 7, name: "Han", slug: "han", citySlug: "eskisehir" },
    { id: 8, name: "İnönü", slug: "inonu", citySlug: "eskisehir" },
    { id: 9, name: "Mahmudiye", slug: "mahmudiye", citySlug: "eskisehir" },
    { id: 10, name: "Mihalgazi", slug: "mihalgazi", citySlug: "eskisehir" },
    { id: 11, name: "Mihalıççık", slug: "mihaliccik", citySlug: "eskisehir" },
    { id: 12, name: "Sarıcakaya", slug: "saricakaya", citySlug: "eskisehir" },
    { id: 13, name: "Seyitgazi", slug: "seyitgazi", citySlug: "eskisehir" },
    { id: 14, name: "Sivrihisar", slug: "sivrihisar", citySlug: "eskisehir" },
  ],
  "istanbul": [ // İstanbul
    { id: 15, name: "Kadıköy", slug: "kadikoy", citySlug: "istanbul" },
    { id: 16, name: "Beşiktaş", slug: "besiktas", citySlug: "istanbul" },
    { id: 17, name: "Şişli", slug: "sisli", citySlug: "istanbul" },
    { id: 18, name: "Beyoğlu", slug: "beyoglu", citySlug: "istanbul" },
    { id: 19, name: "Fatih", slug: "fatih", citySlug: "istanbul" },
    { id: 20, name: "Üsküdar", slug: "uskudar", citySlug: "istanbul" },
    { id: 21, name: "Bakırköy", slug: "bakirkoy", citySlug: "istanbul" },
    { id: 22, name: "Maltepe", slug: "maltepe", citySlug: "istanbul" },
    { id: 23, name: "Pendik", slug: "pendik", citySlug: "istanbul" },
    { id: 24, name: "Kartal", slug: "kartal", citySlug: "istanbul" },
    { id: 25, name: "Sultanbeyli", slug: "sultanbeyli", citySlug: "istanbul" },
    { id: 26, name: "Sancaktepe", slug: "sancaktepe", citySlug: "istanbul" },
    { id: 27, name: "Başakşehir", slug: "basaksehir", citySlug: "istanbul" },
    { id: 28, name: "Esenyurt", slug: "esenyurt", citySlug: "istanbul" },
    { id: 29, name: "Büyükçekmece", slug: "buyukcekmece", citySlug: "istanbul" },
    { id: 30, name: "Avcılar", slug: "avcilar", citySlug: "istanbul" },
    { id: 31, name: "Küçükçekmece", slug: "kucukcekmece", citySlug: "istanbul" },
    { id: 32, name: "Gaziosmanpaşa", slug: "gaziosmanpasa", citySlug: "istanbul" },
    { id: 33, name: "Sultangazi", slug: "sultangazi", citySlug: "istanbul" },
    { id: 34, name: "Esenler", slug: "esenler", citySlug: "istanbul" },
    { id: 35, name: "Bağcılar", slug: "bagcilar", citySlug: "istanbul" },
    { id: 36, name: "Güngören", slug: "gungoren", citySlug: "istanbul" },
    { id: 37, name: "Zeytinburnu", slug: "zeytinburnu", citySlug: "istanbul" },
    { id: 38, name: "Bayrampaşa", slug: "bayrampasa", citySlug: "istanbul" },
    { id: 39, name: "Eyüpsultan", slug: "eyupsultan", citySlug: "istanbul" },
    { id: 40, name: "Kağıthane", slug: "kagithane", citySlug: "istanbul" },
    { id: 41, name: "Sarıyer", slug: "sariyer", citySlug: "istanbul" },
  ],
  "ankara": [ // Ankara
    { id: 67, name: "Çankaya", slug: "cankaya", citySlug: "ankara" },
    { id: 68, name: "Keçiören", slug: "kecioren", citySlug: "ankara" },
    { id: 69, name: "Mamak", slug: "mamak", citySlug: "ankara" },
    { id: 70, name: "Yenimahalle", slug: "yenimahalle", citySlug: "ankara" },
    { id: 71, name: "Etimesgut", slug: "etimesgut", citySlug: "ankara" },
    { id: 72, name: "Sincan", slug: "sincan", citySlug: "ankara" },
    { id: 73, name: "Altındağ", slug: "altindag", citySlug: "ankara" },
    { id: 74, name: "Gölbaşı", slug: "golbasi", citySlug: "ankara" },
    { id: 75, name: "Polatlı", slug: "polatli", citySlug: "ankara" },
    { id: 76, name: "Kazan", slug: "kazan", citySlug: "ankara" },
    { id: 77, name: "Akyurt", slug: "akyurt", citySlug: "ankara" },
    { id: 78, name: "Ayaş", slug: "ayas", citySlug: "ankara" },
    { id: 79, name: "Bala", slug: "bala", citySlug: "ankara" },
    { id: 80, name: "Beypazarı", slug: "beypazari", citySlug: "ankara" },
    { id: 81, name: "Çamlıdere", slug: "camlidere", citySlug: "ankara" },
    { id: 82, name: "Çubuk", slug: "cubuk", citySlug: "ankara" },
    { id: 83, name: "Elmadağ", slug: "elmadag", citySlug: "ankara" },
    { id: 84, name: "Evren", slug: "evren", citySlug: "ankara" },
    { id: 85, name: "Güdül", slug: "gudul", citySlug: "ankara" },
    { id: 86, name: "Haymana", slug: "haymana", citySlug: "ankara" },
    { id: 87, name: "Kalecik", slug: "kalecik", citySlug: "ankara" },
    { id: 88, name: "Kızılcahamam", slug: "kizilcahamam", citySlug: "ankara" },
    { id: 89, name: "Nallıhan", slug: "nallihan", citySlug: "ankara" },
    { id: 90, name: "Şereflikoçhisar", slug: "sereflikochisar", citySlug: "ankara" },
    { id: 91, name: "Yenikent", slug: "yenikent", citySlug: "ankara" },
  ],
  "izmir": [ // İzmir
    { id: 92, name: "Konak", slug: "konak", citySlug: "izmir" },
    { id: 93, name: "Bornova", slug: "bornova", citySlug: "izmir" },
    { id: 94, name: "Karşıyaka", slug: "karsiyaka", citySlug: "izmir" },
    { id: 95, name: "Buca", slug: "buca", citySlug: "izmir" },
    { id: 96, name: "Çiğli", slug: "cigli", citySlug: "izmir" },
    { id: 97, name: "Bayraklı", slug: "bayrakli", citySlug: "izmir" },
    { id: 98, name: "Gaziemir", slug: "gaziemir", citySlug: "izmir" },
    { id: 99, name: "Güzelbahçe", slug: "guzelbahce", citySlug: "izmir" },
    { id: 100, name: "Narlıdere", slug: "narlidere", citySlug: "izmir" },
    { id: 101, name: "Urla", slug: "urla", citySlug: "izmir" },
    { id: 102, name: "Seferihisar", slug: "seferihisar", citySlug: "izmir" },
    { id: 103, name: "Çeşme", slug: "cesme", citySlug: "izmir" },
    { id: 104, name: "Karaburun", slug: "karaburun", citySlug: "izmir" },
    { id: 105, name: "Dikili", slug: "dikili", citySlug: "izmir" },
    { id: 106, name: "Bergama", slug: "bergama", citySlug: "izmir" },
    { id: 107, name: "Aliağa", slug: "aliaga", citySlug: "izmir" },
    { id: 108, name: "Foça", slug: "foca", citySlug: "izmir" },
    { id: 109, name: "Menemen", slug: "menemen", citySlug: "izmir" },
    { id: 110, name: "Kemalpaşa", slug: "kemalpasa", citySlug: "izmir" },
    { id: 111, name: "Ödemiş", slug: "odemis", citySlug: "izmir" },
    { id: 112, name: "Tire", slug: "tire", citySlug: "izmir" },
    { id: 113, name: "Bayındır", slug: "bayindir", citySlug: "izmir" },
    { id: 114, name: "Kiraz", slug: "kiraz", citySlug: "izmir" },
    { id: 115, name: "Çeşme", slug: "cesme", citySlug: "izmir" },
    { id: 116, name: "Selçuk", slug: "selcuk", citySlug: "izmir" },
    { id: 117, name: "Torbalı", slug: "torbali", citySlug: "izmir" },
    { id: 118, name: "Menderes", slug: "menderes", citySlug: "izmir" },
    { id: 119, name: "Balçova", slug: "balcova", citySlug: "izmir" },
    { id: 120, name: "Karabağlar", slug: "karabaglar", citySlug: "izmir" },
    { id: 121, name: "Konak", slug: "konak", citySlug: "izmir" },
  ],
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cityId: string }> }
) {
  try {
    const resolvedParams = await params;
    
    const citySlug = resolvedParams.cityId;
    
    if (!citySlug) {
      return NextResponse.json(
        {
          success: false,
          message: "Geçersiz şehir slug'ı",
        },
        { status: 400 }
      );
    }

    const districts = districtsByCity[citySlug as keyof typeof districtsByCity] || [];

    return NextResponse.json({
      success: true,
      data: districts,
      message: `Şehir slug: ${citySlug} için ${districts.length} ilçe bulundu`,
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
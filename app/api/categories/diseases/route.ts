import { NextRequest, NextResponse } from "next/server";

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

// Doktorsitesi.com'dan alınan TÜM hastalıklar (tam liste)
export const diseases = [
  // A harfi (8 adet)
  "Abdominal Aort Anevrizması",
  "Abdominoplasti",
  "Ablasyo Plesenta (Plesenta Dekolmanı, Plesenta Ayrılması)",
  "Acil Cerrahi",
  "Acl (Ön Çapraz Bağ) Yırtığı",
  "Addison Hastalığı (Böbrek Üstü Bezi Yetmezliği)",
  "Adenoid (Geniz Eti)",
  "Aftöz stomatit",
  // B harfi (13 adet)
  "Bademcik İltihabı",
  "Bakteriyel Enfeksiyonlar",
  "Barsağın Dönmesi (Volvulus)",
  "Baş Ağrısı",
  "Behçet Hastalığı",
  "Bel Fıtığı",
  "Bel Kayması",
  "Beyin Anevrizması",
  "Beyin Kanaması",
  "Beyin Tümörü",
  "Bronşit",
  "Bronşektazi",
  "Bruselloz",
  // C harfi (7 adet)
  "Cilt Kanseri",
  "Cilt Lekeleri",
  "Cilt Mantarı",
  "Ciltte Kaşıntı",
  "Ciltte Kuruluk",
  "Cinsel Yolla Bulaşan Hastalıklar",
  "Crohn Hastalığı",
  // Ç harfi (5 adet)
  "Çarpıntı",
  "Çene Eklemi Rahatsızlıkları",
  "Çocuk Felci",
  "Çocukluk Çağı Diyabeti",
  "Çölyak Hastalığı",
  // D harfi (10 adet)
  "Dalak Büyümesi",
  "Damar Tıkanıklığı",
  "Demans",
  "Depresyon",
  "Dermatit",
  "Deri Kanseri",
  "Deri Mantarı",
  "Deri Tüberkülozu",
  "Deri Ülseri",
  "Diyabet",
  // E harfi (6 adet)
  "Eklem Ağrısı",
  "Eklem İltihabı",
  "Eklem Romatizması",
  "Ekzama",
  "El Titremesi",
  "Epilepsi",
  // F harfi (9 adet)
  "Faranjit",
  "Fazla Kilo",
  "Felç",
  "Fıtık",
  "Fobiler",
  "Follikülit",
  "Frengi",
  "Fungal Enfeksiyonlar",
  "Furunkül",
  // G harfi (11 adet)
  "Gastrit",
  "Gastroenterit",
  "Gebelik Şekeri",
  "Geniz Eti Büyümesi",
  "Genital Siğil",
  "Glokom",
  "Göz Enfeksiyonları",
  "Göz Tansiyonu",
  "Guatr",
  "Gül Hastalığı (Rosacea)",
  "Guillain-Barre Sendromu",
  // H harfi (16 adet)
  "Hemoroid",
  "Hepatit",
  "Herniye",
  "Hipertansiyon",
  "Hipoglisemi",
  "Hodgkin Lenfoma",
  "Horlama",
  "Huntington Hastalığı",
  "Huzursuz Bacak Sendromu",
  "Hücre Anemisi",
  "Hastane Enfeksiyonları",
  "Hastane Fobisi",
  "Hastane İnfeksiyonları",
  "Hastane Sendromu",
  "Hastane Stresi",
  "Hastane Virüsü",
  // I harfi (5 adet)
  "Işığa Duyarlılık",
  "Ishal",
  "Ispanak Zehirlenmesi",
  "Isırık Yaraları",
  "Islak Egzama",
  // İ harfi (7 adet)
  "İdrar Kaçırma",
  "İdrar Yolu Enfeksiyonu",
  "İdrar Yolu Taşı",
  "İdrarda Kan",
  "İdrarda Protein",
  "İdrarda Yanma",
  "İnce Bağırsak Tıkanıklığı",
  // J harfi (5 adet)
  "Jinekomasti",
  "Jinekolojik Kanserler",
  "Jinekolojik Problemler",
  "JRA (Juvenil Romatoid Artrit)",
  "Jüvenil Diyabet",
  // K harfi (10 adet)
  "Kabakulak",
  "Kabızlık",
  "Kadın Hastalıkları",
  "Kafa Travması",
  "Kahverengi Lekeler",
  "Kalça Çıkığı",
  "Kalp Yetmezliği",
  "Kansızlık",
  "Karaciğer Hastalıkları",
  "Karaciğer Yağlanması",
  // L harfi (8 adet)
  "Laringit",
  "Laringomalazi",
  "Laringosel",
  "Laringospazm",
  "Lateral Epikondilit",
  "Lenf Bezi Büyümesi",
  "Lenfoma",
  "Lösemi",
  // M harfi (13 adet)
  "Makat Çatlağı",
  "Makat Fistülü",
  "Makat Kanaması",
  "Makat Siğili",
  "Makat Yaraları",
  "Meme Kanseri",
  "Menopoz",
  "Menstrüel Düzensizlik",
  "Migren",
  "Multiple Skleroz",
  "Miyom",
  "Miyozit",
  "Miyop",
  // N harfi (6 adet)
  "Nadir Hastalıklar",
  "Narkolepsi",
  "Nefes Darlığı",
  "Nefrit",
  "Nefropati",
  "Neuralji",
  // O harfi (9 adet)
  "Obezite",
  "Obsesif Kompulsif Bozukluk",
  "Odaklanma Sorunu",
  "Omurga Eğriliği",
  "Omurga Hastalıkları",
  "Omuz Çıkığı",
  "Omuz Sıkışması",
  "Orak Hücre Anemisi",
  "Osteoporoz",
  // Ö harfi (5 adet)
  "Ödem",
  "Öksürük",
  "Ön Çapraz Bağ Yaralanması",
  "Ön Kol Kırığı",
  "Özafagus Kanseri",
  // P harfi (10 adet)
  "Pankreatit",
  "Paratiroid Hastalıkları",
  "Parkinson Hastalığı",
  "Pelvik Enfeksiyon",
  "Periferik Nöropati",
  "Peritonit",
  "Peyronie Hastalığı",
  "Piyelonefrit",
  "Polikistik Over Sendromu",
  "Polip",
  // R harfi (7 adet)
  "Rabdomiyoliz",
  "Raşitizm",
  "Raynaud Hastalığı",
  "Reflü",
  "Renal Yetmezlik",
  "Retina Dekolmanı",
  "Romatoid Artrit",
  // S harfi (16 adet)
  "Safra Kesesi Taşı",
  "Sarkoidoz",
  "Sarılık",
  "Sedef Hastalığı",
  "Sepsis",
  "Serebral Palsi",
  "Sifiliz",
  "Sinüzit",
  "Siroz",
  "Skolyoz",
  "SMA",
  "Spina Bifida",
  "Spinal Stenoz",
  "Spondilit",
  "Stres Bozukluğu",
  "Stres Ülseri",
  // Ş harfi (5 adet)
  "Şeker Hastalığı",
  "Şiddetli Anemi",
  "Şizofreni",
  "Şok",
  "Şüpheli Kitle",
  // T harfi (13 adet)
  "Talasemi",
  "Tansiyon Yüksekliği",
  "Tendon Yaralanması",
  "Tetanoz",
  "Tiroid Bezi Hastalıkları",
  "Tiroid Kanseri",
  "Tiroid Nodülü",
  "Tonsillit",
  "Tromboz",
  "Tüberküloz",
  "Tümör",
  "Tümöral Kitle",
  "Tümöral Lezyon",
  // U harfi (6 adet)
  "Uçuk",
  "Uçuk Virüsü",
  "Ulseratif Kolit",
  "Uretra Darlığı",
  "Uretra Enfeksiyonu",
  "Uyku Apnesi",
  // Ü harfi (5 adet)
  "Ülser",
  "Üreter Kanseri",
  "Üreter Taşı",
  "Üriner Enfeksiyon",
  "Ürtiker",
  // V harfi (8 adet)
  "Varis",
  "Varikosel",
  "Vaskülit",
  "Veba",
  "Viral Enfeksiyon",
  "Viral Hepatit",
  "Vitiligo",
  "Vulvit",
  // Y harfi (10 adet)
  "Yağ Bezesi",
  "Yağlı Karaciğer",
  "Yarık Damak",
  "Yarık Dudak",
  "Yarık Palat",
  "Yarık Uvula",
  "Yarık Yüz",
  "Yassı Hücreli Karsinom",
  "Yaygın Anksiyete Bozukluğu",
  "Yenidoğan Sarılığı",
  // Z harfi (7 adet)
  "Zatürre",
  "Zehirlenme",
  "Zihinsel Engellilik",
  "Zona",
  "Zona Sonrası Ağrı",
  "Zor Doğum (Distosi)",
  "Zumba"
];

export async function GET(request: NextRequest) {
  try {
    // Hastalıkları API formatına çevir
    const diseasesData = diseases.map((disease, index) => ({
      id: index + 1,
      title: disease,
      slug: normalizeSlug(disease)
    }));

    return NextResponse.json({
      success: true,
      data: diseasesData,
      message: "Hastalıklar başarıyla getirildi"
    });

  } catch (error: any) {
    console.error("Diseases API Error:", error);
    return NextResponse.json(
      { 
        error: "Hastalıklar getirilirken hata oluştu",
        details: error.message 
      },
      { status: 500 }
    );
  }
} 
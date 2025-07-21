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

// Karışık sıralı örnek tedavi ve hizmetler listesi (her harf için 6+)
const treatmentsServices = [
  // A
  "Acil Servis",
  "Ağız ve Diş Sağlığı Hizmetleri",
  "Alerji Testleri",
  "Anjiyografi",
  "Anestezi Hizmetleri",
  "Aşı Uygulamaları",
  "Acil Doğum Hizmetleri",
  // B
  "Biyopsi",
  "Bebek Takibi",
  "Beyin MR",
  "Böbrek Taşı Kırma",
  "Bariatrik Cerrahi",
  "Botoks Uygulaması",
  "Bebek Beslenme Danışmanlığı",
  // C
  "Check-up",
  "Cilt Bakımı",
  "Cataract Ameliyatı",
  "Cilt Lazer Tedavisi",
  "Cilt Kanseri Tedavisi",
  "Cilt Gençleştirme",
  "Cilt Enfeksiyonları Tedavisi",
  // D
  "Diyaliz",
  "Diş Beyazlatma",
  "Diz Protezi",
  "Dermatolojik Muayene",
  "Doğum Hizmetleri",
  "Damar Tıkanıklığı Tedavisi",
  "Diş Teli Tedavisi",
  // E
  "EKG",
  "Endoskopi",
  "Enjeksiyon Hizmetleri",
  "Estetik Cerrahi",
  "Efor Testi",
  "Ekokardiyografi",
  "Enfeksiyon Tedavisi",
  // F
  "Fizik Tedavi",
  "Fetal Muayene",
  "Fıtık Ameliyatı",
  "Frenektomi",
  "Flebotomi",
  "Fiziksel Rehabilitasyon",
  "Fetal Ultrason",
  // G
  "Göz Lazer Ameliyatı",
  "Göz Muayenesi",
  "Genetik Danışmanlık",
  "Gastroenteroloji Muayenesi",
  "Gebelik Takibi",
  "Gebe Okulu",
  "Göz Tansiyonu Ölçümü",
  // H
  "Hemodiyaliz",
  "Hematoloji Konsültasyonu",
  "Histeroskopi",
  "Hormon Testleri",
  "HPV Aşısı",
  "Hastane Yatış Hizmetleri",
  "Hastane Taburcu Hizmetleri",
  // I
  "İmmünoterapi",
  "İdrar Tahlili",
  "İlaç Tedavisi",
  "İnsülin Tedavisi",
  "İnme Rehabilitasyonu",
  "İşitme Testi",
  "İleri Görüntüleme",
  // İ
  "İmplant Tedavisi",
  "İleri Endoskopi",
  "İleri Kardiyak Girişim",
  "İleri Lazer Tedavisi",
  "İleri Ortopedik Cerrahi",
  "İleri Radyoterapi",
  "İleri Nörolojik Rehabilitasyon",
  // J
  "Jinekolojik Muayene",
  "Jinekolojik Cerrahi",
  "Jinekolojik Ultrason",
  "Jinekolojik Onkoloji Tedavisi",
  "Jinekolojik Laparoskopi",
  "Jinekolojik Patoloji",
  "Jinekolojik Radyoloji",
  // K
  "Kemoterapi",
  "Kalp Pili Takılması",
  "Katarakt Ameliyatı",
  "Kardiyoloji Muayenesi",
  "Kısırlık Tedavisi",
  "KBB Ameliyatları",
  "Kök Hücre Tedavisi",
  // L
  "Lazer Epilasyon",
  "Laparoskopik Cerrahi",
  "Lomber Ponksiyon",
  "Liposuction",
  "Laboratuvar Testleri",
  "Lenfödem Tedavisi",
  "Laringoskopi",
  // M
  "Mamografi",
  "MR Görüntüleme",
  "Meme Cerrahisi",
  "Menisküs Ameliyatı",
  "Mikrocerrahi",
  "Mide Balonu",
  "Mide Botoksu",
  // N
  "Nefroloji Muayenesi",
  "Nöroloji Muayenesi",
  "Nükleer Tıp Görüntüleme",
  "Nazal Endoskopi",
  "Nöralterapi",
  "Nefrektomi",
  "Nöropsikolojik Testler",
  // O
  "Ortopedik Cerrahi",
  "Onkoloji Tedavisi",
  "Odyometri",
  "Obezite Cerrahisi",
  "Osteopati",
  "Ozon Tedavisi",
  "Oftalmolojik Muayene",
  // Ö
  "Özofagoskopi",
  "Özofagus Cerrahisi",
  "Ön Çapraz Bağ Ameliyatı",
  "Ödem Tedavisi",
  "Östrojen Tedavisi",
  "Özofagus Biyopsisi",
  "Özofagus Stenti",
  // P
  "Psikoterapi",
  "Protez Diş",
  "Pediatrik Muayene",
  "Pankreas Cerrahisi",
  "Palyatif Bakım",
  "Plastik Cerrahi",
  "Pulmoner Rehabilitasyon",
  // R
  "Radyoterapi",
  "Radyoloji Hizmetleri",
  "Rehabilitasyon",
  "Renal Transplantasyon",
  "Rinoplasti",
  "Robotik Cerrahi",
  "Ruh Sağlığı Danışmanlığı",
  // S
  "Sünnet",
  "Sigarayı Bıraktırma Tedavisi",
  "Silikon Meme Protezi",
  "Skar Revizyonu",
  "Sistoskopi",
  "Spor Hekimliği Hizmetleri",
  "Saç Ekimi",
  // Ş
  "Şeker Ölçümü",
  "Şizofreni Tedavisi",
  "Şiddetli Ağrı Tedavisi",
  "Şok Tedavisi",
  "Şiddetli Enfeksiyon Tedavisi",
  "Şiddetli Yanık Tedavisi",
  "Şiddetli Astım Tedavisi",
  // T
  "Tansiyon Ölçümü",
  "Tıbbi Onkoloji",
  "Tiroit Cerrahisi",
  "Tüp Bebek Tedavisi",
  "Tomografi",
  "Travma Cerrahisi",
  "Trombektomi",
  // U
  "Ultrason",
  "Uyku Testi",
  "Uygulamalı Fizyoterapi",
  "Uygulamalı Psikoloji",
  "Uygulamalı Diyetisyenlik",
  "Uygulamalı Rehabilitasyon",
  "Uygulamalı Genetik Danışmanlık",
  // Ü
  "Üroloji Muayenesi",
  "Üst Solunum Yolu Tedavisi",
  "Üst Ekstremite Cerrahisi",
  "Ürtiker Tedavisi",
  "Ürolojik Onkoloji Tedavisi",
  "Ürolojik Cerrahi",
  "Üroloji Hemşireliği",
  // V
  "Varis Tedavisi",
  "Vasküler Cerrahi",
  "Viral Enfeksiyon Tedavisi",
  "Vaskülit Tedavisi",
  "Vasküler Radyoloji",
  "Vasküler Nöroloji",
  "Vasküler Onkoloji",
  // Y
  "Yoğun Bakım Hizmetleri",
  "Yenidoğan Bakımı",
  "Yenidoğan Yoğun Bakım",
  "Yenidoğan Cerrahisi",
  "Yenidoğan Nörolojisi",
  "Yenidoğan Kardiyolojisi",
  "Yenidoğan Enfeksiyonları",
  // Z
  "Zatürre Tedavisi",
  "Zehirlenme Tedavisi",
  "Zihinsel Rehabilitasyon",
  "Zihinsel Engelliler Eğitimi",
  "Zihinsel Gelişim Desteği",
  "Zirkonyum Diş Kaplama",
  "Zona Tedavisi"
];

export async function GET(request: NextRequest) {
  try {
    // Tedavi ve hizmetleri API formatına çevir
    const treatmentsServicesData = treatmentsServices.map((item, index) => ({
      id: index + 1,
      title: item,
      slug: normalizeSlug(item)
    }));

    return NextResponse.json({
      success: true,
      data: treatmentsServicesData,
      message: "Tedavi ve hizmetler başarıyla getirildi"
    });

  } catch (error: any) {
    console.error("Treatments & Services API Error:", error);
    return NextResponse.json(
      {
        error: "Tedavi ve hizmetler getirilirken hata oluştu",
        details: error.message
      },
      { status: 500 }
    );
  }
} 
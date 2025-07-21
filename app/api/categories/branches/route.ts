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

// Karışık sıralı örnek branşlar (branches) listesi
const branches = [
  // A
  "Acil Tıp",
  "Aile Hekimliği",
  "Alerji ve İmmünoloji",
  "Anesteziyoloji ve Reanimasyon",
  "Androloji",
  "Ağız, Diş ve Çene Cerrahisi",
  "Ağız, Diş ve Çene Radyolojisi",
  "Adli Tıp",
  "Algoloji (Ağrı Tedavisi)",
  "Acil Dahiliye",
  // B
  "Beyin ve Sinir Cerrahisi",
  "Beslenme ve Diyetetik",
  "Biyokimya",
  "Biyofizik",
  "Biyoloji",
  "Biyoteknoloji",
  "Bakteriyoloji",
  "Biyostatistik",
  // C
  "Çocuk Sağlığı ve Hastalıkları",
  "Çocuk Cerrahisi",
  "Çocuk Kardiyolojisi",
  "Çocuk Nörolojisi",
  "Çocuk Psikiyatrisi",
  "Çocuk Endokrinolojisi",
  "Çocuk Onkolojisi",
  "Çocuk Ürolojisi",
  "Çocuk Gastroenterolojisi",
  // D
  "Dahiliye",
  "Dermatoloji (Cildiye)",
  "Deri ve Zührevi Hastalıklar",
  "Diş Hekimliği",
  "Doku Tipleme",
  "Deneysel Tıp",
  "Diş Protez",
  "Diş Hastalıkları ve Tedavisi",
  // E
  "Enfeksiyon Hastalıkları",
  "Endokrinoloji ve Metabolizma Hastalıkları",
  "Estetik, Plastik ve Rekonstrüktif Cerrahi",
  "Erişkin Psikiyatrisi",
  "Epidemiyoloji",
  "Embriyoloji",
  "El Cerrahisi",
  // F
  "Fizik Tedavi ve Rehabilitasyon",
  "Fizyoloji",
  "Fetal Tıp",
  "Fetal Cerrahi",
  "Fizyopatoloji",
  "Fetal Kardiyoloji",
  "Fetal Nöroloji",
  // G
  "Genel Cerrahi",
  "Gastroenteroloji",
  "Geriatri",
  "Göğüs Cerrahisi",
  "Göğüs Hastalıkları",
  "Göz Hastalıkları",
  "Genetik Hastalıklar",
  "Gelişimsel Pediatri",
  // H
  "Hematoloji",
  "Halk Sağlığı",
  "Hiperbarik Tıp",
  "Histoloji ve Embriyoloji",
  "Hastane Enfeksiyonları",
  "Hormon Hastalıkları",
  "Havacılık Tıbbı",
  // I
  "İmmünoloji",
  "İç Hastalıkları",
  "İnfertilite",
  "İş ve Meslek Hastalıkları",
  "İlaç Geliştirme",
  "İleri Yaşam Desteği",
  "İşitme Bozuklukları",
  // İ
  "İşitme ve Denge Hastalıkları",
  "İleri Endoskopi",
  "İleri Kardiyoloji",
  "İleri Nöroloji",
  "İleri Onkoloji",
  "İleri Radyoloji",
  "İleri Cerrahi",
  // J
  "Jinekoloji",
  "Jinekolojik Onkoloji",
  "Jinekolojik Endokrinoloji",
  "Jinekolojik Cerrahi",
  "Jinekolojik Patoloji",
  "Jinekolojik Radyoloji",
  "Jinekolojik Ultrasonografi",
  // K
  "Kardiyoloji",
  "Kadın Hastalıkları ve Doğum",
  "Klinik Biyokimya",
  "Klinik Farmakoloji",
  "Klinik Mikrobiyoloji",
  "Kulak Burun Boğaz",
  "Kardiyovasküler Cerrahi",
  "Klinik Nörofizyoloji",
  // L
  "Laboratuvar Tıbbı",
  "Laparoskopik Cerrahi",
  "Laringoloji",
  "Lösemi ve Lenfoma",
  "Lipidoloji",
  "Lazer Cerrahisi",
  "Lenfoloji",
  // M
  "Mikrobiyoloji",
  "Moleküler Tıp",
  "Medikal Onkoloji",
  "Mikrocerrahi",
  "Meme Cerrahisi",
  "Metabolizma Hastalıkları",
  "Mikroskopi",
  // N
  "Nefroloji",
  "Nöroloji",
  "Nükleer Tıp",
  "Neonatoloji",
  "Nöroşirürji",
  "Nöroloji Hemşireliği",
  "Nöroloji Laboratuvarı",
  // O
  "Ortopedi ve Travmatoloji",
  "Onkoloji",
  "Obezite Cerrahisi",
  "Organ Nakli",
  "Odyoloji",
  "Oftalmoloji",
  "Oral Diagnoz",
  // Ö
  "Öğrenci Sağlığı",
  "Özofagus Cerrahisi",
  "Özofagus Hastalıkları",
  "Özofagoskopi",
  "Özofagial Motilite",
  "Özofagial Reflü",
  "Özofagial Tümörler",
  // P
  "Psikiyatri",
  "Patoloji",
  "Perinatoloji",
  "Pediatri",
  "Plastik, Rekonstrüktif ve Estetik Cerrahi",
  "Pulmonoloji",
  "Psikoloji",
  "Palyatif Bakım",
  // R
  "Radyoloji",
  "Romatoloji",
  "Rehabilitasyon",
  "Radyasyon Onkolojisi",
  "Ruh Sağlığı",
  "Rinoloji",
  "Rejeneratif Tıp",
  // S
  "Spor Hekimliği",
  "Sosyal Pediatri",
  "Sosyal Hizmetler",
  "Sağlık Yönetimi",
  "Sağlık Kurumları İşletmeciliği",
  "Sağlık Bilgi Sistemleri",
  "Sualtı Hekimliği ve Hiperbarik Tıp",
  // Ş
  "Şeker Hastalığı ve Endokrinoloji",
  "Şizofreni Tedavisi",
  "Şiddetli Enfeksiyonlar",
  "Şiddetli Yanık Tedavisi",
  "Şiddetli Travma Cerrahisi",
  "Şiddetli Allerji",
  "Şiddetli Astım",
  // T
  "Tıbbi Onkoloji",
  "Tıbbi Genetik",
  "Tıbbi Mikrobiyoloji",
  "Tıbbi Biyokimya",
  "Tıbbi Farmakoloji",
  "Travmatoloji",
  "Transfüzyon Tıbbı",
  "Toksikoloji",
  // U
  "Üroloji",
  "Uyku Bozuklukları",
  "Ultrasonografi",
  "Uygulamalı Fizyoloji",
  "Uygulamalı Biyokimya",
  "Uygulamalı Mikrobiyoloji",
  "Uygulamalı Genetik",
  // Ü
  "Üreme Endokrinolojisi",
  "Üst Solunum Yolu Hastalıkları",
  "Üst Ekstremite Cerrahisi",
  "Ürtiker ve Alerji",
  "Ürolojik Onkoloji",
  "Ürolojik Cerrahi",
  "Üroloji Hemşireliği",
  // V
  "Viroloji",
  "Vasküler Cerrahi",
  "Vaskülit Tedavisi",
  "Vasküler Radyoloji",
  "Vasküler Nöroloji",
  "Vasküler Onkoloji",
  "Vasküler Endokrinoloji",
  // Y
  "Yoğun Bakım",
  "Yenidoğan Yoğun Bakım",
  "Yenidoğan Cerrahisi",
  "Yenidoğan Nörolojisi",
  "Yenidoğan Kardiyolojisi",
  "Yenidoğan Enfeksiyonları",
  "Yenidoğan Genetiği",
  // Z
  "Zührevi Hastalıklar",
  "Zonklayıcı Baş Ağrısı Tedavisi",
  "Zatürre Tedavisi",
  "Zehirlenme Tedavisi",
  "Zihinsel Rehabilitasyon",
  "Zihinsel Engelliler Sağlığı",
  "Zihinsel Gelişim Bozuklukları"
];

export async function GET(request: NextRequest) {
  try {
    // Branşları API formatına çevir
    const branchesData = branches.map((branch, index) => ({
      id: index + 1,
      title: branch,
      slug: normalizeSlug(branch)
    }));

    return NextResponse.json({
      success: true,
      data: branchesData,
      message: "Branşlar başarıyla getirildi"
    });

  } catch (error: any) {
    console.error("Branches API Error:", error);
    return NextResponse.json(
      {
        error: "Branşlar getirilirken hata oluştu",
        details: error.message
      },
      { status: 500 }
    );
  }
}

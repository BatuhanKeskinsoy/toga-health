import { NextResponse } from 'next/server';

// Hastane verileri (sadece liste için gerekli veriler)
const hospitals = [
  {
    id: "hosp-001",
    slug: "memorial-hastanesi",
    name: "Memorial Hastanesi",
    type: "hospital",
    photo: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop",
    rating: 4.8,
    experience: "25 yıl",
    description: "Modern tıbbi cihazlar ve uzman kadrosu ile hizmet veren özel hastane",
    address: "Bağdat Caddesi No:123, Kadıköy/İstanbul",
    phone: "+90 216 123 45 67",
    specialties: [
      "Kardiyoloji",
      "Nöroloji", 
      "Ortopedi",
      "Onkoloji",
      "Genel Cerrahi",
      "Dahiliye"
    ]
  },
  {
    id: "hosp-002",
    slug: "acibadem-hastanesi",
    name: "Acıbadem Hastanesi",
    type: "hospital", 
    photo: "https://images.unsplash.com/photo-1519494026892-4752b94289f0?w=400&h=300&fit=crop",
    rating: 4.6,
    experience: "30 yıl",
    description: "Türkiye'nin önde gelen sağlık kuruluşlarından biri",
    address: "Atatürk Bulvarı No:789, Çankaya/Ankara",
    phone: "+90 312 456 78 90",
    specialties: [
      "Kardiyoloji",
      "Nöroloji",
      "Ortopedi", 
      "Onkoloji",
      "Çocuk Sağlığı",
      "Kadın Hastalıkları"
    ]
  }
];

export async function GET() {
  try {
    // Simüle edilmiş gecikme
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return NextResponse.json({
      success: true,
      data: hospitals
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Hastane verileri yüklenirken hata oluştu" 
      },
      { status: 500 }
    );
  }
} 
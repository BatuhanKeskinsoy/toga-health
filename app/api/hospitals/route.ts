import { NextResponse } from 'next/server';

// Hastane verileri
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
    email: "info@memorial.com",
    website: "https://www.memorial.com",
    specialties: [
      "Kardiyoloji",
      "Nöroloji", 
      "Ortopedi",
      "Onkoloji",
      "Genel Cerrahi",
      "Dahiliye"
    ],
    facilities: [
      "Acil Servis",
      "Yoğun Bakım",
      "Ameliyathane",
      "Laboratuvar",
      "Radyoloji",
      "Fizik Tedavi"
    ],
    workingHours: {
      monday: "08:00-18:00",
      tuesday: "08:00-18:00", 
      wednesday: "08:00-18:00",
      thursday: "08:00-18:00",
      friday: "08:00-18:00",
      saturday: "08:00-14:00",
      sunday: "Kapalı"
    },
    isAvailable: true,
    addresses: [
      {
        id: "addr-001",
        name: "Ana Bina",
        address: "Bağdat Caddesi No:123, Kadıköy/İstanbul",
        phone: "+90 216 123 45 67",
        isDefault: true,
        isActive: true
      },
      {
        id: "addr-002", 
        name: "Şube - Beşiktaş",
        address: "Beşiktaş Caddesi No:456, Beşiktaş/İstanbul",
        phone: "+90 212 987 65 43",
        isDefault: false,
        isActive: true
      }
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
    email: "info@acibadem.com",
    website: "https://www.acibadem.com",
    specialties: [
      "Kardiyoloji",
      "Nöroloji",
      "Ortopedi", 
      "Onkoloji",
      "Çocuk Sağlığı",
      "Kadın Hastalıkları"
    ],
    facilities: [
      "Acil Servis",
      "Yoğun Bakım",
      "Ameliyathane",
      "Laboratuvar",
      "Radyoloji",
      "Fizik Tedavi"
    ],
    workingHours: {
      monday: "07:00-19:00",
      tuesday: "07:00-19:00",
      wednesday: "07:00-19:00", 
      thursday: "07:00-19:00",
      friday: "07:00-19:00",
      saturday: "08:00-16:00",
      sunday: "Kapalı"
    },
    isAvailable: true,
    addresses: [
      {
        id: "addr-003",
        name: "Ana Bina",
        address: "Atatürk Bulvarı No:789, Çankaya/Ankara",
        phone: "+90 312 456 78 90",
        isDefault: true,
        isActive: true
      }
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
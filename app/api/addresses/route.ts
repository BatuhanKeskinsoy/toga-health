import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simüle edilmiş adres verisi
    const addressesData = {
      doctor: {
        id: "dr-001",
        name: "Dr. Ahmet Yılmaz",
        specialty: "Kardiyoloji",
        photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&crop=face",
        description: "Kardiyoloji uzmanı Dr. Ahmet Yılmaz, 15 yıllık deneyimi ile kalp sağlığı konusunda uzmanlaşmış bir doktordur."
      },
      addresses: [
        {
          id: "addr-001",
          name: "Kadıköy Şubesi",
          address: "Caferağa Mah. Moda Cad. No:123",
          city: "İstanbul",
          district: "Kadıköy",
          phone: "0216 123 45 67",
          workingHours: {
            start: "09:00",
            end: "18:00"
          },
          isActive: true,
          isDefault: true,
          coordinates: {
            lat: 40.9909,
            lng: 29.0303
          },
          features: [
            "EKG Cihazı",
            "Holter Monitör",
            "Efor Testi",
            "Parking",
            "Engelli Erişimi"
          ]
        },
        {
          id: "addr-002",
          name: "Beşiktaş Şubesi",
          address: "Sinanpaşa Mah. Beşiktaş Cad. No:456",
          city: "İstanbul",
          district: "Beşiktaş",
          phone: "0212 987 65 43",
          workingHours: {
            start: "08:00",
            end: "17:00"
          },
          isActive: true,
          isDefault: false,
          coordinates: {
            lat: 41.0422,
            lng: 29.0083
          },
          features: [
            "EKG Cihazı",
            "Holter Monitör",
            "Efor Testi",
            "Parking"
          ]
        },
        {
          id: "addr-003",
          name: "Şişli Şubesi",
          address: "Teşvikiye Mah. Abdi İpekçi Cad. No:789",
          city: "İstanbul",
          district: "Şişli",
          phone: "0212 456 78 90",
          workingHours: {
            start: "10:00",
            end: "19:00"
          },
          isActive: true,
          isDefault: false,
          coordinates: {
            lat: 41.0602,
            lng: 28.9877
          },
          features: [
            "EKG Cihazı",
            "Holter Monitör",
            "Efor Testi",
            "Parking",
            "Engelli Erişimi",
            "24/7 Acil Servis"
          ]
        },
        {
          id: "addr-004",
          name: "Bakırköy Şubesi",
          address: "Ataköy Mah. Ataköy Cad. No:321",
          city: "İstanbul",
          district: "Bakırköy",
          phone: "0212 345 67 89",
          workingHours: {
            start: "09:30",
            end: "18:30"
          },
          isActive: true,
          isDefault: false,
          coordinates: {
            lat: 40.9819,
            lng: 28.8772
          },
          features: [
            "EKG Cihazı",
            "Holter Monitör",
            "Efor Testi",
            "Parking"
          ]
        }
      ]
    };

    return NextResponse.json(addressesData);
  } catch (error) {
    console.error('Addresses API Error:', error);
    return NextResponse.json(
      { error: 'Adres bilgileri yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from "next/server";

// Örnek ülke verileri - gerçek uygulamada veritabanından gelecek
const countries = [
  { id: 223, name: "Turkiye", slug: "turkiye" },
  { id: 224, name: "Almanya", slug: "almanya" },
  { id: 225, name: "Fransa", slug: "fransa" },
  { id: 226, name: "İtalya", slug: "italya" },
  { id: 227, name: "İspanya", slug: "ispanya" },
  { id: 228, name: "Hollanda", slug: "hollanda" },
  { id: 229, name: "Belçika", slug: "belcika" },
  { id: 230, name: "Avusturya", slug: "avusturya" },
  { id: 231, name: "İsviçre", slug: "isvicre" },
  { id: 232, name: "Polonya", slug: "polonya" },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: countries,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Ülkeler yüklenirken hata oluştu",
      },
      { status: 500 }
    );
  }
} 
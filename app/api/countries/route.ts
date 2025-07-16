import { NextResponse } from "next/server";

// Örnek ülke verileri - gerçek uygulamada veritabanından gelecek
const countries = [
  { id: 1, name: "Türkiye", code: "TR" },
  { id: 2, name: "Almanya", code: "DE" },
  { id: 3, name: "Fransa", code: "FR" },
  { id: 4, name: "İtalya", code: "IT" },
  { id: 5, name: "İspanya", code: "ES" },
  { id: 6, name: "Hollanda", code: "NL" },
  { id: 7, name: "Belçika", code: "BE" },
  { id: 8, name: "Avusturya", code: "AT" },
  { id: 9, name: "İsviçre", code: "CH" },
  { id: 10, name: "Polonya", code: "PL" },
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
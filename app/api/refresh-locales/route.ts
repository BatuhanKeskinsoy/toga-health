import { NextRequest, NextResponse } from "next/server";
import { generateLocaleFiles } from "@/lib/hooks/lang/generateLocales";
import { nodeENV } from "@/constants";

export async function POST(request: NextRequest) {
  try {
    // Vercel'de fs kullanımı yasak, sadece development'ta çalışır
    if (nodeENV === 'production') {
      return NextResponse.json({ 
        success: true, 
        message: "Production ortamında locale dosyaları build-time'da oluşturulur" 
      });
    }

    await generateLocaleFiles();
    
    return NextResponse.json({ 
      success: true, 
      message: "Locale dosyaları başarıyla güncellendi" 
    });
  } catch (error) {
    console.error("Locale güncelleme hatası:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Bilinmeyen hata" 
      },
      { status: 500 }
    );
  }
} 
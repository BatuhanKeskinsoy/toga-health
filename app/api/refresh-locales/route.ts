import { NextRequest, NextResponse } from "next/server";
import { generateLocaleFiles } from "@/lib/utils/lang/generateLocales";

export async function POST(request: NextRequest) {
  try {
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
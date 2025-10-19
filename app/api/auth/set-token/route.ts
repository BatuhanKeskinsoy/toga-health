import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json({ success: false, error: 'Token gerekli' }, { status: 400 });
    }

    // Server-side cookie set etme
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 gün
      path: '/',
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Token başarıyla kaydedildi' 
    });
  } catch (error) {
    console.error('Token kaydetme hatası:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Bilinmeyen hata' 
    }, { status: 500 });
  }
}

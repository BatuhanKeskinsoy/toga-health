import { getServerToken } from './cookies';
import { UserTypes } from '@/lib/types/user/UserTypes';
import { baseURL } from '@/constants';

/**
 * Server-side'da kullanıcı bilgilerini alır
 * Token varsa ve geçerliyse user bilgilerini döndürür
 */
export async function getServerUser(): Promise<UserTypes | null> {
  try {
    const token = await getServerToken();
    
    if (!token) {
      return null;
    }

    const apiUrl = baseURL || 'http://togaapi-new.test/api';
    
    // Server-side'da doğrudan API'ye istek at
    const response = await fetch(`${apiUrl}/user/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'force-cache', // Cache'i kullan, sadece gerektiğinde fresh data al
      next: { revalidate: 300 }, // 5 dakika cache
    });

    if (!response.ok) {
      if (response.status === 401) {
        return null;
      }
      console.error('Server-side: API hatası:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    
    // API yanıtı data.data formatında geliyor
    const user = data.data;
    
    return user || null;
  } catch (error) {
    console.error('Server user alma hatası:', error);
    return null;
  }
}

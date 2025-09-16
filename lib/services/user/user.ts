import { api } from '@/lib/axios';
import { UserTypes } from '@/lib/types/user/UserTypes';

export async function getUserProfile(): Promise<UserTypes | null> {
  try {
    const response = await api.get('/user/profile');
    return response.data.data;
  } catch (error: any) {
    // 401 hatası normal (kullanıcı giriş yapmamış)
    if (error?.response?.status === 401) {
      return null;
    }
    console.error('Server user fetch hatası:', error);
    return null;
  }
}
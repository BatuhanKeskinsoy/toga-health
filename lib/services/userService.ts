import { createServerAxios } from '@/lib/axios';
import { getToken } from '@/lib/utils/cookies';
import { UserTypes } from '@/lib/types/user/UserTypes';

export async function getServerUser(): Promise<UserTypes | null> {
  try {
    const token = await getToken();
    if (!token) return null;

    const serverAxios = await createServerAxios();
    const response = await serverAxios.get('/user/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data.user;
  } catch (error) {
    console.error('Server user fetch hatası:', error);
    return null;
  }
}

export async function isUserAuthenticated(): Promise<boolean> {
  const token = await getToken();
  return !!token;
}

// Server-side user data ile birlikte token bilgisini de döndür
export async function getServerUserWithToken(): Promise<{
  user: UserTypes | null;
  token: string | null;
  isAuthenticated: boolean;
}> {
  try {
    const token = await getToken();
    if (!token) {
      return {
        user: null,
        token: null,
        isAuthenticated: false,
      };
    }

    const serverAxios = await createServerAxios();
    const response = await serverAxios.get('/user/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return {
      user: response.data.user,
      token,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error('Server user fetch hatası:', error);
    return {
      user: null,
      token: null,
      isAuthenticated: false,
    };
  }
}

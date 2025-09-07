import { getServerUser, isUserAuthenticated } from '@/lib/services/userService';
import { UserTypes } from '@/lib/types/user/UserTypes';

// Server-side user data fetching için hook
export async function useServerUser(): Promise<{
  user: UserTypes | null;
  isAuthenticated: boolean;
}> {
  try {
    const isAuthenticated = await isUserAuthenticated();
    const user = isAuthenticated ? await getServerUser() : null;
    
    return {
      user,
      isAuthenticated,
    };
  } catch (error) {
    console.error('Server user fetch hatası:', error);
    return {
      user: null,
      isAuthenticated: false,
    };
  }
}

// Server-side component'lerde kullanım için
export async function getServerUserData(): Promise<{
  user: UserTypes | null;
  isAuthenticated: boolean;
}> {
  return useServerUser();
}

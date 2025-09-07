"use client";
import { useEffect, useState, useCallback } from "react";
import { UserTypes } from "@/lib/types/user/UserTypes";
import { api } from "@/lib/axios";

interface UseUserProps {
  serverUser?: UserTypes | null;
}

interface UseUserReturn {
  user: UserTypes | null;
  isLoading: boolean;
  isError: boolean;
  updateUser: (newUser: UserTypes | null) => void;
  clearUser: () => void;
  refetchUser: () => Promise<void>;
}

/**
 * User Hook - Tüm user state yönetimini tek yerden yapar
 * 
 * Bu hook:
 * 1. Server-side'dan gelen user'ı alır
 * 2. PusherContext ile real-time güncellemeleri yönetir
 * 3. Client-side state değişikliklerini handle eder
 * 4. API çağrıları ile user'ı günceller
 */
export function useUser({ serverUser }: UseUserProps = {}): UseUserReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [clientUser, setClientUser] = useState<UserTypes | null>(null);
  
  // Öncelik sırası: Client user > Server user
  const user = clientUser || serverUser;

  // User'ı güncellemek için
  const updateUser = useCallback((newUser: UserTypes | null) => {
    setClientUser(newUser);
  }, []);

  // User'ı temizlemek için
  const clearUser = useCallback(() => {
    setClientUser(null);
  }, []);

  // API'den user'ı yeniden çekmek için
  const refetchUser = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setIsError(false);
    
    try {
      const response = await api.get('/user/profile');
      if (response.data.user) {
        updateUser(response.data.user);
      }
    } catch (error: any) {
      console.error("User: User fetch hatası:", error);
      setIsError(true);
      
      if (error?.response?.status === 401) {
        clearUser();
      }
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, updateUser, clearUser]);

  // Server user değiştiğinde client state'ini senkronize et
  useEffect(() => {
    if (serverUser && !clientUser) {
      setClientUser(serverUser);
    }
    // Server user null ise client user'ı da temizle
    if (!serverUser && clientUser) {
      setClientUser(null);
    }
  }, [serverUser, clientUser]);

  return {
    user,
    isLoading,
    isError,
    updateUser,
    clearUser,
    refetchUser,
  };
}
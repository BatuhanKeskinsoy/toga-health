"use client";
import { useEffect, useState, useCallback } from "react";
import { UserTypes } from "@/lib/types/user/UserTypes";
import { api } from "@/lib/axios";
import { usePusherContext } from "@/lib/context/PusherContext";

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
  const { updateServerUser, serverUser: contextServerUser } = usePusherContext();
  
  // Öncelik sırası: Client user > Context server user
  const user = clientUser || contextServerUser;

  // User'ı güncellemek için
  const updateUser = useCallback((newUser: UserTypes | null) => {
    setClientUser(newUser);
    updateServerUser(newUser);
  }, [updateServerUser]);

  // User'ı temizlemek için
  const clearUser = useCallback(() => {
    setClientUser(null);
    updateServerUser(null);
  }, [updateServerUser]);

  // API'den user'ı yeniden çekmek için
  const refetchUser = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setIsError(false);
    
    try {
      const response = await api.get('/user/profile');
      if (response.data.data) {
        updateUser(response.data.data);
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
    // Context server user'ı öncelikli olarak takip et
    const activeServerUser = contextServerUser;
    
    console.log("🔄 useUser: Server user değişikliği tespit edildi:", {
      contextServerUser: contextServerUser?.id,
      serverUser: serverUser?.id,
      activeServerUser: activeServerUser?.id,
      clientUser: clientUser?.id
    });
    
    // Server user varsa ve client user yoksa veya farklıysa güncelle
    if (activeServerUser && (!clientUser || clientUser.id !== activeServerUser.id)) {
      console.log("🔄 useUser: Client user güncelleniyor:", activeServerUser);
      setClientUser(activeServerUser);
    }
    // Server user null ise ve client user varsa temizle
    if (!activeServerUser && clientUser) {
      console.log("🔄 useUser: Client user temizleniyor");
      setClientUser(null);
    }
  }, [contextServerUser]);

  return {
    user,
    isLoading,
    isError,
    updateUser,
    clearUser,
    refetchUser,
  };
}
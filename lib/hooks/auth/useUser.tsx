"use client";
import { useEffect, useState } from "react";
import { UserTypes } from "@/lib/types/user/UserTypes";

// Bu hook artık kullanılmıyor, PusherContext kullanılıyor
// Geriye dönük uyumluluk için bırakıldı
export function useUser() {
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<UserTypes | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // User'ı güncellemek için mutate fonksiyonu
  const mutateUser = (newUser: UserTypes | null, options?: any) => {
    if (newUser) {
      setUser(newUser);
    } else {
      setUser(null);
    }
  };

  return {
    user,
    isLoading: false, // Artık loading yok, server-side'dan geliyor
    isError: false, // Artık error yok, server-side'dan geliyor
    mutateUser,
  };
}

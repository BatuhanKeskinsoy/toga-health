"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/hooks/auth/useUser";
import { getGeneralSettings } from "@/lib/utils/getGeneralSettings";
import { GeneralSettings } from "@/lib/types/generalsettings/generalsettingsTypes";

interface ProfileAuthWrapperProps {
  children: React.ReactNode;
}

export default function ProfileAuthWrapper({ children }: ProfileAuthWrapperProps) {
  const { user, isLoading, isError } = useUser();
  const router = useRouter();
  const [generals, setGenerals] = useState<GeneralSettings | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const fetchGenerals = async () => {
      try {
        const generalsData = await getGeneralSettings();
        setGenerals(generalsData);
      } catch (error) {
        console.error("Generals bilgisi alınamadı:", error);
      }
    };
    
    fetchGenerals();
  }, []);

  useEffect(() => {

    if (isClient && !isLoading) {
      const token = localStorage.getItem("token");
      
      if (!token) {
        router.push("/");
        return;
      }

      if (!user) {
        router.push("/");
        return;
      }
    }
  }, [user, isLoading, isClient, router, isError]);

  // Client-side'a geçene kadar veya loading durumunda hiçbir şey render etme
  if (!isClient || isLoading) {
    return null;
  }

  // Kullanıcı yoksa hiçbir şey render etme (yönlendirme yapılacak)
  if (!user) {
    return null;
  }

  // Kullanıcı varsa children'ı render et
  return <>{children}</>;
} 
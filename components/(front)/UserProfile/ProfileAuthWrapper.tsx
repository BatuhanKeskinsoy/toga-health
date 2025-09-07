"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/hooks/auth/useUser";
import { getGeneralSettings } from "@/lib/utils/getGeneralSettings";
import { GeneralSettings } from "@/lib/types/generalsettings/generalsettingsTypes";
import { getClientToken } from "@/lib/utils/cookies";

import { UserTypes } from "@/lib/types/user/UserTypes";

interface ProfileAuthWrapperProps {
  children: React.ReactNode;
  user: UserTypes | null;
}

export default function ProfileAuthWrapper({ children, user: serverUser }: ProfileAuthWrapperProps) {
  const { user: clientUser, isLoading, isError } = useUser();
  const router = useRouter();
  const [generals, setGenerals] = useState<GeneralSettings | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Server-side user'ı öncelikle kullan, yoksa client-side user'ı kullan
  const user = serverUser || clientUser;

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
      const token = getClientToken();
      
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

  // Server-side user varsa hemen render et, yoksa client-side loading'i bekle
  if (!serverUser && (!isClient || isLoading)) {
    return null;
  }

  // Kullanıcı yoksa hiçbir şey render etme (yönlendirme yapılacak)
  if (!user) {
    return null;
  }

  // Kullanıcı varsa children'ı render et
  return <>{children}</>;
} 
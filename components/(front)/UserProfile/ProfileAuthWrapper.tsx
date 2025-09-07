"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSWRUser } from "@/lib/hooks/auth/useSWRUser";
import { usePusherContext } from "@/lib/context/PusherContext";
import { getGeneralSettings } from "@/lib/utils/getGeneralSettings";
import { GeneralSettings } from "@/lib/types/generalsettings/generalsettingsTypes";
import { getClientToken } from "@/lib/utils/cookies";

import { UserTypes } from "@/lib/types/user/UserTypes";

interface ProfileAuthWrapperProps {
  children: React.ReactNode;
  user: UserTypes | null;
}

export default function ProfileAuthWrapper({ children, user: serverUser }: ProfileAuthWrapperProps) {
  const { user: swrUser } = useSWRUser();
  const { user: pusherUser } = usePusherContext();
  const router = useRouter();
  const [generals, setGenerals] = useState<GeneralSettings | null>(null);
  const [isClient, setIsClient] = useState(false);

  // SWR user'ı öncelikle kullan, yoksa PusherContext user'ı, yoksa server-side user'ı kullan
  const user = swrUser || pusherUser || serverUser;

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
    if (isClient) {
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
  }, [user, isClient, router]);

  // Client-side hazır değilse bekle
  if (!isClient) {
    return null;
  }

  // Kullanıcı yoksa hiçbir şey render etme (yönlendirme yapılacak)
  if (!user) {
    return null;
  }

  // Kullanıcı varsa children'ı render et
  return <>{children}</>;
} 
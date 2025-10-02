"use client";
import { navLinksAuthCorporate, navLinksAuthDoctor, navLinksAuthIndividual } from "@/constants";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { useLocale, useTranslations } from "next-intl";
import React, { useMemo, useState, useEffect } from "react";
import type { UserTypes } from "@/lib/types/user/UserTypes";
import { showProfessionalAccountTypeSelection } from "@/lib/functions/professionalAccountAlert";

type Props = {
  user: UserTypes | null;
};

export default function ProfileSidebar({ user }: Props) {
  const path = usePathname();
  const t = useTranslations();
  const locale = useLocale();
  const [currentPath, setCurrentPath] = useState(path);
  
  // Path değişikliklerini dinle
  useEffect(() => {
    const updatePath = () => {
      if (typeof window !== 'undefined') {
        const fullPath = window.location.pathname;
        const pathWithoutLocale = fullPath.replace(/^\/[a-z]{2}\//, '/');
        setCurrentPath(pathWithoutLocale);
      }
    };
    
    // İlk yüklemede path'i güncelle
    updatePath();
    
    // Popstate event'ini dinle (geri/ileri butonları için)
    window.addEventListener('popstate', updatePath);
    
    // Cleanup
    return () => {
      window.removeEventListener('popstate', updatePath);
    };
  }, []);
  
  // usePathname değiştiğinde de güncelle
  useEffect(() => {
    setCurrentPath(path);
  }, [path]);
  
  const isActive = (localizedUrl: string) => {
    
    // Exact match kontrolü
    if (currentPath === localizedUrl) return true;
    
    // Ana sayfa kontrolü - /profile ve /profil için sadece exact match
    // Ama önce dil çevirilerini kontrol et
    const isMainProfilePage = (localizedUrl === '/profile' || localizedUrl === '/profil') ||
                             (currentPath === '/profile' && localizedUrl === '/profil') ||
                             (currentPath === '/profil' && localizedUrl === '/profile');
    
    if (isMainProfilePage) {
      // Ana sayfa için exact match kontrolü yap
      if (currentPath === '/profile' && localizedUrl === '/profil') return true;
      if (currentPath === '/profil' && localizedUrl === '/profile') return true;
      return false; // Diğer durumlarda starts with kontrolü yapma
    }
    
    // Starts with kontrolü - Sadece alt sayfalar için
    if (currentPath.startsWith(localizedUrl + "/")) return true;
    
    // Dil farkları için kontrol - profil için yeni linkler eklenecek
    // Next.js usePathname() locale'siz path döndürüyor, bu yüzden farklı yaklaşım
    const currentPathWithoutLocale = currentPath.replace(/^\/[a-z]{2}\//, '/');
    const localizedUrlWithoutLocale = localizedUrl.replace(/^\/[a-z]{2}\//, '/');
    
    
    // Locale'siz exact match
    if (currentPathWithoutLocale === localizedUrlWithoutLocale) return true;
    
    // Locale'siz starts with
    if (currentPathWithoutLocale.startsWith(localizedUrlWithoutLocale + "/")) return true;
    
    // Yeni yaklaşım: URL'leri karşılaştırırken dil çevirilerini dikkate al
    // /profile -> /profil, /profile/messages -> /profil/mesajlarim
    const urlMappings = {
      '/profile': '/profil',
      '/profile/appointments': '/profil/randevularim',
      '/profile/messages': '/profil/mesajlarim',
      '/profile/details': '/profil/detaylar',
      // İngilizce için de mapping ekle - profil için yeni linkler eklenecek
      '/profil': '/profile',
      '/profil/randevularim': '/profile/appointments',
      '/profil/mesajlarim': '/profile/messages',
      '/profil/detaylar': '/profile/details'
    };
    
    // Tersine çeviri de ekle
    const reverseUrlMappings = Object.fromEntries(
      Object.entries(urlMappings).map(([key, value]) => [value, key])
    );
    
    // Mevcut path'i kontrol et
    const mappedPath = urlMappings[currentPath] || currentPath;
    const reverseMappedPath = reverseUrlMappings[currentPath] || currentPath;
    
    // Localized URL'i kontrol et
    const mappedLocalizedUrl = urlMappings[localizedUrlWithoutLocale] || localizedUrlWithoutLocale;
    const reverseMappedLocalizedUrl = reverseUrlMappings[localizedUrlWithoutLocale] || localizedUrlWithoutLocale;
    
    // Karşılaştırma
    if (mappedPath === localizedUrlWithoutLocale || 
        reverseMappedPath === localizedUrlWithoutLocale ||
        currentPath === mappedLocalizedUrl ||
        currentPath === reverseMappedLocalizedUrl) {
      return true;
    }
    
    // Starts with kontrolü - Sadece alt sayfalar için
    // Ana sayfa (/profile) için starts with kontrolü yapma
    if (localizedUrlWithoutLocale !== '/profil' && localizedUrlWithoutLocale !== '/profile') {
      if (mappedPath.startsWith(localizedUrlWithoutLocale + "/") ||
          reverseMappedPath.startsWith(localizedUrlWithoutLocale + "/") ||
          currentPath.startsWith(mappedLocalizedUrl + "/") ||
          currentPath.startsWith(reverseMappedLocalizedUrl + "/")) {
        return true;
      }
    }
    
    return false;
  };

  const links = useMemo(() => {
    const type = user?.user_type || "individual";
    if (type === "doctor") return navLinksAuthDoctor;
    if (type === "corporate") return navLinksAuthCorporate;
    return navLinksAuthIndividual;
  }, [user?.user_type]);

  return (
    <div className="flex flex-col gap-2">
      {/* Profesyonel Tip Seçim Butonu - Sadece individual kullanıcılar için */}
      {user?.user_type === "individual" && (
        <button
          onClick={showProfessionalAccountTypeSelection}
          className="w-full z-10 inline-flex items-center justify-center px-3 py-2.5 text-sm font-medium rounded-md bg-gradient-to-r from-red-400 to-red-600 text-white hover:from-red-500 hover:to-red-700 shadow-md transition-all duration-300"
        >
          Profesyonel Misiniz?
        </button>
      )}

      <nav className="flex flex-col bg-gray-50 xl:border xl:border-gray-200 xl:rounded-md xl:overflow-hidden overflow-y-auto max-xl:h-[calc(100dvh-124px)]">
        {links.map((link) => {
          const localized = getLocalizedUrl(link.url, locale);
          const active = isActive(localized);
          
          
          return (
            <Link
              key={link.url}
              href={localized}
              title={t(link.title)}
              className={`flex items-center gap-3 px-4 py-2.5 font-medium text-[16px] transition-all duration-200 ${
                active ? "bg-red-600 text-white" : "text-gray-700 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              {t(link.title)}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

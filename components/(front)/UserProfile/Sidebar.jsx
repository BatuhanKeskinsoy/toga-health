"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/app/hooks/useTranslation";
import {
  FaRegUser,
  FaRegListAlt,
  FaRegHeart,
  FaRegBell,
  FaRegEdit,
  FaSolarPanel,
} from "react-icons/fa";
import {
  MdOutlinePendingActions,
  MdOutlineCheckCircleOutline,
  MdOutlineVisibilityOff,
} from "react-icons/md";
import { BsChatLeftText } from "react-icons/bs";
import { MdOutlineHandshake } from "react-icons/md";

import { MdOutlineEventAvailable } from "react-icons/md";
import { useEffect } from "react";
// Varsayım: business_type bilgisini bir store'dan alıyoruz
import { getSafeUserData } from "@/app/utils/cookieUtils";

const etkinliklerSubLinks = [
  {
    href: "/hesabim/etkinlikler/etkinliklerim",
    label: "Etkinliklerim",
    icon: <MdOutlineCheckCircleOutline />,
  },
  {
    href: "/hesabim/etkinlikler/etkinlik-ekle",
    label: "Etkinlik ekle",
    icon: <MdOutlineEventAvailable />,
  },
];

const blogYazilarimSubLinks = [
  {
    href: "/hesabim/bloglar/blog-yazilarim",
    label: "Blog Yazılarım",
    icon: <FaRegEdit />,
  },
  { href: "/hesabim/bloglar/blog-ekle", label: "Blog ekle", icon: <FaRegEdit /> },
];

const ilanlarimSubLinks = [
  {
    href: "/hesabim/ilanlarim/ilan-haklarim",
    label: "İlan Haklarım",
    icon: <FaRegListAlt />,
  },
  {
    href: "/hesabim/ilanlarim/aktif",
    label: "Aktif İlanlarım",
    icon: <MdOutlineCheckCircleOutline />,
  },
  {
    href: "/hesabim/ilanlarim/onay-bekleyen",
    label: "Onay Bekleyen İlanlarım",
    icon: <MdOutlinePendingActions />,
  },
  {
    href: "/hesabim/ilanlarim/gorunmez",
    label: "Görünmez İlanlarım",
    icon: <MdOutlineVisibilityOff />,
  },
  {
    href: "/hesabim/ilanlarim/reddedilen",
    label: "Reddedilen İlanlarım",
    icon: <MdOutlineVisibilityOff />,
  },
];

const otherLinks = [
  { href: "/hesabim", label: "Hesabım", icon: <FaSolarPanel /> },
  { href: "/hesabim/ayarlarim", label: "Ayarlarım", icon: <FaRegUser /> },
  {
    href: "/hesabim/ilanlarim",
    label: "İlanlarım",
    icon: <FaRegListAlt />,
    subLinks: ilanlarimSubLinks,
  },
  {
    href: "/hesabim/mesajlarim",
    label: "Mesajlarım",
    icon: <BsChatLeftText />,
  },
  {
    href: "/hesabim/favori-ilanlarim",
    label: "Favori İlanlarım",
    icon: <FaRegHeart />,
  },
  {
    href: "/hesabim/siparislerim",
    label: "Siparişlerim",
    icon: <FaRegListAlt />,
  },
  {
    href: "/hesabim/destek-mesajlarim",
    label: "Destek Mesajlarım",
    icon: <FaRegBell />,
  },
  {
    href: "/hesabim/destek-talebi",
    label: "Destek Talebi",
    icon: <FaRegListAlt />,
  },
  {
    href: "/hesabim/etkinlikler",
    label: "Etkinlikler",
    icon: <MdOutlineEventAvailable />,
    subLinks: etkinliklerSubLinks,
  },
  {
    href: "/hesabim/bloglar",
    label: "Bloglar",
    icon: <FaRegEdit />,
    subLinks: blogYazilarimSubLinks,
  },
];

export default function Sidebar({ userInfo, listingCounts }) {
  // Translation hook'unu kullan
  const { t } = useTranslation();
  
  const pathname = usePathname();
  const userType = userInfo?.user_type;



  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const userData = getSafeUserData();
        if (userData && userData.user) {
        }
      } catch (e) {
        console.error("Error getting user data:", e);
      }
    }
  }, []);


  // İlanlarım subLinks'ini dinamik olarak oluştur
  const dynamicIlanlarimSubLinks = ilanlarimSubLinks.map(sub => ({
    ...sub,
    label: t(sub.label, sub.label),
    count: sub.href === "/hesabim/ilanlarim/aktif" ? (listingCounts?.active || 0) :
           sub.href === "/hesabim/ilanlarim/onay-bekleyen" ? (listingCounts?.pending || 0) :
           sub.href === "/hesabim/ilanlarim/gorunmez" ? (listingCounts?.invisible || 0) :
           sub.href === "/hesabim/ilanlarim/reddedilen" ? (listingCounts?.rejected || 0) : undefined
  }));

  // links dizisini oluştur - translation ile
  let links = [...otherLinks].map(link => ({
    ...link,
    label: t(link.label, link.label),
    count: link.href === "/hesabim/ilanlarim" ? (listingCounts?.total || 0) : undefined,
    subLinks: link.subLinks ? 
      (link.href === "/hesabim/ilanlarim" ? dynamicIlanlarimSubLinks : 
       link.subLinks.map(sub => ({
         ...sub,
         label: t(sub.label, sub.label)
       }))) : undefined
  }));

  // Corporate kullanıcılar için 'Kurumsal Profilim' en üstte
  if (userType === "corporate") {
    // Mesajlarım'ın index'ini bul
    const mesajlarimIndex = links.findIndex(
      (link) => link.href === "/hesabim/mesajlarim"
    );
    links.splice(mesajlarimIndex + 1, 0, {
      href: "/hesabim/kurumsal",
      label: t("Kurumsal Profilimi Güncelle", "Kurumsal Profilimi Güncelle"),
      icon: <FaRegUser />,
    });
    
    // Kurumsal profil görüntüleme linkini ekle
    if (userInfo?.slug) {
      links.splice(mesajlarimIndex + 2, 0, {
        href: `/kurumlar/${userInfo.slug}`,
        label: t("Profilimi Görüntüle", "Profilimi Görüntüle"),
        icon: <FaRegUser />,
      });
    }
    
    // Davetler linkini de ekle
    links.splice(mesajlarimIndex + 3, 0, {
      href: "/hesabim/calisanlar",
      label: t("Çalışanlar", "Çalışanlar"),
      icon: <MdOutlineHandshake />,
    });
  }

  // Individual kullanıcılar için 'Bireysel Profilim' ve 'Başvurularım' Mesajlarım altında
  if (userType === "individual") {
    // Mesajlarım'ın index'ini bul
    const mesajlarimIndex = links.findIndex(
      (link) => link.href === "/hesabim/mesajlarim"
    );
    if (mesajlarimIndex !== -1) {
      // Mesajlarım'dan sonra Bireysel Profilim'i ekle
      links.splice(mesajlarimIndex + 1, 0, {
        href: "/hesabim/bireysel",
        label: t("Bireysel Profilimi Güncelle", "Bireysel Profilimi Güncelle"),
        icon: <FaRegUser />,
      });
      
      // Bireysel profil görüntüleme linkini ekle
      if (userInfo?.slug) {
        links.splice(mesajlarimIndex + 2, 0, {
          href: `/bireysel-profiller/${userInfo.slug}`,
          label: t("Profilimi Görüntüle", "Profilimi Görüntüle"),
          icon: <FaRegUser />,
        });
      }
      
      // Başvurularım linkini ekle
      links.splice(mesajlarimIndex + 3, 0, {
        href: "/hesabim/basvurularim",
        label: t("Başvurularım", "Başvurularım"),
        icon: <MdOutlineHandshake />,
      });
    }
  }

  return (
    <nav className="flex flex-col bg-gray-50 lg:border lg:border-gray-200 lg:rounded-md lg:sticky top-24 lg:overflow-hidden overflow-y-auto max-lg:h-[calc(100dvh-124px)]">
      {links.map((link) => (
        <div key={link.href}>
          <Link
            href={link.href}
            className={`flex items-center gap-3 px-4 py-2.5 font-medium text-[16px] transition-all duration-200 ${
              pathname === link.href ||
              (link.href === "/hesabim/ilanlarim" && pathname.startsWith("/hesabim/ilanlarim")) ||
              (link.href === "/hesabim/bloglar" && pathname.startsWith("/hesabim/bloglar")) ||
              (link.href === "/hesabim/etkinlikler" && pathname.startsWith("/hesabim/etkinlikler")) ||
              (link.href === "/hesabim/basvurularim" && pathname.startsWith("/hesabim/basvurularim")) ||
              (link.subLinks &&
                link.subLinks.some((sub) => pathname === sub.href)) ||
              (link.subLinks &&
                link.subLinks.some((sub) => pathname.includes(sub.href))) ||
              (link.subLinks &&
                link.subLinks.some((sub) => pathname.startsWith(sub.href)))
                ? "bg-orange-500 text-white"
                : "text-gray-700 hover:bg-orange-50 hover:text-orange-500"
            }`}
          >
            <span className="text-base min-w-4">{link.icon}</span>
            <span className="flex items-center gap-2">
              {link.label}
              {link.count !== undefined && link.count >= 0 && (
                <span className="text-sm opacity-75">({link.count})</span>
              )}
            </span>
          </Link>
          {/* Eğer alt linkler varsa (sadece İlanlarım için) */}
          {link.subLinks && (
            <div className="flex flex-col">
              {link.subLinks.map((sub) => (
                <Link
                  key={sub.href}
                  href={sub.href}
                  className={`flex items-center gap-2 pl-12 pr-2 py-1.5 transition-all duration-200 text-[14px] ${
                    pathname === sub.href || pathname.includes(sub.href)
                      ? "bg-orange-50 text-orange-500"
                      : "text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                  }`}
                >
                  <span>{sub.label}</span>
                  {sub.count !== undefined && sub.count >= 0 && (
                    <span className="text-xs opacity-75">({sub.count})</span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}

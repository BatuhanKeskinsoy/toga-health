import { useTranslations } from "next-intl";
import { IoCalendarOutline, IoHomeOutline, IoPersonOutline } from "react-icons/io5";

export const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
export const siteURL = process.env.NEXT_PUBLIC_SITE_URL;
export const baseURL = process.env.NEXT_PUBLIC_API_BASEURL;
  const t = useTranslations();

export const navLinksAuthIndividual = [
  {
    title: t("Profilim"),
    url: "/profilim",
  },
  {
    title: "Randevularım",
    url: "/profilim/randevular",
  },
  {
    title: "Bildirimlerim",
    url: "/profilim/bildirimler",
  },
];

export const navLinksAuthExpertProvider = [
  {
    name: "UZMAN GENEL",
    links: [
      {
        icon: <IoHomeOutline />,
                title: "Raporlar",
        url: "/panel",
      },
    ],
  },
  {
    name: "RANDEVULAR",
    links: [
      {
        icon: <IoCalendarOutline />,
        title: "Randevu Takvimi",
        url: "/panel/randevular",
      },
      {
        icon: <IoCalendarOutline />,
        title: "TEST",
        url: "/panel/randevular",
      },
    ],
  },
  {
    name: "PROFİL",
    links: [
      {
        icon: <IoPersonOutline />,
        title: "Profil",
        url: "/panel/profil",
      },
    ],
  },
];

export const navLinksAuthCorporateProvider = [
  {
    name: "KURUM GENEL",
    links: [
      {
        icon: <IoHomeOutline />,
                title: "Raporlar",
        url: "/panel",
      },
    ],
  },
  {
    name: "RANDEVULAR",
    links: [
      {
        icon: <IoCalendarOutline />,
        title: "Randevu Takvimi",
        url: "/panel/randevular",
      },
      {
        icon: <IoCalendarOutline />,
        title: "TEST",
        url: "/panel/randevular",
      },
    ],
  },
  {
    name: "PROFİL",
    links: [
      {
        icon: <IoPersonOutline />,
        title: "Profil",
        url: "/panel/profil",
      },
    ],
  },
];

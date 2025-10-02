import {
  IoCalendarOutline,
  IoHomeOutline,
  IoPersonOutline,
} from "react-icons/io5";

export const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
export const siteURL = process.env.NEXT_PUBLIC_SITE_URL;
export const baseURL = process.env.NEXT_PUBLIC_API_BASEURL;
export const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
export const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

export const navLinksAuthIndividual = [
  {
    title: "Profil",
    url: "/profile",
  },
  {
    title: "Randevularım",
    url: "/profile/appointments",
  },
  {
    title: "Mesajlarım",
    url: "/profile/messages",
  },
  // Yeni profile sayfaları buraya eklenecek - profil için yeni linkler eklenecek
  // Örnek:
  // {
  //   title: "Ayarlarım",
  //   url: "/profile/settings",
  // },
];

export const navLinksAuthDoctor = [
  {
    title: "Profil",
    url: "/profile",
  },
  {
    title: "Profil Detayları",
    url: "/profile/details",
  },
  {
    title: "Randevularım",
    url: "/profile/appointments",
  },
  {
    title: "Mesajlarım",
    url: "/profile/messages",
  },
  // Yeni profile sayfaları buraya eklenecek - profil için yeni linkler eklenecek
];

export const navLinksAuthCorporate = [
  {
    title: "Profil",
    url: "/profile",
  },
  {
    title: "Profil Detayları",
    url: "/profile/details",
  },
  {
    title: "Randevularım",
    url: "/profile/appointments",
  },
  {
    title: "Mesajlarım",
    url: "/profile/messages",
  },
  // Yeni profile sayfaları buraya eklenecek - profil için yeni linkler eklenecek
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

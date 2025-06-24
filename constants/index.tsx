import {
  IoCalendarOutline,
  IoHomeOutline,
  IoPersonOutline,
} from "react-icons/io5";

export const siteName = "TogaHealth";
export const siteURL = process.env.NEXT_PUBLIC_SITE_URL;
export const baseURL = process.env.NEXT_PUBLIC_API_BASEURL;
export const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
export const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

export const navLinksAuthIndividual = [
  {
    title: "Profilim",
    url: "/profile",
  },
  {
    title: "Randevularım",
    url: "/profile/appointments",
  },
  {
    title: "Bildirimlerim",
    url: "/profile/notifications",
  },
  {
    title: "Mesajlarım",
    url: "/profile/messages",
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

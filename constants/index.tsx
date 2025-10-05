import {
  IoCalendarOutline,
  IoHomeOutline,
  IoChatboxEllipsesOutline,
  IoInformationCircleOutline,
} from "react-icons/io5";

export const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
export const siteURL = process.env.NEXT_PUBLIC_SITE_URL;
export const baseURL = process.env.NEXT_PUBLIC_API_BASEURL;
export const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
export const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

export const navLinksAuthIndividual = [
  {
    name: "GENEL",
    links: [
      {
        icon: <IoHomeOutline />,
        title: "Profil",
        url: "/profile",
      },
    ],
  },
  {
    name: "RANDEVULAR",
    links: [
      {
        icon: <IoCalendarOutline />,
        title: "Randevularım",
        url: "/profile/appointments",
      },
    ],
  },
  {
    name: "İLETİŞİM",
    links: [
      {
        icon: <IoChatboxEllipsesOutline />,
        title: "Mesajlarım",
        url: "/profile/messages",
      },
    ],
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
    name: "DOKTOR GENEL",
    links: [
      {
        icon: <IoHomeOutline />,
        title: "Profil",
        url: "/profile",
      },
      {
        icon: <IoInformationCircleOutline />,
        title: "Profil Detayları",
        url: "/profile/details",
      },
    ],
  },
  {
    name: "RANDEVULAR",
    links: [
      {
        icon: <IoCalendarOutline />,
        title: "Randevularım",
        url: "/profile/appointments",
      },
    ],
  },
  {
    name: "İLETİŞİM",
    links: [
      {
        icon: <IoChatboxEllipsesOutline />,
        title: "Mesajlarım",
        url: "/profile/messages",
      },
    ],
  },
];

export const navLinksAuthCorporate = [
  {
    name: "KURUM GENEL",
    links: [
      {
        icon: <IoHomeOutline />,
        title: "Profil",
        url: "/profile",
      },
      {
        icon: <IoInformationCircleOutline />,
        title: "Profil Detayları",
        url: "/profile/details",
      },
    ],
  },
  {
    name: "RANDEVULAR",
    links: [
      {
        icon: <IoCalendarOutline />,
        title: "Randevularım",
        url: "/profile/appointments",
      },
    ],
  },
  {
    name: "İLETİŞİM",
    links: [
      {
        icon: <IoChatboxEllipsesOutline />,
        title: "Mesajlarım",
        url: "/profile/messages",
      },
    ],
  },
];


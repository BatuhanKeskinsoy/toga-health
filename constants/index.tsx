import {
  IoCalendarOutline,
  IoHomeOutline,
  IoChatbubblesOutline,
  IoChatbubbleEllipsesOutline,
  IoPersonOutline,
  IoFitnessOutline,
  IoCardOutline,
} from "react-icons/io5";

export const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
export const siteURL = process.env.NEXT_PUBLIC_SITE_URL;
export const baseURL = process.env.NEXT_PUBLIC_API_BASEURL;
export const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
export const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
export const nodeENV = process.env.NEXT_PUBLIC_NODE_ENV;

export const navLinksAuthIndividual = [
  {
    icon: <IoHomeOutline />,
    title: "Profil",
    url: "/profile",
  },
  {
    icon: <IoCalendarOutline />,
    title: "Randevular",
    url: "/profile/appointments",
  },
  {
    icon: <IoChatbubblesOutline />,
    title: "Mesajlar",
    url: "/profile/messages",
  },
  {
    icon: <IoCardOutline />,
    title: "Ödemeler",
    url: "/profile/payments",
  },
];

export const navLinksAuthDoctor = [
  {
    icon: <IoHomeOutline />,
    title: "Profil",
    url: "/profile",
    sublinks: [
      {
        title: "Profil Detayları",
        url: "/profile/details",
      },
      {
        title: "Adresler",
        url: "/profile/addresses",
      },
      {
        title: "Galeri",
        url: "/profile/gallery",
      },
      {
        title: "Servisler",
        url: "/profile/services",
      },
    ],
  },
  {
    icon: <IoCalendarOutline />,
    title: "Randevular",
    url: "/profile/appointments",
  },
  {
    icon: <IoChatbubblesOutline />,
    title: "Mesajlar",
    url: "/profile/messages",
  },
  {
    icon: <IoChatbubbleEllipsesOutline />,
    title: "Yorumlar",
    url: "/profile/comments",
  },
  {
    icon: <IoCardOutline />,
    title: "Ödemeler",
    url: "/profile/payments",
  },
];

export const navLinksAuthCorporate = [
  {
    icon: <IoHomeOutline />,
    title: "Profil",
    url: "/profile",
    sublinks: [
      {
        title: "Profil Detayları",
        url: "/profile/details",
      },
      {
        title: "Galeri",
        url: "/profile/gallery",
      },
      {
        title: "Servisler",
        url: "/profile/services",
      },
    ],
  },
  {
    icon: <IoFitnessOutline />,
    title: "Doktorlar",
    url: "/profile/doctors",
  },
  {
    icon: <IoChatbubblesOutline />,
    title: "Mesajlar",
    url: "/profile/messages",
  },
  {
    icon: <IoChatbubbleEllipsesOutline />,
    title: "Yorumlar",
    url: "/profile/comments",
  },
];
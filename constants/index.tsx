import {
  IoCalendarOutline,
  IoHomeOutline,
  IoChatbubblesOutline,
  IoChatbubbleEllipsesOutline,
  IoPersonOutline,
  IoFitnessOutline,
} from "react-icons/io5";

export const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
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
    title: "Randevularım",
    url: "/profile/appointments",
  },
  {
    icon: <IoChatbubblesOutline />,
    title: "Mesajlarım",
    url: "/profile/messages",
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
        title: "Adreslerim",
        url: "/profile/addresses",
      },
      {
        title: "Galeri",
        url: "/profile/gallery",
      },
      {
        title: "Servislerim",
        url: "/profile/services",
      },
    ],
  },
  {
    icon: <IoCalendarOutline />,
    title: "Randevularım",
    url: "/profile/appointments",
  },
  {
    icon: <IoChatbubblesOutline />,
    title: "Mesajlarım",
    url: "/profile/messages",
  },
  {
    icon: <IoChatbubbleEllipsesOutline />,
    title: "Yorumlarım",
    url: "/profile/comments",
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
        title: "Servislerim",
        url: "/profile/services",
      },
    ],
  },
  {
    icon: <IoCalendarOutline />,
    title: "Randevularım",
    url: "/profile/appointments",
  },
  {
    icon: <IoChatbubblesOutline />,
    title: "Mesajlarım",
    url: "/profile/messages",
  },
  {
    icon: <IoChatbubbleEllipsesOutline />,
    title: "Yorumlarım",
    url: "/profile/comments",
  },
  {
    icon: <IoFitnessOutline />,
    title: "Doktorlar",
    url: "/profile/doctors",
  },
];

"use client";
import React, {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from "react";

import { Country, City, District } from "@/lib/types/locations/locationsTypes";

interface Location {
  country: Country | null;
  city: City | null;
  district: District | null;
}

interface ProvidersSidebarData {
  diseaseSlug?: string;
  country?: string;
  city?: string;
  district?: string;
  categoryType?: "diseases" | "branches" | "treatments-services";
  diseases?: Array<{
    id: number;
    name: string;
    title: string;
    slug: string;
  }>;
  branches?: Array<{
    id: number;
    name: string;
    title: string;
    slug: string;
  }>;
  treatmentsServices?: Array<{
    id: number;
    name: string;
    title: string;
    slug: string;
  }>;
  countries?: Country[];
  cities?: City[];
  districts?: District[];
  locale?: string;
  currentPath: string;
}

interface IContextProps {
  isMobile: boolean;
  setIsMobile: Dispatch<SetStateAction<boolean>>;
  sidebarStatus: string;
  setSidebarStatus: Dispatch<SetStateAction<string>>;
  locale: string;
  setLocale: Dispatch<SetStateAction<string>>;
  location: Location;
  setLocation: Dispatch<SetStateAction<Location>>;
  providersSidebarData: ProvidersSidebarData | null;
  setProvidersSidebarData: Dispatch<SetStateAction<ProvidersSidebarData | null>>;
}

const GlobalContext = createContext<IContextProps>({
  isMobile: false,
  setIsMobile: () => {},
  sidebarStatus: "",
  setSidebarStatus: () => {},
  locale: "en",
  setLocale: () => {},
  location: {
    country: null,
    city: null,
    district: null
  },
  setLocation: () => {},
  providersSidebarData: null,
  setProvidersSidebarData: () => {},
});

interface GlobalContextProviderProps {
  children: React.ReactNode;
  locale?: string;
  initialLocation?: Location;
}

export const GlobalContextProvider = ({
  children,
  locale: initialLocale = "en",
  initialLocation = {
    country: null,
    city: null,
    district: null
  }
}: GlobalContextProviderProps) => {
  const [sidebarStatus, setSidebarStatus] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [locale, setLocale] = useState(initialLocale);
  const [location, setLocation] = useState<Location>(initialLocation);
  const [providersSidebarData, setProvidersSidebarData] = useState<ProvidersSidebarData | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Sidebar açık olduğunda body scroll'unu kapat
  useEffect(() => {
    if (sidebarStatus !== "") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarStatus]);

  return (
    <GlobalContext.Provider
      value={{
        isMobile,
        setIsMobile,
        sidebarStatus,
        setSidebarStatus,
        locale,
        setLocale,
        location,
        setLocation,
        providersSidebarData,
        setProvidersSidebarData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
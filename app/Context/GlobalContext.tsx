"use client";
import React, {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from "react";

interface Location {
  country: {
    id: number;
    name: string;
    slug: string;
  } | null;
  city: {
    id: number;
    name: string;
    slug: string;
    countrySlug: string;
  } | null;
  district: {
    id: number;
    name: string;
    slug: string;
    citySlug: string;
  } | null;
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
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
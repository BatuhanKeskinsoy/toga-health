"use client";
import React, {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from "react";

interface IContextProps {
  isMobile: boolean;
  setIsMobile: Dispatch<SetStateAction<boolean>>;
  sidebarStatus: string;
  setSidebarStatus: Dispatch<SetStateAction<string>>;
  locale: string;
  setLocale: Dispatch<SetStateAction<string>>;
}

const GlobalContext = createContext<IContextProps>({
  isMobile: false,
  setIsMobile: () => {},
  sidebarStatus: "",
  setSidebarStatus: () => {},
  locale: "en",
  setLocale: () => {},
});

interface GlobalContextProviderProps {
  children: React.ReactNode;
  locale?: string;
}

export const GlobalContextProvider = ({
  children,
  locale: initialLocale = "en",
}: GlobalContextProviderProps) => {
  const [sidebarStatus, setSidebarStatus] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [locale, setLocale] = useState(initialLocale);

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
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
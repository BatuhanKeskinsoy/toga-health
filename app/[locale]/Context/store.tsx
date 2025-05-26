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
}

const GlobalContext = createContext<IContextProps>({
  isMobile: false,
  setIsMobile: (): boolean => false,
  sidebarStatus: "" /* Auth, MobileMenu */,
  setSidebarStatus: (): string => "",
});

export const GlobalContextProvider = ({ children }: any) => {
  const [sidebarStatus, setSidebarStatus] = useState("");
  const [isMobile, setIsMobile] = useState(false);

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
    <body className={`${sidebarStatus !== "" ? "noScroll" : ""}`}>
      <GlobalContext.Provider
        value={{
          isMobile,
          setIsMobile,
          sidebarStatus,
          setSidebarStatus,
        }}
      >
        {children}
      </GlobalContext.Provider>
    </body>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);

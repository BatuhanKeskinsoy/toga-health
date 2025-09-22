"use client"
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useGlobalContext } from "@/app/Context/GlobalContext";
import CustomButton from "@/components/others/CustomButton";
import { IoCloseOutline } from "react-icons/io5";
import { useTranslations } from "next-intl";
import { useBodyScroll } from "@/lib/hooks/useBodyScroll";
import Notification from "@/components/(front)/Inc/Sidebar/Notification/Notification";
import Lang from "@/components/(front)/Inc/Sidebar/Lang/Lang";
import ProvidersSidebarContent from "@/components/(front)/Provider/Providers/ProbidersSidebar/ProvidersSidebarContent";
import Auth from "@/components/(front)/Inc/Sidebar/Auth/Auth";

function Sidebar() {
  const t = useTranslations();
  const { sidebarStatus, setSidebarStatus, locale, providersSidebarData } = useGlobalContext();

  const isVisible = useMemo(() => sidebarStatus !== "", [sidebarStatus]);

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useBodyScroll(isVisible);

  useEffect(() => {
    if (isVisible) {
      setOverlayVisible(true);
      const timeout = setTimeout(() => {
        setSidebarVisible(true);
      }, 250);
      return () => clearTimeout(timeout);
    } else {
      setSidebarVisible(false);
      const timeout = setTimeout(() => {
        setOverlayVisible(false);
      }, 250);
      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  const sidebarBaseClasses = useMemo(
    () =>
      "bg-white fixed top-0 h-screen lg:w-[500px] w-[calc(100vw-15%)] shadow-lg shadow-gray-600 transition-transform duration-300 ease-in-out z-20",
    []
  );

  const sidebarPosition = useMemo(() => {
    if (sidebarStatus === "MobileMenu") {
      return sidebarVisible
        ? "ltr:left-0 rtl:right-0 ltr:translate-x-0 rtl:-translate-x-0"
        : "ltr:left-0 rtl:right-0 ltr:-translate-x-full rtl:translate-x-full";
    } else {
      return sidebarVisible
        ? "ltr:right-0 rtl:left-0 ltr:translate-x-0 rtl:-translate-x-0"
        : "ltr:right-0 rtl:left-0 ltr:translate-x-full rtl:-translate-x-full";
    }
  }, [sidebarStatus, sidebarVisible]);

  const handleClose = useCallback(() => {
    setSidebarStatus("");
  }, [setSidebarStatus]);

  const renderContent = useMemo(() => {
    switch (sidebarStatus) {
      case "Auth":
        return <Auth />;
      case "Lang":
        return <Lang />;
      case "Notification":
        return <Notification />;
      case "Message":
        return <Notification />; // MESAJLAR YAPILINCA DEĞİŞECEK
      case "Filter":
        if (!providersSidebarData) return null;
        return <ProvidersSidebarContent {...providersSidebarData} />;
      default:
        return null;
    }
  }, [sidebarStatus]);

  return (
    <div
      className={`fixed w-screen h-screen z-20 top-0 ${
        overlayVisible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      } transition-opacity duration-300`}
    >
      <div
        className={`bg-gray-900/70 w-full h-full absolute inset-0 transition-opacity duration-300 ${
          overlayVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      />

      <div className={`${sidebarBaseClasses} ${sidebarPosition}`}>
        <div className="flex flex-col w-full h-full">
          <div className="flex justify-between items-center border-b border-gray-200 lg:px-8 px-4 py-5">
            <div className="text-xl">
              {sidebarStatus === "Auth"
                ? t("Profil")
                : sidebarStatus === "Lang"
                ? t("Dil Seçimi")
                : sidebarStatus === "Notification"
                ? t("Bildirimlerim")
                : sidebarStatus === "Message"
                ? t("Mesajlarım")
                : sidebarStatus === "Filter"
                ? t("Filtreler")
                : null}
            </div>
            <CustomButton
              leftIcon={
                <IoCloseOutline className="text-4xl transition-all duration-300 hover:text-red-500 hover:scale-125" />
              }
              handleClick={handleClose}
            />
          </div>
          {renderContent}
        </div>
      </div>
    </div>
  );
}

export default React.memo(Sidebar);

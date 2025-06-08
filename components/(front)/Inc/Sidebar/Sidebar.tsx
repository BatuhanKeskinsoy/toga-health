import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/app/Context/store";
import CustomButton from "@/components/others/CustomButton";
import { IoCloseOutline } from "react-icons/io5";
import Profile from "@/components/(front)/Inc/Sidebar/Auth/Profile";
import Auth from "@/components/(front)/Inc/Sidebar/Auth/Auth";
import { useTranslations } from "next-intl";
import Lang from "./Lang";

function Sidebar() {
  const t = useTranslations();
  const { sidebarStatus, setSidebarStatus } = useGlobalContext();

  const isVisible = sidebarStatus !== "";

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

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

  const sidebarBaseClasses =
    "bg-white fixed top-0 h-screen lg:w-[500px] w-[calc(100vw-15%)] shadow-lg shadow-gray-600 transition-transform duration-300 ease-in-out z-20";

  const sidebarPosition = (() => {
    if (sidebarStatus === "MobileMenu") {
      return sidebarVisible
        ? "ltr:left-0 rtl:right-0 ltr:translate-x-0 rtl:-translate-x-0"
        : "ltr:left-0 rtl:right-0 ltr:-translate-x-full rtl:translate-x-full";
    } else {
      return sidebarVisible
        ? "ltr:right-0 rtl:left-0 ltr:translate-x-0 rtl:-translate-x-0"
        : "ltr:right-0 rtl:left-0 ltr:translate-x-full rtl:-translate-x-full";
    }
  })();

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
        onClick={() => setSidebarStatus("")}
      />

      <div className={`${sidebarBaseClasses} ${sidebarPosition}`}>
        <div className="flex flex-col w-full h-full">
          <div className="flex justify-between items-center border-b border-gray-200 lg:px-8 px-4 py-5">
            <div className="text-xl">
              {sidebarStatus === "Auth" ? t("Profil") : sidebarStatus === "Lang" ? t("Dil Seçimi") : null}
            </div>
            <CustomButton
              leftIcon={
                <IoCloseOutline className="text-4xl transition-all duration-300 hover:text-red-500 hover:scale-125" />
              }
              handleClick={() => setSidebarStatus("")}
            />
          </div>
          {sidebarStatus === "Auth" ? (
            <Auth />
          ) : sidebarStatus === "Lang" ? (
            <Lang />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

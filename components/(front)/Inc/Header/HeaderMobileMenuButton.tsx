"use client";
import React from "react";
import { IoMenuOutline } from "react-icons/io5";
import { useGlobalContext } from "@/app/Context/GlobalContext";
import CustomButton from "@/components/Customs/CustomButton";

const HeaderMobileMenuButton = () => {
  const { setSidebarStatus } = useGlobalContext();

  return (
    <CustomButton
      leftIcon={
        <IoMenuOutline className="text-3xl lg:text-4xl" />
      }
      containerStyles="lg:hidden flex items-center justify-center h-10 w-10 rounded-md hover:bg-gray-100 transition-colors duration-200"
      handleClick={() => setSidebarStatus("MobileMenu")}
      aria-label="Menü"
    />
  );
};

export default HeaderMobileMenuButton;

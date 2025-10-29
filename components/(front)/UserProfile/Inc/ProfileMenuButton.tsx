"use client";
import { useGlobalContext } from "@/app/Context/GlobalContext";
import CustomButton from "@/components/Customs/CustomButton";
import { useTranslations } from "next-intl";

export default function ProfileMenuButton() {
  const { setSidebarStatus } = useGlobalContext();
  const t = useTranslations();
  
  return (
    <div className="lg:hidden w-full">
      <CustomButton
        title="Profil Menü"
        handleClick={() => setSidebarStatus("ProfileMenu")}
        containerStyles="flex items-center w-full justify-center w-12 h-12 bg-sitePrimary text-white rounded-md shadow-lg hover:bg-sitePrimary/80 transition-colors"
        leftIcon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        }
      />
    </div>
  );
}

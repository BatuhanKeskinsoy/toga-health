import React from "react";
import CustomButton from "@/components/others/CustomButton";

interface MarkAllAsReadButtonProps {
  isReadAll: boolean;
  onClick: () => void;
  isLoading?: boolean;
  t: any;
}

const MarkAllAsReadButton: React.FC<MarkAllAsReadButtonProps> = ({ isReadAll, onClick, isLoading, t }) => (
  <CustomButton
    containerStyles={`fixed bottom-0 left-0 text-sm w-full h-10 bg-sitePrimary text-white hover:bg-sitePrimary/80 transition-all duration-300 z-10 ${
      isReadAll ? "translate-y-full" : "translate-y-0"
    }`}
    title={isLoading ? t("Yükleniyor") : t("Tümünü Okundu Olarak İşaretle")}
    handleClick={onClick}
    isDisabled={isReadAll || isLoading}
  />
);

export default MarkAllAsReadButton; 
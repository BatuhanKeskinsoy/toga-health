"use client";
import CustomButton from "@/components/others/CustomButton";
import React from "react";
import { IoCloseOutline } from "react-icons/io5";

interface SelectedItemButtonProps {
  title: string;
  onClear: () => void;
}

const SelectedItemButton: React.FC<SelectedItemButtonProps> = ({
  title,
  onClear,
}) => {
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClear();
  };

  return title ? (
    <div className="flex items-center justify-center gap-0.5 py-0.5 pl-3 pr-1 rounded-md bg-sitePrimary/10 text-sitePrimary">
      <div className="text-xs select-none">{title}</div>
      <CustomButton
        handleClick={handleClear}
        containerStyles="p-1 hover:scale-125 rounded transition-all duration-300"
        leftIcon={<IoCloseOutline className="text-lg" />}
      />
    </div>
  ) : 
  <span className="text-xs select-none">Seçilmedi</span>;

};

export default SelectedItemButton;

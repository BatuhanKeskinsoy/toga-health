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

  return (
    <div className="flex items-center justify-center gap-1 py-1 pl-4 pr-2 rounded-md bg-sitePrimary/10 text-sitePrimary">
      <div className="text-sm select-none">{title}</div>
      <CustomButton
        handleClick={handleClear}
        containerStyles="p-1 hover:scale-125 rounded transition-all duration-300"
        leftIcon={<IoCloseOutline className="text-lg" />}
      />
    </div>
  );
};

export default SelectedItemButton;

"use client";
import React from "react";
import CustomButton from "@/components/Customs/CustomButton";

interface DropdownFooterProps {
  onClose: () => void;
  closeText?: string;
}

const DropdownFooter: React.FC<DropdownFooterProps> = ({ 
  onClose, 
  closeText = "Kapat" 
}) => {
  return (
    <div className="p-4 border-t border-gray-200 bg-gray-50">
      <div className="flex items-center justify-end">
        <CustomButton
          title={closeText}
          handleClick={onClose}
          containerStyles="px-3 py-1 text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md transition-colors"
        />
      </div>
    </div>
  );
};

export default DropdownFooter; 
"use client";
import React from "react";
import { IoCloseOutline } from "react-icons/io5";

interface DropdownHeaderProps {
  title: string;
  onClose: () => void;
}

const DropdownHeader: React.FC<DropdownHeaderProps> = ({ title, onClose }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 rounded-md transition-colors"
      >
        <IoCloseOutline className="text-xl text-gray-500" />
      </button>
    </div>
  );
};

export default DropdownHeader; 
"use client";
import React from "react";

interface SearchDropdownContentProps {
  isLocationSelected: boolean;
  searchTerm: string;
}

const SearchDropdownContent: React.FC<SearchDropdownContentProps> = ({
  isLocationSelected,
  searchTerm
}) => {
  return (
    <div className="w-full p-4">
      {!isLocationSelected ? (
        <div className="text-center py-8">
          <div className="text-lg font-medium text-gray-900 mb-2">
            Arama yapabilmek için lokasyon seçiniz
          </div>
          <div className="text-sm text-gray-600">
            Lütfen önce ülke ve şehir seçiniz
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-lg font-medium text-green-600 mb-2">
            Arama Yapılabilir
          </div>
          <div className="text-sm text-gray-600">
            "{searchTerm}" için arama yapılabilir
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDropdownContent; 
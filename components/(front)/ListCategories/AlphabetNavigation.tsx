"use client";
import CustomButton from "@/components/Customs/CustomButton";
import React from "react";

interface AlphabetNavigationProps {
  alphabet: string[];
  groupedDiseases: { [key: string]: any[] };
}

const AlphabetNavigation: React.FC<AlphabetNavigationProps> = ({
  alphabet,
  groupedDiseases,
}) => {
  return (
    <div className="flex text-center gap-2 overflow-x-auto pb-2">
      {alphabet.map((letter) => (
        <CustomButton
          key={letter}
          btnType="button"
          handleClick={() => {
            const el = document.getElementById(`letter-${letter}`);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
          containerStyles={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 lg:w-full max-w-[50px] cursor-pointer ${
            groupedDiseases[letter]
              ? "bg-sitePrimary/10 text-sitePrimary hover:bg-sitePrimary hover:text-white pointer-events-auto"
              : "bg-gray-200 text-gray-500 cursor-not-allowed opacity-50 pointer-events-none"
          }`}
          title={letter}
        />
      ))}
    </div>
  );
};

export default AlphabetNavigation;

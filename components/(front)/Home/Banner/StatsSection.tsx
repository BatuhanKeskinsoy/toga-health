import React from "react";
import {
  IoPeopleOutline,
  IoBusinessOutline,
  IoGlobeOutline,
} from "react-icons/io5";

interface StatsSectionProps {
  doctorsCount: number;
  hospitalsCount: number;
  countriesCount: number;
}

export default function StatsSection({
  doctorsCount,
  hospitalsCount,
  countriesCount,
}: StatsSectionProps) {
  return (
    <div className="lg:absolute lg:-bottom-12 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div
          className="relative group"
          role="article"
          aria-label="Uzman doktor sayısı"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="flex relative bg-white rounded-md p-4 gap-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <IoPeopleOutline className="text-2xl md:text-3xl text-white" />
            </div>
            <div className="flex flex-col justify-around items-start">
              <div className="text-3xl font-bold text-gray-700">
                {doctorsCount.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                Uzman Doktor Hizmet Veriyor
              </div>
            </div>
          </div>
        </div>
        <div
          className="relative group"
          role="article"
          aria-label="Uzman doktor sayısı"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-md blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="flex relative bg-white rounded-md p-4 gap-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <IoBusinessOutline className="text-2xl md:text-3xl text-white" />
            </div>
            <div className="flex flex-col justify-around items-start">
              <div className="text-3xl font-bold text-gray-700">
                {hospitalsCount.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                Hastane Hizmet Veriyor
              </div>
            </div>
          </div>
        </div>
        <div
          className="relative group"
          role="article"
          aria-label="Uzman doktor sayısı"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-violet-600 rounded-md blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="flex relative bg-white rounded-md p-4 gap-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-600 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <IoGlobeOutline className="text-2xl md:text-3xl text-white" />
            </div>
            <div className="flex flex-col justify-around items-start">
              <div className="text-3xl font-bold text-gray-700">
                {countriesCount.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                Ülkede Hizmet Veriliyor
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

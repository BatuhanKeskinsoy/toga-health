"use client";
import React from "react";
import { PopularCountry } from "@/lib/types/pages/homeTypes";
import { IoLocationOutline, IoGlobeOutline } from "react-icons/io5";

interface CountryCardProps {
  country: PopularCountry;
  maxCount: number;
}

export default function CountryCard({ country, maxCount }: CountryCardProps) {
  const percentage = Math.min((country.count / maxCount) * 100, 100);

  return (
    <article
      className="group relative h-full"
      itemScope
      itemType="https://schema.org/Country"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 group-hover:-translate-y-1 h-full flex flex-col min-h-[200px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
              <IoGlobeOutline className="text-lg text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300" itemProp="name">
                {country.country}
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                Sağlık sağlayıcıları
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-600" itemProp="additionalProperty">
              {country.count.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 font-medium">sağlayıcı</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-auto">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Sağlayıcı Sayısı</span>
            <span>{country.count.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-1000 group-hover:from-indigo-600 group-hover:to-purple-700"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </article>
  );
}

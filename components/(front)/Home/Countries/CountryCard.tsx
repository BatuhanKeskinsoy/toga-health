import React from "react";
import { PopularCountry } from "@/lib/types/pages/homeTypes";
import { IoGlobeOutline } from "react-icons/io5";

interface CountryCardProps {
  country: PopularCountry;
}

export default function CountryCard({ country }: CountryCardProps) {
  const doctorsCount = parseInt(country.doctors_count);
  const hospitalsCount = parseInt(country.company_count);
  const totalCount = doctorsCount + hospitalsCount;

  return (
    <article
      className="group relative h-full"
      itemScope
      itemType="https://schema.org/Country"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-md blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative bg-white rounded-md p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 group-hover:-translate-y-1 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 min-w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
              <IoGlobeOutline className="text-4xl text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300" itemProp="name">
                {country.country}
              </h3>
              <p className="text-base text-gray-500 font-medium">
                Sağlık sağlayıcıları
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-600" itemProp="additionalProperty">
              {totalCount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 font-medium">Sağlayıcı</div>
          </div>
        </div>
        
        {/* Combined Progress Bar */}
        <div className="mt-auto">
          <div className="flex justify-between text-sm text-gray-500 font-medium mb-2">
            <span>Doktorlar: {doctorsCount.toLocaleString()}</span>
            <span>Hastaneler: {hospitalsCount.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div className="flex h-full">
              {/* Doctors Section */}
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000 group-hover:from-blue-600 group-hover:to-blue-700"
                style={{ width: `${(doctorsCount / totalCount) * 100}%` }}
              ></div>
              {/* Hospitals Section */}
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 transition-all duration-1000 group-hover:from-green-600 group-hover:to-green-700"
                style={{ width: `${(hospitalsCount / totalCount) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

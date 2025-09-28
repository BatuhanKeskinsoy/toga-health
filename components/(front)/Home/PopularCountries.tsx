"use client";
import React from "react";
import { PopularCountry } from "@/lib/types/pages/homeTypes";
import { IoLocationOutline, IoGlobeOutline } from "react-icons/io5";

interface PopularCountriesProps {
  countries: PopularCountry[];
}

export default function PopularCountries({ countries }: PopularCountriesProps) {
  return (
    <section className="mb-16" aria-labelledby="popular-countries-heading">
      <div className="text-center mb-12">
        <h2 id="popular-countries-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Popüler Ülkeler
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          Dünya çapında sağlık hizmetlerimiz
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {countries.map((country, index) => (
          <article
            key={index}
            className="group relative"
            itemScope
            itemType="https://schema.org/Country"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-white rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 group-hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <IoGlobeOutline className="text-lg md:text-2xl text-white" />
                  </div>
                  <div>
                    <div className="text-lg md:text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 mb-1" itemProp="name">
                      {country.country}
                    </div>
                    <div className="text-sm md:text-base text-gray-500 font-medium">
                      Sağlık sağlayıcıları
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl md:text-4xl font-bold text-indigo-600 mb-1" itemProp="additionalProperty">
                    {country.count.toLocaleString()}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 font-medium">sağlayıcı</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4 md:mt-6">
                <div className="flex justify-between text-xs md:text-sm text-gray-500 mb-2">
                  <span>Sağlayıcı Sayısı</span>
                  <span>{country.count.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-1000 group-hover:from-indigo-600 group-hover:to-purple-700"
                    style={{ width: `${Math.min((country.count / Math.max(...countries.map(c => c.count))) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

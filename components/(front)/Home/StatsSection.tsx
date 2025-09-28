import React from "react";
import { IoPeopleOutline, IoBusinessOutline, IoGlobeOutline } from "react-icons/io5";

interface StatsSectionProps {
  doctorsCount: number;
  hospitalsCount: number;
  countriesCount: number;
}

export default function StatsSection({ 
  doctorsCount, 
  hospitalsCount, 
  countriesCount 
}: StatsSectionProps) {
  return (
    <section className="mb-16" aria-labelledby="stats-heading">
      <div className="text-center mb-12">
        <h2 id="stats-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Güvenilir Sağlık Platformu
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          Binlerce uzman doktor ve sağlık kurumu ile sağlığınız için buradayız
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="relative group" role="article" aria-label="Uzman doktor sayısı">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative bg-white rounded-2xl p-6 md:p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <IoPeopleOutline className="text-2xl md:text-3xl text-white" />
            </div>
            <div className="text-3xl md:text-5xl font-bold text-gray-900 mb-2 md:mb-3">
              {doctorsCount.toLocaleString()}
            </div>
            <div className="text-lg md:text-xl font-semibold text-gray-700 mb-2">Uzman Doktor</div>
            <div className="text-sm md:text-base text-gray-500">
              Deneyimli sağlık profesyonelleri
            </div>
          </div>
        </div>

        <div className="relative group" role="article" aria-label="Hastane ve klinik sayısı">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative bg-white rounded-2xl p-6 md:p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <IoBusinessOutline className="text-2xl md:text-3xl text-white" />
            </div>
            <div className="text-3xl md:text-5xl font-bold text-gray-900 mb-2 md:mb-3">
              {hospitalsCount.toLocaleString()}
            </div>
            <div className="text-lg md:text-xl font-semibold text-gray-700 mb-2">Hastane ve Klinik</div>
            <div className="text-sm md:text-base text-gray-500">
              Modern sağlık tesisleri
            </div>
          </div>
        </div>

        <div className="relative group" role="article" aria-label="Ülke sayısı">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative bg-white rounded-2xl p-6 md:p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <IoGlobeOutline className="text-2xl md:text-3xl text-white" />
            </div>
            <div className="text-3xl md:text-5xl font-bold text-gray-900 mb-2 md:mb-3">
              {countriesCount}
            </div>
            <div className="text-lg md:text-xl font-semibold text-gray-700 mb-2">Ülke</div>
            <div className="text-sm md:text-base text-gray-500">
              Geniş coğrafi erişim
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

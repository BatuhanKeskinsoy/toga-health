import React from "react";
import { IoChevronDown, IoListOutline } from "react-icons/io5";
import ProvidersSidebar from "@/components/(front)/Provider/Providers/ProvidersSidebar";
import ProvidersMain from "@/components/(front)/Provider/Providers/ProvidersMain";

function ProvidersView() {
  return (
    <div className="container mx-auto px-4 flex flex-col gap-4">
      <div className="flex max-lg:flex-col justify-between lg:items-center lg:py-2 py-6 gap-4">
        <div className="flex flex-col gap-1 w-full pl-4 border-l-4 border-sitePrimary">
          <h1 className="text-2xl font-bold ">
            Tümör Hastalığı İçin Doktorlar ve Hastaneler
          </h1>
          <p className="text-sm text-gray-500">
            Toplam 1775 Kadın Tümör Hastalığı doktoru ve hastanesi bulundu.
          </p>
        </div>
        <div className="flex items-center gap-2 min-w-max">
          <button className="flex items-center justify-between max-lg:w-full gap-6 bg-white border border-gray-200 px-4 py-3 rounded-md hover:border-sitePrimary transition-all duration-300 cursor-pointer">
            <div className="flex flex-col items-start">
              <span className="text-[11px] opacity-80">Sıralama</span>
              <span className="text-xs font-medium text-sitePrimary">Akıllı Sıralama</span>
            </div>
            <div className="flex items-center justify-center size-8 bg-gray-100 rounded-md">
              <IoChevronDown size={16} className="text-gray-500" />
            </div>
          </button>
          <button className="flex items-center justify-between max-lg:w-full gap-6 bg-white border border-gray-200 px-4 py-3 rounded-md hover:border-sitePrimary transition-all duration-300 cursor-pointer">
            <div className="flex flex-col items-start">
              <span className="text-[11px] opacity-80">Listeleme</span>
              <span className="text-xs font-medium text-sitePrimary">Akıllı Listeleme</span>
            </div>
            <div className="flex items-center justify-center size-8 bg-gray-100 rounded-md">
              <IoListOutline size={16} className="text-gray-500" />
            </div>
          </button>
        </div>
      </div>
      <div className="flex max-lg:flex-col gap-4">
        <div className="lg:w-[320px] w-full">
          <ProvidersSidebar />
        </div>
        <div className="flex-1">
          <ProvidersMain />
        </div>
      </div>
    </div>
  );
}

export default ProvidersView;

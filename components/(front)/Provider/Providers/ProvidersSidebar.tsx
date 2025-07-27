import React from "react";

interface ProvidersSidebarProps {
  diseaseSlug?: string;
  country?: string;
  city?: string;
  district?: string;
}

function ProvidersSidebar({ diseaseSlug, country, city, district }: ProvidersSidebarProps) {
  return (
    <div className="w-full bg-white rounded-md sticky top-4 p-4 shadow-md shadow-gray-200">
      <div className="flex flex-col gap-4">
        <h3 className="font-semibold text-lg">Filtreler</h3>
        
        {/* Hastalık Filtresi */}
        {diseaseSlug && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Hastalık</label>
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {diseaseSlug}
            </div>
          </div>
        )}

        {/* Konum Filtreleri */}
        {(country || city || district) && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Konum</label>
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {[country, city, district].filter(Boolean).join(' - ')}
            </div>
          </div>
        )}

        {/* Diğer filtreler buraya eklenebilir */}
        <div className="text-center text-gray-400 text-sm py-4">
          Filtre seçenekleri burada görünecek
        </div>
      </div>
    </div>
  );
}

export default ProvidersSidebar;

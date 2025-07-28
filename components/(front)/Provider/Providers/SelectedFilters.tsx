import React from "react";

interface SelectedFiltersProps {
  currentDisease: any;
  selectedLocation: {
    country: any;
    city: any;
    district: any;
  };
}

function SelectedFilters({ 
  currentDisease, 
  selectedLocation 
}: SelectedFiltersProps) {
  
  return (
    <>
      {(currentDisease || selectedLocation.country) && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Seçili Filtreler</label>
          <div className="space-y-2">
            {currentDisease && (
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                <span className="font-medium">Hastalık:</span> {currentDisease.title}
              </div>
            )}
            {selectedLocation.country && (
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                <span className="font-medium">Konum:</span> {[
                  selectedLocation.country.name,
                  selectedLocation.city?.name,
                  selectedLocation.district?.name
                ].filter(Boolean).join(' - ')}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default SelectedFilters; 
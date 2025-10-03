"use client";
import React, { useState, useEffect } from "react";
import { MdHealthAndSafety } from "react-icons/md";
import { FiX } from "react-icons/fi";
import CustomSelect from "@/components/others/CustomSelect";
import { getDiseases } from "@/lib/services/categories/diseases";

interface Disease {
  id: number;
  name: string;
  slug: string;
  description: string;
  specialty: {
    id: number;
    name: string;
    slug: string;
  };
}

interface DiseasesSectionProps {
  selectedDiseases: number[];
  onDiseasesChange: (diseaseIds: number[]) => void;
}

export default function DiseasesSection({ 
  selectedDiseases, 
  onDiseasesChange 
}: DiseasesSectionProps) {
  const [availableDiseases, setAvailableDiseases] = useState<Disease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Hastalıkları yükle
  useEffect(() => {
    const loadDiseases = async () => {
      try {
        setIsLoading(true);
        const diseases = await getDiseases();
        setAvailableDiseases(diseases);
      } catch (error) {
        console.error("Hastalıklar yüklenirken hata:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDiseases();
  }, []);

  // Seçili hastalıkları filtrele
  const selectedDiseaseObjects = availableDiseases.filter(disease => 
    selectedDiseases.includes(disease.id)
  );

  // Arama sonuçlarını filtrele
  const filteredDiseases = availableDiseases.filter(disease =>
    disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disease.specialty.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hastalık ekle
  const handleAddDisease = (option: any) => {
    if (option && !selectedDiseases.includes(option.id)) {
      onDiseasesChange([...selectedDiseases, option.id]);
    }
  };

  // Hastalık kaldır
  const handleRemoveDisease = (diseaseId: number) => {
    onDiseasesChange(selectedDiseases.filter(id => id !== diseaseId));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MdHealthAndSafety className="text-sitePrimary text-xl" />
          <h4 className="text-lg font-semibold text-gray-900">Hastalıklar</h4>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MdHealthAndSafety className="text-sitePrimary text-xl" />
        <h4 className="text-lg font-semibold text-gray-900">Hastalıklar</h4>
      </div>

      {/* Hastalık Seçimi */}
      <div className="space-y-3">
        <CustomSelect
          id="disease_select"
          name="disease_select"
          label="Hastalık Ekle"
          value={null}
          options={filteredDiseases.map(disease => ({
            id: disease.id,
            name: `${disease.name} (${disease.specialty.name})`
          }))}
          onChange={handleAddDisease}
          placeholder="Hastalık seçiniz..."
          searchable
          onSearchChange={setSearchTerm}
        />
      </div>

      {/* Seçili Hastalıklar */}
      {selectedDiseaseObjects.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-700">
            Seçili Hastalıklar ({selectedDiseaseObjects.length})
          </h5>
          <div className="space-y-2">
            {selectedDiseaseObjects.map((disease) => (
              <div
                key={disease.id}
                className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-blue-900">{disease.name}</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {disease.specialty.name}
                    </span>
                  </div>
                  {disease.description && (
                    <p className="text-sm text-blue-700 mt-1">{disease.description}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveDisease(disease.id)}
                  className="hover:bg-blue-200 rounded-full p-1 transition-colors ml-2"
                >
                  <FiX className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Boş Durum */}
      {selectedDiseaseObjects.length === 0 && (
        <div className="p-4 border border-gray-200 rounded-lg text-center text-gray-500">
          <MdHealthAndSafety className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>Henüz hastalık seçilmedi</p>
          <p className="text-sm">Yukarıdan hastalık ekleyebilirsiniz</p>
        </div>
      )}
    </div>
  );
}

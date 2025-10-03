"use client";
import React, { useState, useEffect } from "react";
import { MdMedicalServices } from "react-icons/md";
import { FiX } from "react-icons/fi";
import CustomSelect from "@/components/others/CustomSelect";
import { getBranches } from "@/lib/services/categories/branches";

interface Specialty {
  id: number;
  name: string;
  slug: string;
  description: string;
}

interface SpecialtiesSectionProps {
  selectedSpecialties: number[];
  onSpecialtiesChange: (specialtyIds: number[]) => void;
}

export default function SpecialtiesSection({ 
  selectedSpecialties, 
  onSpecialtiesChange 
}: SpecialtiesSectionProps) {
  const [availableSpecialties, setAvailableSpecialties] = useState<Specialty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Uzmanlıkları yükle
  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        setIsLoading(true);
        const specialties = await getBranches();
        setAvailableSpecialties(specialties);
      } catch (error) {
        console.error("Uzmanlıklar yüklenirken hata:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSpecialties();
  }, []);

  // Seçili uzmanlıkları filtrele
  const selectedSpecialtyObjects = availableSpecialties.filter(specialty => 
    selectedSpecialties.includes(specialty.id)
  );

  // Arama sonuçlarını filtrele
  const filteredSpecialties = availableSpecialties.filter(specialty =>
    specialty.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Uzmanlık ekle
  const handleAddSpecialty = (option: any) => {
    if (option && !selectedSpecialties.includes(option.id)) {
      onSpecialtiesChange([...selectedSpecialties, option.id]);
    }
  };

  // Uzmanlık kaldır
  const handleRemoveSpecialty = (specialtyId: number) => {
    onSpecialtiesChange(selectedSpecialties.filter(id => id !== specialtyId));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MdMedicalServices className="text-sitePrimary text-xl" />
          <h4 className="text-lg font-semibold text-gray-900">Uzmanlık Alanları</h4>
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
        <MdMedicalServices className="text-sitePrimary text-xl" />
        <h4 className="text-lg font-semibold text-gray-900">Uzmanlık Alanları</h4>
      </div>

      {/* Uzmanlık Seçimi */}
      <div className="space-y-3">
        <CustomSelect
          id="specialty_select"
          name="specialty_select"
          label="Uzmanlık Alanı Ekle"
          value={null}
          options={filteredSpecialties.map(specialty => ({
            id: specialty.id,
            name: specialty.name
          }))}
          onChange={handleAddSpecialty}
          placeholder="Uzmanlık alanı seçiniz..."
          searchable
          onSearchChange={setSearchTerm}
        />
      </div>

      {/* Seçili Uzmanlıklar */}
      {selectedSpecialtyObjects.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-700">
            Seçili Uzmanlık Alanları ({selectedSpecialtyObjects.length})
          </h5>
          <div className="flex flex-wrap gap-2">
            {selectedSpecialtyObjects.map((specialty) => (
              <div
                key={specialty.id}
                className="flex items-center gap-2 bg-sitePrimary/10 text-sitePrimary px-3 py-2 rounded-full text-sm font-medium"
              >
                <span>{specialty.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSpecialty(specialty.id)}
                  className="hover:bg-sitePrimary/20 rounded-full p-1 transition-colors"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Boş Durum */}
      {selectedSpecialtyObjects.length === 0 && (
        <div className="p-4 border border-gray-200 rounded-lg text-center text-gray-500">
          <MdMedicalServices className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>Henüz uzmanlık alanı seçilmedi</p>
          <p className="text-sm">Yukarıdan uzmanlık alanı ekleyebilirsiniz</p>
        </div>
      )}
    </div>
  );
}

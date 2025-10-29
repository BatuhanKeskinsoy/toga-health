"use client";
import React, { useMemo } from "react";
import CustomSelect from "@/components/Customs/CustomSelect";
import { useDiseases } from "@/lib/hooks/globals/useDiseases";

interface AddDiseaseSelectProps {
  selectedDiseaseIds: number[];
  onSelect: (diseaseId: number) => void;
}

export default function AddDiseaseSelect({
  selectedDiseaseIds,
  onSelect,
}: AddDiseaseSelectProps) {
  const { diseases: allDiseases, isLoading } = useDiseases();

  // Kullanılabilir hastalıkları filtrele (seçili olanlar hariç)
  const availableDiseaseOptions = useMemo(() => {
    return allDiseases
      .filter((d) => !selectedDiseaseIds.includes(d.id))
      .map((d) => ({
        id: d.id,
        value: d.id,
        name: d.name,
      }));
  }, [allDiseases, selectedDiseaseIds]);

  return (
    <CustomSelect
      id="add-disease"
      name="add-disease"
      label="Yeni Hastalık Ekle"
      value={null}
      options={availableDiseaseOptions}
      onChange={(option: any) => option && onSelect(option.id)}
      disabled={isLoading}
    />
  );
}


"use client";
import React, { useMemo } from "react";
import CustomSelect from "@/components/Customs/CustomSelect";
import { useTreatments } from "@/lib/hooks/globals/useTreatments";

interface AddTreatmentSelectProps {
  selectedTreatmentIds: number[];
  onSelect: (treatmentId: number) => void;
}

export default function AddTreatmentSelect({
  selectedTreatmentIds,
  onSelect,
}: AddTreatmentSelectProps) {
  const { treatments: allTreatments, isLoading } = useTreatments();

  // Kullanılabilir tedavileri filtrele (seçili olanlar hariç)
  const availableTreatmentOptions = useMemo(() => {
    return allTreatments
      .filter((t) => !selectedTreatmentIds.includes(t.id))
      .map((t) => ({
        id: t.id,
        value: t.id,
        name: t.name,
      }));
  }, [allTreatments, selectedTreatmentIds]);

  return (
    <CustomSelect
      id="add-treatment"
      name="add-treatment"
      label="Yeni Tedavi Ekle"
      value={null}
      options={availableTreatmentOptions}
      onChange={(option: any) => option && onSelect(option.id)}
      disabled={isLoading}
    />
  );
}


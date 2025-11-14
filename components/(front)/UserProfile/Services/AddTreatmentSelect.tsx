"use client";
import React, { useMemo } from "react";
import CustomSelect from "@/components/Customs/CustomSelect";
import { useTreatments } from "@/lib/hooks/globals/useTreatments";
import { useTranslations } from "next-intl";
interface AddTreatmentSelectProps {
  selectedTreatmentIds: number[];
  onSelect: (treatmentId: number) => void;
}

export default function AddTreatmentSelect({
  selectedTreatmentIds,
  onSelect,
}: AddTreatmentSelectProps) {
  const { treatments: allTreatments, isLoading } = useTreatments();
  const t = useTranslations();
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
      label={t("Yeni Tedavi ve Hizmet Ekle")}
      value={null}
      options={availableTreatmentOptions}
      onChange={(option: any) => option && onSelect(option.id)}
      disabled={isLoading}
    />
  );
}


"use client";
import React, { useState, useEffect } from "react";
import { MdLocalHospital } from "react-icons/md";
import { FiX, FiPlus } from "react-icons/fi";
import CustomSelect from "@/components/others/CustomSelect";
import { CustomInput } from "@/components/others/CustomInput";
import CustomButton from "@/components/others/CustomButton";
import { getTreatments, Treatment } from "@/lib/services/categories/treatments";
import { getCurrencies, Currency } from "@/lib/services/currencies";

interface TreatmentWithDetails {
  id: number;
  name: string;
  price: string;
  currency: string;
  notes: string;
  is_active: boolean;
}

interface TreatmentsSectionProps {
  treatments: TreatmentWithDetails[];
  onTreatmentsChange: (treatments: TreatmentWithDetails[]) => void;
}

export default function TreatmentsSection({ 
  treatments, 
  onTreatmentsChange 
}: TreatmentsSectionProps) {
  const [availableTreatments, setAvailableTreatments] = useState<Treatment[]>([]);
  const [availableCurrencies, setAvailableCurrencies] = useState<Currency[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Tedavileri ve para birimlerini yükle
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [treatmentsData, currenciesData] = await Promise.all([
          getTreatments(),
          getCurrencies()
        ]);
        setAvailableTreatments(treatmentsData || []);
        setAvailableCurrencies(currenciesData || []);
      } catch (error) {
        console.error("Veriler yüklenirken hata:", error);
        setAvailableTreatments([]);
        setAvailableCurrencies([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Tüm tedavileri göster
  const filteredTreatments = availableTreatments || [];

  // Seçili tedavi ID'lerini al
  const selectedTreatmentIds = (treatments || []).map(t => t.id);

  // Yeni tedavi ekle
  const handleAddTreatment = (option: any) => {
    if (option && !selectedTreatmentIds.includes(option.id)) {
      const defaultCurrency = (availableCurrencies || []).find(c => c.is_default) || (availableCurrencies || [])[0];
      const newTreatment: TreatmentWithDetails = {
        id: option.id,
        name: option.name,
        price: "",
        currency: defaultCurrency?.code || "TRY",
        notes: "",
        is_active: true,
      };
      onTreatmentsChange([...treatments, newTreatment]);
    }
  };

  // Tedavi güncelle
  const handleUpdateTreatment = (index: number, field: keyof TreatmentWithDetails, value: string | boolean) => {
    console.log("handleUpdateTreatment called:", { index, field, value });
    const updatedTreatments = [...treatments];
    updatedTreatments[index] = {
      ...updatedTreatments[index],
      [field]: value,
    };
    console.log("Updated treatments:", updatedTreatments);
    onTreatmentsChange(updatedTreatments);
  };

  // Tedavi kaldır
  const handleRemoveTreatment = (index: number) => {
    onTreatmentsChange(treatments.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MdLocalHospital className="text-sitePrimary text-xl" />
          <h4 className="text-lg font-semibold text-gray-900">Tedaviler</h4>
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
        <MdLocalHospital className="text-sitePrimary text-xl" />
        <h4 className="text-lg font-semibold text-gray-900">Tedaviler</h4>
      </div>

      {/* Tedavi Seçimi */}
      <div className="space-y-3">
        <CustomSelect
          id="treatment_select"
          name="treatment_select"
          label="Tedavi/Hizmet Ekle"
          value={null}
          options={(filteredTreatments || []).map(treatment => ({
            id: treatment.id,
            name: `${treatment.name} (${treatment.specialty.name})`
          }))}
          onChange={handleAddTreatment}
          placeholder="Tedavi/hizmet seçiniz..."
        />
      </div>

      {/* Seçili Tedaviler */}
      {treatments.length > 0 && (
        <div className="space-y-4">
          <h5 className="text-sm font-medium text-gray-700">
            Seçili Tedaviler ({treatments.length})
          </h5>
          {treatments.map((treatment, index) => (
            <div
              key={`${treatment.id}-${index}`}
              className="border border-gray-200 rounded-lg p-3 space-y-3"
            >
              {/* Tedavi Başlığı - Kompakt */}
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h6 className="font-medium text-gray-900 truncate">{treatment.name}</h6>
                  <p className="text-xs text-gray-500">
                    {(availableTreatments || []).find(t => t.id === treatment.id)?.specialty.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveTreatment(index)}
                  className="hover:bg-red-100 rounded-full p-1 transition-colors ml-2 flex-shrink-0"
                >
                  <FiX className="w-4 h-4 text-red-600" />
                </button>
              </div>

              {/* Tedavi Detayları - Fiyat/Currency yarı, Notlar yarı */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="min-w-0">
                  <div className="grid grid-cols-2 gap-2">
                    <CustomInput
                      label="Fiyat"
                      name={`treatment_${index}_price`}
                      type="number"
                      value={treatment.price}
                      onChange={(e) => handleUpdateTreatment(index, "price", e.target.value)}
                      placeholder="0.00"
                      className="text-sm focus:outline-none focus:ring-2 focus:ring-sitePrimary focus:border-transparent"
                    />
                    <CustomSelect
                      id={`treatment_${index}_currency`}
                      name={`treatment_${index}_currency`}
                      label="Para Birimi"
                      value={(availableCurrencies || []).find(c => c.code === treatment.currency) || null}
                      options={(availableCurrencies || []).map(currency => ({
                        id: currency.id,
                        name: `${currency.name} (${currency.symbol})`
                      }))}
                      onChange={(option) => {
                        console.log("Currency changed:", option);
                        handleUpdateTreatment(index, "currency", option?.code || "TRY");
                      }}
                      placeholder="Para birimi..."
                      className="text-sm focus:outline-none focus:ring-2 focus:ring-sitePrimary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="min-w-0">
                  <CustomInput
                    label="Notlar"
                    name={`treatment_${index}_notes`}
                    type="text"
                    value={treatment.notes}
                    onChange={(e) => handleUpdateTreatment(index, "notes", e.target.value)}
                    placeholder="Notlar..."
                    className="text-sm focus:outline-none focus:ring-2 focus:ring-sitePrimary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Boş Durum */}
      {treatments.length === 0 && (
        <div className="p-4 border border-gray-200 rounded-lg text-center text-gray-500">
          <MdLocalHospital className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>Henüz tedavi/hizmet eklenmedi</p>
          <p className="text-sm">Yukarıdan tedavi/hizmet ekleyebilirsiniz</p>
        </div>
      )}
    </div>
  );
}

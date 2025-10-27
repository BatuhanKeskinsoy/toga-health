"use client";
import React, { useState } from "react";
import {
  updateProviderTreatments,
  addProviderTreatmentsAtAddress,
} from "@/lib/services/provider/services";
import {
  Treatment,
  TreatmentAddressDetail,
} from "@/lib/types/provider/servicesTypes";
import { Address } from "@/lib/types/user/addressesTypes";
import CustomButton from "@/components/others/CustomButton";
import CustomInput from "@/components/others/CustomInput";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";
import AddTreatmentSelect from "./AddTreatmentSelect";
import {
  IoCheckmarkCircleOutline,
  IoTrashOutline,
  IoLocationOutline,
} from "react-icons/io5";

interface TreatmentsSectionProps {
  allTreatments: any[];
  providerTreatments: Treatment[];
  addresses: Address[];
  error: string | null;
}

export default function TreatmentsSection({
  allTreatments,
  providerTreatments,
  addresses,
  error,
}: TreatmentsSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMyTreatments, setSelectedMyTreatments] = useState<number[]>(
    providerTreatments.map((t) => t.id)
  );
  const [treatmentAddressData, setTreatmentAddressData] = useState<
    Record<number, Record<number, TreatmentAddressDetail>>
  >({});

  // Tedavi ekle - En üste ekler
  const handleAddTreatment = (treatmentId: number) => {
    if (!selectedMyTreatments.includes(treatmentId)) {
      setSelectedMyTreatments((prev) => [treatmentId, ...prev]);
    }
  };

  // Tedavi kaldır
  const handleRemoveTreatment = (treatmentId: number) => {
    setSelectedMyTreatments((prev) => prev.filter((id) => id !== treatmentId));
    // Adres verilerini de temizle
    setTreatmentAddressData((prev) => {
      const newData = { ...prev };
      delete newData[treatmentId];
      return newData;
    });
  };

  // Ana tedavi listesini kaydet
  const handleSaveTreatments = async () => {
    try {
      setIsLoading(true);
      await updateProviderTreatments({
        treatments: selectedMyTreatments.map((id) => ({
          id,
          is_active: true,
        })),
      });
      await funcSweetAlert({
        title: "Başarılı",
        text: "Tedaviler başarıyla güncellendi",
        icon: "success",
      });
    } catch (err: any) {
      await funcSweetAlert({
        title: "Hata",
        text: err?.response?.data?.message || "Bir hata oluştu",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Adres bazlı tedavi detaylarını kaydet
  const handleSaveAddressTreatments = async () => {
    try {
      setIsLoading(true);

      // API formatına çevir
      const treatmentsData = Object.entries(treatmentAddressData).map(
        ([treatmentId, addressesData]) => ({
          treatment_id: Number(treatmentId),
          addresses: Object.values(addressesData),
        })
      );

      await addProviderTreatmentsAtAddress({ treatments: treatmentsData });

      await funcSweetAlert({
        title: "Başarılı",
        text: "Adres tedavileri başarıyla kaydedildi",
        icon: "success",
      });
    } catch (err: any) {
      await funcSweetAlert({
        title: "Hata",
        text: err?.response?.data?.message || "Bir hata oluştu",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Seçili tedavileri getir - selectedMyTreatments sırasına göre sırala
  const myTreatments = selectedMyTreatments
    .map((id) => allTreatments.find((t) => t.id === id))
    .filter(Boolean);

  return (
    <div className="space-y-4">
      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Add Treatment */}
      <div className="flex gap-4">
        <div className="flex-1">
          <AddTreatmentSelect
            selectedTreatmentIds={selectedMyTreatments}
            onSelect={handleAddTreatment}
          />
        </div>
        <CustomButton
          title={isLoading ? "Kaydediliyor..." : "Kaydet"}
          containerStyles="px-4 bg-sitePrimary text-white text-sm rounded-lg hover:bg-sitePrimary/90 whitespace-nowrap hover:bg-sitePrimary/80"
          handleClick={handleSaveTreatments}
          isDisabled={isLoading}
        />
      </div>

      {/* My Treatments Grid */}
      {!isLoading && myTreatments.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Seçili Tedavilerim</h4>
          <div className="grid grid-cols-1 gap-4">
            {myTreatments.map((treatment, index) => (
              <div
                key={treatment.id}
                className="p-4 rounded-md border border-gray-200 shadow-lg shadow-transparent hover:shadow-gray-200 transition-shadow bg-white animate-fadeOut duration-300"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <IoCheckmarkCircleOutline className="text-sitePrimary text-xl" />
                    <h4 className="font-medium text-gray-900">
                      {treatment.name}
                    </h4>
                  </div>
                  <CustomButton
                    title=""
                    containerStyles="p-2 hover:bg-red-100 rounded-md transition-colors"
                    leftIcon={<IoTrashOutline className="text-red-600" />}
                    handleClick={() => handleRemoveTreatment(treatment.id)}
                  />
                </div>

                {/* Adres Checkboxes */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-700 mb-3">
                    Bu tedaviyi hangi adreslerinizde sunuyorsunuz?
                  </p>
                  <div className="space-y-2">
                    {addresses.map((address) => (
                      <AddressServiceItem
                        key={address.id}
                        address={address}
                        treatmentId={treatment.id}
                        treatmentAddressData={treatmentAddressData}
                        setTreatmentAddressData={setTreatmentAddressData}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Save Address Treatments Button */}
          <div className="pt-4 border-t border-gray-200">
            <CustomButton
              title="Adres Tedavilerini Kaydet"
              containerStyles="px-4 py-3 bg-sitePrimary text-white text-sm rounded-lg hover:bg-sitePrimary/90 whitespace-nowrap hover:bg-sitePrimary/80 max-lg:w-full"
              handleClick={handleSaveAddressTreatments}
              isDisabled={isLoading}
            />
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && myTreatments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Henüz tedavi eklenmedi. Yukarıdan tedavi seçebilirsiniz.
        </div>
      )}
    </div>
  );
}

// Adres Servis Item Component
function AddressServiceItem({
  address,
  treatmentId,
  treatmentAddressData,
  setTreatmentAddressData,
}: {
  address: Address;
  treatmentId: number;
  treatmentAddressData: Record<number, Record<number, TreatmentAddressDetail>>;
  setTreatmentAddressData: React.Dispatch<
    React.SetStateAction<Record<number, Record<number, TreatmentAddressDetail>>>
  >;
}) {
  const isChecked = Boolean(treatmentAddressData[treatmentId]?.[address.id]);
  const data = treatmentAddressData[treatmentId]?.[address.id];

  const handleToggle = (checked: boolean) => {
    setTreatmentAddressData((prev) => {
      const newData = { ...prev };

      if (!newData[treatmentId]) {
        newData[treatmentId] = {};
      }

      if (checked && !data) {
        // Yeni adres ekle - default değerlerle
        newData[treatmentId][address.id] = {
          address_id: address.id,
          price: 0,
          currency: "TRY",
          prepayment_amount: 0,
          requires_prepayment: false,
          is_active: true,
          experience_years: 0,
        };
      } else if (!checked) {
        // Adres kaldır
        delete newData[treatmentId][address.id];
      }

      return newData;
    });
  };

  const handleUpdateField = (
    field: keyof TreatmentAddressDetail,
    value: any
  ) => {
    setTreatmentAddressData((prev) => {
      const newData = { ...prev };
      if (newData[treatmentId]?.[address.id]) {
        newData[treatmentId][address.id] = {
          ...newData[treatmentId][address.id],
          [field]: value,
        };
      }
      return newData;
    });
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg hover:border-sitePrimary/30 transition-colors">
      <label className="flex items-center gap-2 cursor-pointer p-3">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => handleToggle(e.target.checked)}
          className="w-4 h-4 text-sitePrimary border-gray-300 rounded focus:ring-sitePrimary"
        />
        <div className="flex items-center gap-2">
          <IoLocationOutline className="text-sitePrimary" />
          <span className="text-sm font-medium text-gray-900">
            {address.name}
          </span>
          <span className="text-xs text-gray-500">({address.city})</span>
        </div>
      </label>

      {/* Service Details - Checkbox seçiliyse göster */}
      {isChecked && data && (
        <div className="p-3">
          <div className="space-y-2 pl-4 ml-2 border-l-2 border-sitePrimary">
            <CustomInput
              label="Ücret"
              value={String(data.price || "")}
              onChange={(e) =>
                handleUpdateField("price", parseFloat(e.target.value))
              }
              type="number"
            />

            <label className="flex items-center gap-2 cursor-pointer px-2 py-1.5 rounded hover:bg-gray-100">
              <input
                type="checkbox"
                checked={data.requires_prepayment || false}
                onChange={(e) =>
                  handleUpdateField("requires_prepayment", e.target.checked)
                }
                className="w-4 h-4 text-sitePrimary border-gray-300 rounded focus:ring-sitePrimary"
              />
              <span className="text-xs text-gray-600">Avans Gerekli</span>
            </label>

            {data.requires_prepayment && (
              <CustomInput
                label="Avans Ücreti"
                value={String(data.prepayment_amount || "")}
                onChange={(e) =>
                  handleUpdateField(
                    "prepayment_amount",
                    parseFloat(e.target.value)
                  )
                }
                type="number"
              />
            )}

            <CustomInput
              label="Deneyim Yılı"
              value={String(data.experience_years || "")}
              onChange={(e) =>
                handleUpdateField("experience_years", parseInt(e.target.value))
              }
              type="number"
            />
          </div>
        </div>
      )}
    </div>
  );
}

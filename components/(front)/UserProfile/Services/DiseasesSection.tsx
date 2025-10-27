"use client";
import React, { useState } from "react";
import {
  updateProviderDiseases,
  addProviderDiseasesAtAddress,
} from "@/lib/services/provider/services";
import {
  Disease,
  DiseaseAddressDetail,
} from "@/lib/types/provider/servicesTypes";
import { Address } from "@/lib/types/user/addressesTypes";
import CustomButton from "@/components/others/CustomButton";
import CustomInput from "@/components/others/CustomInput";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";
import AddDiseaseSelect from "./AddDiseaseSelect";
import {
  IoCheckmarkCircleOutline,
  IoTrashOutline,
  IoLocationOutline,
} from "react-icons/io5";

interface DiseasesSectionProps {
  allDiseases: any[];
  providerDiseases: Disease[];
  addresses: Address[];
  error: string | null;
}

export default function DiseasesSection({
  allDiseases,
  providerDiseases,
  addresses,
  error,
}: DiseasesSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMyDiseases, setSelectedMyDiseases] = useState<number[]>(
    providerDiseases.map((d) => d.id)
  );
  const [diseaseAddressData, setDiseaseAddressData] = useState<
    Record<number, Record<number, DiseaseAddressDetail>>
  >({});

  // Hastalık ekle - En üste ekler
  const handleAddDisease = (diseaseId: number) => {
    if (!selectedMyDiseases.includes(diseaseId)) {
      setSelectedMyDiseases((prev) => [diseaseId, ...prev]);
    }
  };

  // Hastalık kaldır
  const handleRemoveDisease = (diseaseId: number) => {
    setSelectedMyDiseases((prev) => prev.filter((id) => id !== diseaseId));
    // Adres verilerini de temizle
    setDiseaseAddressData((prev) => {
      const newData = { ...prev };
      delete newData[diseaseId];
      return newData;
    });
  };

  // Ana hastalık listesini kaydet
  const handleSaveDiseases = async () => {
    try {
      setIsLoading(true);
      await updateProviderDiseases({ disease_ids: selectedMyDiseases });
      await funcSweetAlert({
        title: "Başarılı",
        text: "Hastalıklar başarıyla güncellendi",
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

  // Adres bazlı hastalık detaylarını kaydet
  const handleSaveAddressDiseases = async () => {
    try {
      setIsLoading(true);

      // API formatına çevir
      const diseasesData = Object.entries(diseaseAddressData).map(
        ([diseaseId, addressesData]) => ({
          disease_id: Number(diseaseId),
          addresses: Object.values(addressesData),
        })
      );

      await addProviderDiseasesAtAddress({ diseases: diseasesData });

      await funcSweetAlert({
        title: "Başarılı",
        text: "Adres hastalıkları başarıyla kaydedildi",
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

  // Seçili hastalıkları getir - selectedMyDiseases sırasına göre sırala
  const myDiseases = selectedMyDiseases
    .map((id) => allDiseases.find((d) => d.id === id))
    .filter(Boolean);

  return (
    <div className="space-y-4">
      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Add Disease */}
      <div className="flex gap-4">
        <div className="flex-1">
          <AddDiseaseSelect
            selectedDiseaseIds={selectedMyDiseases}
            onSelect={handleAddDisease}
          />
        </div>
        <CustomButton
          title={isLoading ? "Kaydediliyor..." : "Kaydet"}
          containerStyles="px-4 bg-sitePrimary text-white text-sm rounded-lg hover:bg-sitePrimary/90 whitespace-nowrap hover:bg-sitePrimary/80"
          handleClick={handleSaveDiseases}
          isDisabled={isLoading}
        />
      </div>

      {/* My Diseases Grid */}
      {!isLoading && myDiseases.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Seçili Hastalıklarım</h4>
          <div className="grid grid-cols-1 gap-4">
            {myDiseases.map((disease, index) => (
              <div
                key={disease.id}
                className={`p-4 rounded-md border border-gray-200 shadow-lg shadow-transparent hover:shadow-gray-200 transition-shadow bg-white duration-300 animate-fadeOut`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <IoCheckmarkCircleOutline className="text-sitePrimary text-xl" />
                    <h4 className="font-medium text-gray-900">
                      {disease.name}
                    </h4>
                  </div>
                  <CustomButton
                    containerStyles="p-1.5 hover:bg-red-100 rounded-md transition-colors"
                    leftIcon={<IoTrashOutline className="text-red-600" />}
                    handleClick={() => handleRemoveDisease(disease.id)}
                  />
                </div>

                {/* Adres Checkboxes */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-700 mb-3">
                    Bu hastalığı hangi adreslerinizde sunuyorsunuz?
                  </p>
                  <div className="space-y-2">
                    {addresses.map((address) => (
                      <AddressServiceItem
                        key={address.id}
                        address={address}
                        diseaseId={disease.id}
                        diseaseAddressData={diseaseAddressData}
                        setDiseaseAddressData={setDiseaseAddressData}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Save Address Diseases Button */}
          <div className="pt-4 border-t border-gray-200">
            <CustomButton
              title="Adres Hastalıklarını Kaydet"
              containerStyles="px-4 py-3 bg-sitePrimary text-white text-sm rounded-lg hover:bg-sitePrimary/90 whitespace-nowrap hover:bg-sitePrimary/80 max-lg:w-full"
              handleClick={handleSaveAddressDiseases}
              isDisabled={isLoading}
            />
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && myDiseases.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Henüz hastalık eklenmedi. Yukarıdan hastalık seçebilirsiniz.
        </div>
      )}
    </div>
  );
}

// Adres Servis Item Component
function AddressServiceItem({
  address,
  diseaseId,
  diseaseAddressData,
  setDiseaseAddressData,
}: {
  address: Address;
  diseaseId: number;
  diseaseAddressData: Record<number, Record<number, DiseaseAddressDetail>>;
  setDiseaseAddressData: React.Dispatch<
    React.SetStateAction<Record<number, Record<number, DiseaseAddressDetail>>>
  >;
}) {
  const isChecked = Boolean(diseaseAddressData[diseaseId]?.[address.id]);
  const data = diseaseAddressData[diseaseId]?.[address.id];

  const handleToggle = (checked: boolean) => {
    setDiseaseAddressData((prev) => {
      const newData = { ...prev };

      if (!newData[diseaseId]) {
        newData[diseaseId] = {};
      }

      if (checked && !data) {
        // Yeni adres ekle - default değerlerle
        newData[diseaseId][address.id] = {
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
        delete newData[diseaseId][address.id];
      }

      return newData;
    });
  };

  const handleUpdateField = (field: keyof DiseaseAddressDetail, value: any) => {
    setDiseaseAddressData((prev) => {
      const newData = { ...prev };
      if (newData[diseaseId]?.[address.id]) {
        newData[diseaseId][address.id] = {
          ...newData[diseaseId][address.id],
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

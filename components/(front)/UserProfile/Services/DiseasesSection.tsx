"use client";
import React, { useState, useEffect } from "react";
import {
  updateProviderDiseases,
  addProviderDiseasesAtAddress,
} from "@/lib/services/provider/services";
import {
  Disease,
  DiseaseAddressDetail,
  DiseaseAtAddress,
} from "@/lib/types/provider/servicesTypes";
import { Address } from "@/lib/types/user/addressesTypes";
import CustomButton from "@/components/Customs/CustomButton";
import CustomInput from "@/components/Customs/CustomInput";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";
import AddDiseaseSelect from "./AddDiseaseSelect";
import {
  IoCheckmarkCircleOutline,
  IoTrashOutline,
  IoLocationOutline,
} from "react-icons/io5";
import CustomSelect from "@/components/Customs/CustomSelect";
import CustomCheckbox from "@/components/Customs/CustomCheckbox";
import { Currency } from "@/lib/types/globals";
import { UserTypes } from "@/lib/types/user/UserTypes";

interface DiseasesSectionProps {
  allDiseases: any[];
  providerDiseases: Disease[];
  addresses: Address[];
  existingDiseasesAtAddresses: Record<number, DiseaseAtAddress[]>;
  currencies: Currency[];
  user: UserTypes | null;
  error: string | null;
}

export default function DiseasesSection({
  allDiseases,
  providerDiseases,
  addresses,
  existingDiseasesAtAddresses,
  currencies,
  user,
  error,
}: DiseasesSectionProps) {
  const initialSelected = providerDiseases.map((d) => d.id);
  const [selectedMyDiseases, setSelectedMyDiseases] =
    useState<number[]>(initialSelected);
  const [lastSavedSelected, setLastSavedSelected] =
    useState<number[]>(initialSelected);
  const [diseaseAddressData, setDiseaseAddressData] = useState<
    Record<number, Record<number, DiseaseAddressDetail>>
  >({});

  // Mevcut adres verilerini state'e yükle
  useEffect(() => {
    const initialData: Record<
      number,
      Record<number, DiseaseAddressDetail>
    > = {};

    Object.entries(existingDiseasesAtAddresses).forEach(
      ([addressId, diseases]) => {
        diseases.forEach((diseaseAtAddress) => {
          if (!initialData[diseaseAtAddress.disease_id]) {
            initialData[diseaseAtAddress.disease_id] = {};
          }

          initialData[diseaseAtAddress.disease_id][Number(addressId)] = {
            address_id: Number(addressId),
            price: parseFloat(diseaseAtAddress.price),
            currency: diseaseAtAddress.currency,
            is_active: diseaseAtAddress.is_active,
          };
        });
      }
    );

    setDiseaseAddressData(initialData);
  }, [existingDiseasesAtAddresses]);

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
      await updateProviderDiseases({ disease_ids: selectedMyDiseases });
      await funcSweetAlert({
        title: "Başarılı",
        text: "Hastalıklar başarıyla güncellendi",
        icon: "success",
      });
      setLastSavedSelected(selectedMyDiseases);
    } catch (err: any) {
      await funcSweetAlert({
        title: "Hata",
        text: err?.response?.data?.message || "Bir hata oluştu",
        icon: "error",
      });
    }
  };

  // Adres bazlı hastalık detaylarını kaydet
  const handleSaveAddressDiseases = async () => {
    try {
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
    }
  };

  // Seçili hastalıkları getir - selectedMyDiseases sırasına göre sırala
  const myDiseases = selectedMyDiseases
    .map((id) => allDiseases.find((d) => d.id === id))
    .filter(Boolean);

  const isDirty =
    selectedMyDiseases.length !== lastSavedSelected.length ||
    selectedMyDiseases.some((id, idx) => id !== lastSavedSelected[idx]);

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
          title="Kaydet"
          containerStyles="px-4 bg-sitePrimary text-white text-sm rounded-lg hover:bg-sitePrimary/90 whitespace-nowrap hover:bg-sitePrimary/80"
          handleClick={handleSaveDiseases}
        />
      </div>

      {/* My Diseases Grid */}
      {myDiseases.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Seçili Hastalıklarım</h4>
          <div className="grid grid-cols-1 gap-2">
            {myDiseases.map((disease, index) => (
              <div
                key={disease.id}
                className={`p-4 rounded-md border border-gray-200 shadow-lg shadow-transparent hover:shadow-gray-200 transition-shadow bg-white duration-300 animate-fadeOut`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div
                  className={`flex items-center justify-between ${
                    user.user_type === "doctor" ? "mb-3" : ""
                  }`}
                >
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
                {user.user_type === "doctor" && (
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
                          currencies={currencies}
                          user={user}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Save Address Diseases Button */}
          {user.user_type === "doctor" && (
            <div className="flex max-lg:flex-col gap-2 items-center justify-between pt-4 border-t border-gray-200">
              <div
                title={
                  isDirty
                    ? "Öncelikle en üst kısımdan eklediğiniz hastalıkları kaydedin"
                    : undefined
                }
              >
                <CustomButton
                  title="Hastalıkları Kaydet"
                  containerStyles={`px-4 py-3 text-white text-sm rounded-lg whitespace-nowrap max-lg:w-full ${
                    isDirty
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-sitePrimary hover:bg-sitePrimary/90 hover:bg-sitePrimary/80"
                  }`}
                  handleClick={handleSaveAddressDiseases}
                  isDisabled={isDirty}
                />
              </div>
              {isDirty && (
                <p className="text-xs text-gray-400">
                  Öncelikle en üst kısımdan hastalıkları kaydedin
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {myDiseases.length === 0 && (
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
  currencies,
  user,
}: {
  address: Address;
  diseaseId: number;
  diseaseAddressData: Record<number, Record<number, DiseaseAddressDetail>>;
  setDiseaseAddressData: React.Dispatch<
    React.SetStateAction<Record<number, Record<number, DiseaseAddressDetail>>>
  >;
  currencies: Currency[];
  user: UserTypes | null;
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
          currency: user?.currency || "USD",
          is_active: true,
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
      <CustomCheckbox
        id={`disease-${diseaseId}-address-${address.id}`}
        checked={isChecked}
        onChange={handleToggle}
        className="p-3 hover:bg-gray-100/50 transition-colors"
        label={
          <div className="flex items-center gap-1 justify-between w-full">
            <span className="text-sm font-medium text-gray-900">
              {address.name}
            </span>
            <span className="text-xs text-gray-500">
              {address.city} / {address.district}
            </span>
          </div>
        }
      />

      {/* Service Details - Checkbox seçiliyse göster */}
      {isChecked && data && (
        <div className="p-3">
          <div className="space-y-2 pl-4 ml-2 border-l-2 border-sitePrimary">
            <div className="grid grid-cols-2 gap-3">
              <CustomInput
                label="Ücret"
                value={String(data.price || "")}
                onChange={(e) =>
                  handleUpdateField("price", parseFloat(e.target.value))
                }
                type="number"
              />

              <CustomSelect
                id={`currency-${address.id}-${diseaseId}`}
                name="currency"
                label="Para Birimi"
                value={
                  currencies.find((c) => c.code === data.currency)
                    ? {
                        id: currencies.find((c) => c.code === data.currency)!
                          .id,
                        name: `${
                          currencies.find((c) => c.code === data.currency)!.code
                        }${
                          currencies.find((c) => c.code === data.currency)!
                            .symbol
                            ? ` (${
                                currencies.find(
                                  (c) => c.code === data.currency
                                )!.symbol
                              })`
                            : ""
                        }`,
                        code: data.currency,
                      }
                    : null
                }
                options={currencies.map((c) => ({
                  id: c.id,
                  name: `${c.code}${c.symbol ? ` (${c.symbol})` : ""}`,
                  code: c.code,
                }))}
                onChange={(opt) =>
                  handleUpdateField("currency", opt?.code || "")
                }
                placeholder="Seçiniz"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

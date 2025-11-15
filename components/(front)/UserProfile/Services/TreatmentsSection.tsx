"use client";
import React, { useState, useEffect } from "react";
import {
  updateProviderTreatments,
  addProviderTreatmentsAtAddress,
} from "@/lib/services/provider/services";
import {
  Treatment,
  TreatmentAddressDetail,
  TreatmentAtAddress,
} from "@/lib/types/provider/servicesTypes";
import { Address } from "@/lib/types/user/addressesTypes";
import CustomButton from "@/components/Customs/CustomButton";
import CustomInput from "@/components/Customs/CustomInput";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";
import AddTreatmentSelect from "./AddTreatmentSelect";
import {
  IoCheckmarkCircleOutline,
  IoTrashOutline,
} from "react-icons/io5";
import CustomSelect from "@/components/Customs/CustomSelect";
import CustomCheckbox from "@/components/Customs/CustomCheckbox";
import { Currency } from "@/lib/types/globals";
import { UserTypes } from "@/lib/types/user/UserTypes";
import { useTranslations } from "next-intl";
interface TreatmentsSectionProps {
  allTreatments: any[];
  providerTreatments: Treatment[];
  addresses: Address[];
  existingTreatmentsAtAddresses: Record<number, TreatmentAtAddress[]>;
  currencies: Currency[];
  user: UserTypes | null;
  error: string | null;
}

export default function TreatmentsSection({
  allTreatments,
  providerTreatments,
  addresses,
  existingTreatmentsAtAddresses,
  currencies,
  user,
  error,
}: TreatmentsSectionProps) {
  const t = useTranslations();
  const initialSelected = providerTreatments.map((t) => t.id);
  const [selectedMyTreatments, setSelectedMyTreatments] =
    useState<number[]>(initialSelected);
  const [lastSavedSelected, setLastSavedSelected] =
    useState<number[]>(initialSelected);
  const [treatmentAddressData, setTreatmentAddressData] = useState<
    Record<number, Record<number, TreatmentAddressDetail>>
  >({});

  // Mevcut adres verilerini state'e yükle
  useEffect(() => {
    const initialData: Record<
      number,
      Record<number, TreatmentAddressDetail>
    > = {};

    Object.entries(existingTreatmentsAtAddresses).forEach(
      ([addressId, treatments]) => {
        treatments.forEach((treatmentAtAddress) => {
          if (!initialData[treatmentAtAddress.treatment_id]) {
            initialData[treatmentAtAddress.treatment_id] = {};
          }

          initialData[treatmentAtAddress.treatment_id][Number(addressId)] = {
            address_id: Number(addressId),
            price: parseFloat(treatmentAtAddress.price),
            currency: treatmentAtAddress.currency,
            is_active: treatmentAtAddress.is_active,
          };
        });
      }
    );

    setTreatmentAddressData(initialData);
  }, [existingTreatmentsAtAddresses]);

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
      await updateProviderTreatments({
        treatments: selectedMyTreatments.map((id) => ({
          id,
          is_active: true,
        })),
      });
      await funcSweetAlert({
        title: t("Başarılı"),
        text: t("Tedaviler başarıyla güncellendi"),
        icon: "success",
      });
      setLastSavedSelected(selectedMyTreatments);
    } catch (err: any) {
      await funcSweetAlert({
        title: t("Hata"),
        text: err?.response?.data?.message || t("Bir hata oluştu"),
        icon: "error",
      });
    }
  };

  // Adres bazlı tedavi detaylarını kaydet
  const handleSaveAddressTreatments = async () => {
    try {
      // API formatına çevir
      const treatmentsData = Object.entries(treatmentAddressData).map(
        ([treatmentId, addressesData]) => ({
          treatment_id: Number(treatmentId),
          addresses: Object.values(addressesData),
        })
      );

      await addProviderTreatmentsAtAddress({ treatments: treatmentsData });

      await funcSweetAlert({
        title: t("Başarılı"),
        text: t("Adres tedavileri başarıyla kaydedildi"),
        icon: "success",
      });
    } catch (err: any) {
      await funcSweetAlert({
        title: t("Hata"),
        text: err?.response?.data?.message || t("Bir hata oluştu"),
        icon: "error",
      });
    }
  };

  // Seçili tedavileri getir - selectedMyTreatments sırasına göre sırala
  const myTreatments = selectedMyTreatments
    .map((id) => allTreatments.find((t) => t.id === id))
    .filter(Boolean);

  const isDirty =
    selectedMyTreatments.length !== lastSavedSelected.length ||
    selectedMyTreatments.some((id, idx) => id !== lastSavedSelected[idx]);

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
          title={t("Değişiklikleri Kaydet")}
          containerStyles="px-4 bg-sitePrimary text-white text-sm rounded-lg hover:bg-sitePrimary/90 whitespace-nowrap hover:bg-sitePrimary/80"
          handleClick={handleSaveTreatments}
        />
      </div>

      {/* My Treatments Grid */}
      {myTreatments.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">{t("Seçili Tedaviler")}</h4>
          <div className="grid grid-cols-1 gap-2">
            {myTreatments.map((treatment, index) => (
              <div
                key={treatment.id}
                className="p-4 rounded-md border border-gray-200 shadow-lg shadow-transparent hover:shadow-gray-200 transition-shadow bg-white animate-fadeOut duration-300"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex items-center justify-between">
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
                {user.user_type === "doctor" && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-700 mb-3">
                      {t("Bu tedaviyi hangi adreslerinizde sunuyorsunuz?")}
                    </p>
                    <div className="space-y-2">
                      {addresses.map((address) => (
                        <AddressServiceItem
                          key={address.id}
                          address={address}
                          treatmentId={treatment.id}
                          treatmentAddressData={treatmentAddressData}
                          setTreatmentAddressData={setTreatmentAddressData}
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

          {/* Save Address Treatments Button */}
          <div className="flex max-lg:flex-col gap-2 items-center justify-between pt-4 border-t border-gray-200">
            <div
              title={
                isDirty
                  ? t("Öncelikle en üst kısımdan eklediğiniz tedavileri kaydedin")
                  : undefined
              }
            >
              <CustomButton
                title={t("Tedavileri Kaydet")}
                containerStyles={`px-4 py-3 text-white text-sm rounded-lg whitespace-nowrap max-lg:w-full ${
                  isDirty
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-sitePrimary hover:bg-sitePrimary/90 hover:bg-sitePrimary/80"
                }`}
                handleClick={handleSaveAddressTreatments}
                isDisabled={isDirty}
              />
            </div>
            {isDirty && (
              <p className="text-xs text-gray-400">
                {t("Öncelikle en üst kısımdan eklediğiniz tedavileri kaydedin")}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {myTreatments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {t("Henüz tedavi eklenmedi, yukarıdan tedavi seçebilirsiniz")}
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
  currencies,
  user,
}: {
  address: Address;
  treatmentId: number;
  treatmentAddressData: Record<number, Record<number, TreatmentAddressDetail>>;
  setTreatmentAddressData: React.Dispatch<
    React.SetStateAction<Record<number, Record<number, TreatmentAddressDetail>>>
  >;
  currencies: Currency[];
  user: UserTypes | null;
}) {
  const t = useTranslations();
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
          currency: user?.currency || "USD",
          is_active: true,
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
      <CustomCheckbox
        id={`treatment-${treatmentId}-address-${address.id}`}
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
                label={t("Fiyat")}
                value={String(data.price || "")}
                onChange={(e) =>
                  handleUpdateField("price", parseFloat(e.target.value))
                }
                type="number"
              />

              <CustomSelect
                id={`currency-${address.id}-${treatmentId}`}
                name="currency"
                label={t("Para Birimi")}
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
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

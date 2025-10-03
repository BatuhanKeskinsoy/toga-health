"use client";
import React, { useState, useEffect } from "react";
import { MdBusiness } from "react-icons/md";
import { FiX } from "react-icons/fi";
import CustomSelect from "@/components/others/CustomSelect";
import { CustomInput } from "@/components/others/CustomInput";
import { getServices, Service } from "@/lib/services/categories/services";
import { getCurrencies, Currency } from "@/lib/services/currencies";


interface ServiceWithDetails {
  id: number;
  name: string;
  price: string;
  currency: string;
  description: string;
  is_active: boolean;
}

interface DoctorServicesSectionProps {
  services: ServiceWithDetails[];
  onServicesChange: (services: ServiceWithDetails[]) => void;
}

export default function DoctorServicesSection({ 
  services, 
  onServicesChange 
}: DoctorServicesSectionProps) {
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [availableCurrencies, setAvailableCurrencies] = useState<Currency[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Servisleri ve para birimlerini yükle
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [servicesData, currenciesData] = await Promise.all([
          getServices(),
          getCurrencies()
        ]);
        setAvailableServices(servicesData || []);
        setAvailableCurrencies(currenciesData || []);
      } catch (error) {
        console.error("Veriler yüklenirken hata:", error);
        setAvailableServices([]);
        setAvailableCurrencies([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Tüm servisleri göster
  const filteredServices = availableServices || [];

  // Seçili servis ID'lerini al
  const selectedServiceIds = (services || []).map(s => s.id);

  // Yeni servis ekle
  const handleAddService = (option: any) => {
    if (option && !selectedServiceIds.includes(option.id)) {
      const originalService = (availableServices || []).find(s => s.id === option.id);
      const defaultCurrency = availableCurrencies.find(c => c.is_default) || availableCurrencies[0];
      const newService: ServiceWithDetails = {
        id: option.id,
        name: option.name,
        price: originalService?.price || "",
        currency: defaultCurrency?.code || "TRY",
        description: "",
        is_active: true,
      };
      onServicesChange([...services, newService]);
    }
  };

  // Servis güncelle
  const handleUpdateService = (index: number, field: keyof ServiceWithDetails, value: string | number | boolean) => {
    const updatedServices = [...services];
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: value,
    };
    onServicesChange(updatedServices);
  };

  // Servis kaldır
  const handleRemoveService = (index: number) => {
    onServicesChange(services.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MdBusiness className="text-sitePrimary text-xl" />
          <h4 className="text-lg font-semibold text-gray-900">Hizmetler</h4>
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
        <MdBusiness className="text-sitePrimary text-xl" />
        <h4 className="text-lg font-semibold text-gray-900">Hizmetler</h4>
      </div>

      {/* Servis Seçimi */}
      <div className="space-y-3">
        <CustomSelect
          id="service_select"
          name="service_select"
          label="Hizmet Ekle"
          value={null}
          options={filteredServices.map(service => ({
            id: service.id,
            name: `${service.name} (${service.category})`
          }))}
          onChange={handleAddService}
          placeholder="Hizmet seçiniz..."
        />
      </div>

      {/* Seçili Servisler */}
      {services.length > 0 && (
        <div className="space-y-4">
          <h5 className="text-sm font-medium text-gray-700">
            Seçili Hizmetler ({services.length})
          </h5>
          {services.map((service, index) => (
            <div
              key={`${service.id}-${index}`}
              className="border border-gray-200 rounded-lg p-3 space-y-3"
            >
              {/* Servis Başlığı - Kompakt */}
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h6 className="font-medium text-gray-900 truncate">{service.name}</h6>
                  <p className="text-xs text-gray-500">
                    {(availableServices || []).find(s => s.id === service.id)?.category}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveService(index)}
                  className="hover:bg-red-100 rounded-full p-1 transition-colors ml-2 flex-shrink-0"
                >
                  <FiX className="w-4 h-4 text-red-600" />
                </button>
              </div>

              {/* Servis Detayları - Fiyat/Currency yarı, Açıklama yarı */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="min-w-0">
                  <div className="grid grid-cols-2 gap-2">
                    <CustomInput
                      label="Fiyat"
                      name={`service_${index}_price`}
                      type="number"
                      value={service.price}
                      onChange={(e) => handleUpdateService(index, "price", e.target.value)}
                      placeholder="0.00"
                      className="text-sm"
                    />
                    <CustomSelect
                      id={`service_${index}_currency`}
                      name={`service_${index}_currency`}
                      label="Para Birimi"
                      value={(availableCurrencies || []).find(c => c.code === service.currency) || null}
                      options={(availableCurrencies || []).map(currency => ({
                        id: currency.id,
                        name: `${currency.name} (${currency.symbol})`
                      }))}
                      onChange={(option) => handleUpdateService(index, "currency", option?.code || "TRY")}
                      placeholder="Para birimi..."
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="min-w-0">
                  <CustomInput
                    label="Açıklama"
                    name={`service_${index}_description`}
                    type="text"
                    value={service.description}
                    onChange={(e) => handleUpdateService(index, "description", e.target.value)}
                    placeholder="Açıklama..."
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Aktif Servis Checkbox - Kompakt */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`service_${index}_active`}
                  checked={service.is_active}
                  onChange={(e) => handleUpdateService(index, "is_active", e.target.checked)}
                  className="w-4 h-4 text-sitePrimary bg-gray-100 border-gray-300 rounded focus:ring-sitePrimary focus:ring-2"
                />
                <label htmlFor={`service_${index}_active`} className="text-xs text-gray-700">
                  Hizmet aktif
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Boş Durum */}
      {services.length === 0 && (
        <div className="p-4 border border-gray-200 rounded-lg text-center text-gray-500">
          <MdBusiness className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>Henüz hizmet eklenmedi</p>
          <p className="text-sm">Yukarıdan hizmet ekleyebilirsiniz</p>
        </div>
      )}
    </div>
  );
}

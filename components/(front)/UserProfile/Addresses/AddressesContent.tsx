"use client";
import React, { useState } from "react";
import { useTranslations } from "use-intl";
import { Address } from "@/lib/types/user/addressesTypes";
import { getUserAddresses } from "@/lib/services/user/addresses";
import CustomButton from "@/components/others/CustomButton";
import { IoAddOutline, IoRefreshOutline } from "react-icons/io5";
import AddressCard from "@/components/(front)/UserProfile/Addresses//AddressCard";
import CreateAddressModal from "@/components/(front)/UserProfile/Addresses/CreateAddressModal";

interface AddressesContentProps {
  user: any;
  initialAddresses: Address[];
  initialError: string | null;
}

export default function AddressesContent({
  user,
  initialAddresses,
  initialError,
}: AddressesContentProps) {
  const t = useTranslations();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  // Yenile butonu
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      const response = await getUserAddresses();
      setAddresses(response.data || []);
    } catch (err) {
      console.error("Adresler yüklenirken hata:", err);
      setError("Adresler yüklenirken bir hata oluştu");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Adres oluşturulduktan sonra listeyi yenile
  const handleAddressCreated = () => {
    setShowCreateModal(false);
    handleRefresh();
  };

  // Adres güncellendikten sonra listeyi yenile
  const handleAddressUpdated = () => {
    handleRefresh();
  };

  // Adres silindikten sonra listeyi yenile
  const handleAddressDeleted = () => {
    handleRefresh();
  };

  return (
    <div className="flex max-lg:flex-col lg:gap-8 gap-4 w-full">
      {/* Header Section */}
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Adreslerim</h1>
          <div className="flex gap-3">
            <CustomButton
              title={isRefreshing ? "Yenileniyor..." : "Yenile"}
              containerStyles="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              leftIcon={<IoRefreshOutline className="text-lg" />}
              handleClick={handleRefresh}
              isDisabled={isRefreshing}
            />
            <CustomButton
              title="Yeni Adres"
              containerStyles="flex items-center gap-2 px-4 py-2 bg-sitePrimary text-white rounded-md hover:bg-sitePrimary/90 transition-colors"
              leftIcon={<IoAddOutline className="text-lg" />}
              handleClick={() => setShowCreateModal(true)}
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
            <CustomButton
              title="Tekrar Dene"
              containerStyles="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
              handleClick={handleRefresh}
            />
          </div>
        )}

        {/* Addresses Grid */}
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <IoAddOutline className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Henüz adres eklenmemiş
            </h3>
            <p className="text-gray-600 mb-6">
              İlk adresinizi ekleyerek başlayın
            </p>
            <CustomButton
              title="İlk Adresimi Ekle"
              containerStyles="flex items-center gap-2 px-6 py-3 bg-sitePrimary text-white rounded-md hover:bg-sitePrimary/90 transition-colors"
              leftIcon={<IoAddOutline className="text-lg" />}
              handleClick={() => setShowCreateModal(true)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onUpdated={handleAddressUpdated}
                onDeleted={handleAddressDeleted}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Address Modal */}
      {showCreateModal && (
        <CreateAddressModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleAddressCreated}
        />
      )}
    </div>
  );
}

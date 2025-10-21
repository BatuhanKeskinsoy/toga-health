"use client";
import React, { useState } from 'react';
import { useTranslations } from 'use-intl';
import { updateAddress } from '@/lib/services/user/addresses';
import { UpdateAddressRequest, Address } from '@/lib/types/user/addressesTypes';
import CustomButton from '@/components/others/CustomButton';
import { CustomInput } from '@/components/others/CustomInput';
import funcSweetAlert from '@/lib/functions/funcSweetAlert';
import { IoCloseOutline } from 'react-icons/io5';

interface EditAddressModalProps {
  address: Address;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditAddressModal({ address, onClose, onSuccess }: EditAddressModalProps) {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  
  const [form, setForm] = useState<UpdateAddressRequest>({
    name: address.name,
    address: address.address,
    country: address.country,
    city: address.city,
    district: address.district,
    postal_code: address.postal_code || '',
    is_default: address.is_default,
    is_active: address.is_active
  });

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Validate form
      if (!form.name || !form.address || !form.city || !form.district) {
        await funcSweetAlert({
          title: 'Hata',
          text: 'Lütfen tüm gerekli alanları doldurun',
          icon: 'error'
        });
        return;
      }
      
      await updateAddress(address.id, form);
      await funcSweetAlert({
        title: 'Başarılı',
        text: 'Adres başarıyla güncellendi',
        icon: 'success'
      });
      
      onSuccess();
    } catch (error) {
      console.error('Adres güncelleme hatası:', error);
      await funcSweetAlert({
        title: 'Hata',
        text: 'Adres güncellenirken bir hata oluştu',
        icon: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Adres Düzenle</h2>
          <CustomButton
            title=""
            containerStyles="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            leftIcon={<IoCloseOutline className="text-lg" />}
            handleClick={onClose}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomInput
                label="Adres Adı"
                placeholder="Örn: Ana Muayenehane"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              
              <CustomInput
                label="Posta Kodu"
                placeholder="26000"
                value={form.postal_code}
                onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
              />
            </div>

            <CustomInput
              label="Adres"
              placeholder="Cumhuriyet Caddesi No:456, Tepebaşı/Eskişehir"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CustomInput
                label="Ülke"
                placeholder="Türkiye"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                required
              />
              
              <CustomInput
                label="Şehir"
                placeholder="Eskişehir"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                required
              />
              
              <CustomInput
                label="İlçe"
                placeholder="Tepebaşı"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_default}
                  onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
                  className="rounded border-gray-300 text-sitePrimary focus:ring-sitePrimary"
                />
                <span className="text-sm text-gray-700">Varsayılan adres olarak ayarla</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="rounded border-gray-300 text-sitePrimary focus:ring-sitePrimary"
                />
                <span className="text-sm text-gray-700">Aktif</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <CustomButton
              title="İptal"
              containerStyles="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              handleClick={onClose}
            />
            
            <CustomButton
              title={isLoading ? 'Güncelleniyor...' : 'Güncelle'}
              containerStyles="px-6 py-2 bg-sitePrimary text-white rounded-lg hover:bg-sitePrimary/90 transition-colors"
              isDisabled={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

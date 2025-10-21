"use client";
import React, { useState } from 'react';
import { useTranslations } from 'use-intl';
import { createAddress } from '@/lib/services/user/addresses';
import { CreateAddressRequest, CreateAddressWithCompanyRequest } from '@/lib/types/user/addressesTypes';
import CustomButton from '@/components/others/CustomButton';
import { CustomInput } from '@/components/others/CustomInput';
import funcSweetAlert from '@/lib/functions/funcSweetAlert';
import { IoCloseOutline, IoBusinessOutline, IoPersonOutline } from 'react-icons/io5';

interface CreateAddressModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateAddressModal({ onClose, onSuccess }: CreateAddressModalProps) {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [addressType, setAddressType] = useState<'personal' | 'company'>('personal');
  
  // Personal address form
  const [personalForm, setPersonalForm] = useState<CreateAddressRequest>({
    name: '',
    address: '',
    country: 'Türkiye',
    city: '',
    district: '',
    postal_code: '',
    is_default: false,
    is_active: true
  });

  // Company application form
  const [companyForm, setCompanyForm] = useState<CreateAddressWithCompanyRequest>({
    company_register_code: ''
  });

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      if (addressType === 'personal') {
        // Validate personal form
        if (!personalForm.name || !personalForm.address || !personalForm.city || !personalForm.district) {
          await funcSweetAlert({
            title: 'Hata',
            text: 'Lütfen tüm gerekli alanları doldurun',
            icon: 'error'
          });
          return;
        }
        
        await createAddress(personalForm);
        await funcSweetAlert({
          title: 'Başarılı',
          text: 'Adres başarıyla oluşturuldu',
          icon: 'success'
        });
      } else {
        // Validate company form
        if (!companyForm.company_register_code) {
          await funcSweetAlert({
            title: 'Hata',
            text: 'Lütfen hastane kayıt kodunu girin',
            icon: 'error'
          });
          return;
        }
        
        await createAddress(companyForm);
        await funcSweetAlert({
          title: 'Başarılı',
          text: 'Hastaneye başvuru gönderildi',
          icon: 'success'
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error('Adres oluşturma hatası:', error);
      await funcSweetAlert({
        title: 'Hata',
        text: 'Adres oluşturulurken bir hata oluştu',
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
          <h2 className="text-xl font-bold text-gray-900">Yeni Adres Ekle</h2>
          <CustomButton
            title=""
            containerStyles="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            leftIcon={<IoCloseOutline className="text-lg" />}
            handleClick={onClose}
          />
        </div>

        {/* Address Type Selection */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Adres Türü Seçin</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setAddressType('personal')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                addressType === 'personal'
                  ? 'border-sitePrimary bg-sitePrimary/5 text-sitePrimary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <IoPersonOutline className="text-2xl" />
                <div className="text-left">
                  <h4 className="font-semibold">Kişisel Adres</h4>
                  <p className="text-sm text-gray-600">Kendi adresinizi oluşturun</p>
                </div>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setAddressType('company')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                addressType === 'company'
                  ? 'border-sitePrimary bg-sitePrimary/5 text-sitePrimary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <IoBusinessOutline className="text-2xl" />
                <div className="text-left">
                  <h4 className="font-semibold">Hastane Başvurusu</h4>
                  <p className="text-sm text-gray-600">Hastaneye başvuru gönderin</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {addressType === 'personal' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomInput
                  label="Adres Adı"
                  placeholder="Örn: Ana Muayenehane"
                  value={personalForm.name}
                  onChange={(e) => setPersonalForm({ ...personalForm, name: e.target.value })}
                  required
                />
                
                <CustomInput
                  label="Posta Kodu"
                  placeholder="26000"
                  value={personalForm.postal_code}
                  onChange={(e) => setPersonalForm({ ...personalForm, postal_code: e.target.value })}
                />
              </div>

              <CustomInput
                label="Adres"
                placeholder="Cumhuriyet Caddesi No:456, Tepebaşı/Eskişehir"
                value={personalForm.address}
                onChange={(e) => setPersonalForm({ ...personalForm, address: e.target.value })}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <CustomInput
                  label="Ülke"
                  placeholder="Türkiye"
                  value={personalForm.country}
                  onChange={(e) => setPersonalForm({ ...personalForm, country: e.target.value })}
                  required
                />
                
                <CustomInput
                  label="Şehir"
                  placeholder="Eskişehir"
                  value={personalForm.city}
                  onChange={(e) => setPersonalForm({ ...personalForm, city: e.target.value })}
                  required
                />
                
                <CustomInput
                  label="İlçe"
                  placeholder="Tepebaşı"
                  value={personalForm.district}
                  onChange={(e) => setPersonalForm({ ...personalForm, district: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={personalForm.is_default}
                    onChange={(e) => setPersonalForm({ ...personalForm, is_default: e.target.checked })}
                    className="rounded border-gray-300 text-sitePrimary focus:ring-sitePrimary"
                  />
                  <span className="text-sm text-gray-700">Varsayılan adres olarak ayarla</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={personalForm.is_active}
                    onChange={(e) => setPersonalForm({ ...personalForm, is_active: e.target.checked })}
                    className="rounded border-gray-300 text-sitePrimary focus:ring-sitePrimary"
                  />
                  <span className="text-sm text-gray-700">Aktif</span>
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Hastane Başvurusu</h4>
                <p className="text-sm text-blue-800">
                  Hastane kayıt kodunu girerek hastaneye başvuru gönderebilirsiniz. 
                  Hastane başvurunuzu kabul ederse, hastane adresi adreslerinize eklenecektir.
                </p>
              </div>
              
              <CustomInput
                label="Hastane Kayıt Kodu"
                placeholder="reg-123456789"
                value={companyForm.company_register_code}
                onChange={(e) => setCompanyForm({ company_register_code: e.target.value })}
                required
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <CustomButton
              title="İptal"
              containerStyles="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              handleClick={onClose}
            />
            
            <CustomButton
              title={isLoading ? 'Kaydediliyor...' : 'Kaydet'}
              containerStyles="px-6 py-2 bg-sitePrimary text-white rounded-lg hover:bg-sitePrimary/90 transition-colors"
              isDisabled={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

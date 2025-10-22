import api from "@/lib/axios";
import {
  UserAddressesResponse,
  UserAddressResponse,
  CreateAddressBody,
  UpdateAddressRequest,
} from "@/lib/types/user/addressesTypes";

// Tüm adresleri getir
export async function getUserAddresses(): Promise<UserAddressesResponse> {
  const res = await api.get(`/user/addresses`);
  return res.data;
}

// Tek adres getir
export async function getUserAddress(addressId: number): Promise<UserAddressResponse> {
  const res = await api.get(`/user/addresses/${addressId}`);
  return res.data;
}

// Adres oluştur (company başvurusu veya kendi adresi)
export async function createAddress(address: CreateAddressBody): Promise<void> {
  const res = await api.post(`/user/addresses`, address);
  return res.data;
}

// Adres güncelle (sadece kendi adresini güncelleyebilir)
export async function updateAddress(
  addressId: number,
  address: UpdateAddressRequest
): Promise<void> {
  const res = await api.put(`/user/addresses/${addressId}`, address);
  return res.data;
}

// Varsayılan adres olarak ayarla
export async function setDefaultAddress(addressId: number): Promise<void> {
  await api.post(`/user/addresses/${addressId}/set-default`);
}

// Adres durumunu değiştir (aktif/pasif)
export async function toggleStatusAddress(addressId: number): Promise<void> {
  await api.post(`/user/addresses/${addressId}/toggle-status`);
}

// Adres sil
export async function deleteAddress(addressId: number): Promise<void> {
  await api.delete(`/user/addresses/${addressId}`);
}

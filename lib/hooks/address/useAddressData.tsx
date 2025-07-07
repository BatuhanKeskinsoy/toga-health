import useSWR from "swr";
import { DoctorAddress } from "@/lib/types/others/addressTypes";

interface AddressData {
  doctor: {
    id: string;
    name: string;
    specialty: string;
    photo: string;
    description: string;
  };
  addresses: DoctorAddress[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useAddressData = () => {
  const { data, error, isLoading, mutate } = useSWR<AddressData>(
    '/api/addresses.json',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 30000 // 30 saniyede bir yenile
    }
  );

  const getDefaultAddress = (): DoctorAddress | null => {
    if (!data?.addresses) return null;
    
    // isDefault true olan adresi bul
    const defaultAddress = data.addresses.find(addr => addr.isDefault);
    
    // Eğer default yoksa ilk adresi döndür
    return defaultAddress || data.addresses[0] || null;
  };

  const getActiveAddresses = (): DoctorAddress[] => {
    if (!data?.addresses) return [];
    
    // Sadece aktif adresleri döndür
    return data.addresses.filter(addr => addr.isActive);
  };

  return {
    data,
    error,
    isLoading,
    mutate,
    getDefaultAddress,
    getActiveAddresses,
    doctor: data?.doctor || null
  };
}; 
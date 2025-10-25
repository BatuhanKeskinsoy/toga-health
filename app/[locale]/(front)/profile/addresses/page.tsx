import React from 'react';
import { getUserAddresses } from '@/lib/services/user/addresses';
import { getCountries } from '@/lib/services/locations';
import AddressesContent from '@/components/(front)/UserProfile/Addresses/AddressesContent';

export default async function AddressesPage() {

  // Server-side'da adresleri ve global verileri çek
  let addresses = [];
  let error = null;
  let globalData = { countries: [] };

  try {
    const [addressesResponse, countriesResponse] = await Promise.all([
      getUserAddresses(),
      getCountries()
    ]);
    
    addresses = addressesResponse.data || [];
    globalData = {
      countries: countriesResponse || []
    };
  } catch (err) {
    console.error('Veriler yüklenirken hata:', err);
    error = 'Veriler yüklenirken bir hata oluştu';
  }

  return (
    <AddressesContent 
      initialAddresses={addresses}
      initialError={error}
      globalData={globalData}
    />
  );
}
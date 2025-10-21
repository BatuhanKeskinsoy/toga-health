import React from 'react';
import { getServerUser } from '@/lib/utils/getServerUser';
import { redirect } from 'next/navigation';
import { getUserAddresses } from '@/lib/services/user/addresses';
import { getCountries } from '@/lib/services/locations';
import AddressesContent from '@/components/(front)/UserProfile/Addresses/AddressesContent';

export default async function AddressesPage() {
  const user = await getServerUser();

  if (!user) {
    redirect('/login');
  }

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
      user={user} 
      initialAddresses={addresses}
      initialError={error}
      globalData={globalData}
    />
  );
}
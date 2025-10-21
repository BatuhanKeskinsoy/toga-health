import React from 'react';
import { getServerUser } from '@/lib/utils/getServerUser';
import { redirect } from 'next/navigation';
import { getUserAddresses } from '@/lib/services/user/addresses';
import AddressesContent from '@/components/(front)/UserProfile/Addresses/AddressesContent';

export default async function AddressesPage() {
  const user = await getServerUser();

  if (!user) {
    redirect('/login');
  }

  // Server-side'da adresleri çek
  let addresses = [];
  let error = null;

  try {
    const response = await getUserAddresses();
    addresses = response.data || [];
  } catch (err) {
    console.error('Adresler yüklenirken hata:', err);
    error = 'Adresler yüklenirken bir hata oluştu';
  }

  return (
    <AddressesContent 
      user={user} 
      initialAddresses={addresses}
      initialError={error}
    />
  );
}
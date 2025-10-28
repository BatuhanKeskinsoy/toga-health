import React from "react";
import {
  getProviderDiseases,
  getProviderTreatments,
  getProviderDiseasesAtAddress,
  getProviderTreatmentsAtAddress,
} from "@/lib/services/provider/services";
import { getDiseases } from "@/lib/services/categories/diseases";
import { getTreatments } from "@/lib/services/categories/treatments";
import { getUserAddresses } from "@/lib/services/user/addresses";
import { getCurrencies } from "@/lib/services/globals";
import { getServerUser } from "@/lib/utils/getServerUser";
import ServicesContent from "@/components/(front)/UserProfile/Services/ServicesContent";
import { Disease, Treatment, DiseaseAtAddress, TreatmentAtAddress } from "@/lib/types/provider/servicesTypes";
import { Address } from "@/lib/types/user/addressesTypes";
import { Currency } from "@/lib/types/globals";
import { UserTypes } from "@/lib/types/user/UserTypes";

export default async function ServicesPage() {
  // Server-side'da tüm verileri çek
  let allDiseases: any[] = []; // Tüm hastalıklar
  let providerDiseases: Disease[] = []; // Provider'ın hastalıkları
  let allTreatments: any[] = []; // Tüm tedaviler
  let providerTreatments: Treatment[] = []; // Provider'ın tedavileri
  let addresses: Address[] = [];
  let existingDiseasesAtAddresses: Record<number, DiseaseAtAddress[]> = {};
  let existingTreatmentsAtAddresses: Record<number, TreatmentAtAddress[]> = {};
  let currencies: Currency[] = [];
  let user: UserTypes | null = null;
  let diseasesError: string | null = null;
  let treatmentsError: string | null = null;
  let addressesError: string | null = null;

  try {
    // Tüm hastalıkları getir
    allDiseases = await getDiseases();
  } catch (err) {
    console.error("Tüm hastalıklar yüklenirken hata:", err);
  }

  try {
    // Currency verilerini getir
    const currenciesResponse = await getCurrencies();
    currencies = currenciesResponse.data || [];
  } catch (err) {
    console.error("Currency verileri yüklenirken hata:", err);
  }

  try {
    // User bilgilerini getir
    user = await getServerUser();
  } catch (err) {
    console.error("User bilgileri yüklenirken hata:", err);
  }

  try {
    // Provider'ın seçtiği hastalıkları getir
    const diseasesResponse = await getProviderDiseases();
    providerDiseases = diseasesResponse.data || [];
  } catch (err) {
    console.error("Hastalıklar yüklenirken hata:", err);
    diseasesError = "Hastalıklar yüklenirken bir hata oluştu";
  }

  try {
    // Tüm tedavileri getir
    allTreatments = await getTreatments();
  } catch (err) {
    console.error("Tüm tedaviler yüklenirken hata:", err);
  }

  try {
    // Provider'ın seçtiği tedavileri getir
    const treatmentsResponse = await getProviderTreatments();
    providerTreatments = treatmentsResponse.data || [];
  } catch (err) {
    console.error("Tedaviler yüklenirken hata:", err);
    treatmentsError = "Tedaviler yüklenirken bir hata oluştu";
  }

  try {
    // Adresleri getir
    const addressesResponse = await getUserAddresses();
    addresses = addressesResponse.data || [];

    // Her adres için mevcut servisleri çek
    for (const address of addresses) {
      try {
        // Bu adresteki hastalıkları çek
        const diseasesResponse = await getProviderDiseasesAtAddress(address.id);
        existingDiseasesAtAddresses[address.id] = diseasesResponse.data.diseases || [];
      } catch (err) {
        console.error(`Adres ${address.id} hastalıkları yüklenirken hata:`, err);
        existingDiseasesAtAddresses[address.id] = [];
      }

      try {
        // Bu adresteki tedavileri çek
        const treatmentsResponse = await getProviderTreatmentsAtAddress(address.id);
        existingTreatmentsAtAddresses[address.id] = treatmentsResponse.data.treatments || [];
      } catch (err) {
        console.error(`Adres ${address.id} tedavileri yüklenirken hata:`, err);
        existingTreatmentsAtAddresses[address.id] = [];
      }
    }
  } catch (err) {
    console.error("Adresler yüklenirken hata:", err);
    addressesError = "Adresler yüklenirken bir hata oluştu";
  }

  return (
    <ServicesContent
      allDiseases={allDiseases}
      providerDiseases={providerDiseases}
      allTreatments={allTreatments}
      providerTreatments={providerTreatments}
      addresses={addresses}
      existingDiseasesAtAddresses={existingDiseasesAtAddresses}
      existingTreatmentsAtAddresses={existingTreatmentsAtAddresses}
      currencies={currencies}
      user={user}
      diseasesError={diseasesError}
      treatmentsError={treatmentsError}
      addressesError={addressesError}
    />
  );
}

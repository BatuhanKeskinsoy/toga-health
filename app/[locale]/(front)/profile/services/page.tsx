import React from "react";
import {
  getProviderDiseases,
  getProviderTreatments,
} from "@/lib/services/provider/services";
import { getDiseases } from "@/lib/services/categories/diseases";
import { getTreatments } from "@/lib/services/categories/treatments";
import { getUserAddresses } from "@/lib/services/user/addresses";
import ServicesContent from "@/components/(front)/UserProfile/Services/ServicesContent";
import { Disease, Treatment } from "@/lib/types/provider/servicesTypes";
import { Address } from "@/lib/types/user/addressesTypes";

export default async function ServicesPage() {
  // Server-side'da tüm verileri çek
  let allDiseases: any[] = []; // Tüm hastalıklar
  let providerDiseases: Disease[] = []; // Provider'ın hastalıkları
  let allTreatments: any[] = []; // Tüm tedaviler
  let providerTreatments: Treatment[] = []; // Provider'ın tedavileri
  let addresses: Address[] = [];
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
      diseasesError={diseasesError}
      treatmentsError={treatmentsError}
      addressesError={addressesError}
    />
  );
}

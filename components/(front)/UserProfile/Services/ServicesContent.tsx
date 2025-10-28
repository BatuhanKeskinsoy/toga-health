"use client";
import React, { useState } from "react";
import { Disease, Treatment, DiseaseAtAddress, TreatmentAtAddress } from "@/lib/types/provider/servicesTypes";
import { Address } from "@/lib/types/user/addressesTypes";
import { Currency } from "@/lib/types/globals";
import { UserTypes } from "@/lib/types/user/UserTypes";
import DiseasesSection from "@/components/(front)/UserProfile/Services/DiseasesSection";
import TreatmentsSection from "@/components/(front)/UserProfile/Services/TreatmentsSection";
import { IoHeartOutline, IoMedicalOutline } from "react-icons/io5";

interface ServicesContentProps {
  allDiseases: any[];
  providerDiseases: Disease[];
  allTreatments: any[];
  providerTreatments: Treatment[];
  addresses: Address[];
  existingDiseasesAtAddresses: Record<number, DiseaseAtAddress[]>;
  existingTreatmentsAtAddresses: Record<number, TreatmentAtAddress[]>;
  currencies: Currency[];
  user: UserTypes | null;
  diseasesError: string | null;
  treatmentsError: string | null;
  addressesError: string | null;
}

export default function ServicesContent({
  allDiseases,
  providerDiseases,
  allTreatments,
  providerTreatments,
  addresses,
  existingDiseasesAtAddresses,
  existingTreatmentsAtAddresses,
  currencies,
  user,
  diseasesError,
  treatmentsError,
  addressesError,
}: ServicesContentProps) {
  // Provider'ın seçtiği hastalık ID'lerini al
  const selectedDiseaseIds = new Set(providerDiseases.map((d) => d.id));
  const selectedTreatmentIds = new Set(providerTreatments.map((t) => t.id));

  // Tüm hastalıkları ve provider seçimlerini birleştir
  const enrichedAllDiseases = allDiseases.map((disease: any) => ({
    ...disease,
    isSelected: selectedDiseaseIds.has(disease.id),
    providerData: providerDiseases.find((p) => p.id === disease.id),
  }));

  // Tüm tedavileri ve provider seçimlerini birleştir
  const enrichedAllTreatments = allTreatments.map((treatment: any) => ({
    ...treatment,
    isSelected: selectedTreatmentIds.has(treatment.id),
    providerData: providerTreatments.find((p) => p.id === treatment.id),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hizmetlerim</h1>
        <p className="text-gray-600 mt-2">
          Tedavi ettiğiniz hastalıkları ve uyguladığınız tedavileri yönetin
        </p>
      </div>

      {/* Diseases and Treatments Side by Side */}
      <div className="flex max-lg:flex-col gap-4">
        {/* Diseases Section */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center gap-2 border-b-2 border-sitePrimary pb-2">
            <IoHeartOutline className="text-sitePrimary text-xl" />
            <h2 className="text-lg font-semibold text-gray-900">
              Hastalıklarım
            </h2>
            {providerDiseases.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-sitePrimary/10 text-sitePrimary rounded-full text-xs font-medium">
                {providerDiseases.length}
              </span>
            )}
          </div>
          <DiseasesSection
            allDiseases={enrichedAllDiseases}
            providerDiseases={providerDiseases}
            addresses={addresses}
            existingDiseasesAtAddresses={existingDiseasesAtAddresses}
            currencies={currencies}
            user={user}
            error={diseasesError}
          />
        </div>
        <div className="w-1 border-r border-gray-200 max-lg:hidden" />
        {/* Treatments Section */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center gap-2 border-b-2 border-sitePrimary pb-2">
            <IoMedicalOutline className="text-sitePrimary text-xl" />
            <h2 className="text-lg font-semibold text-gray-900">Tedavilerim</h2>
            {providerTreatments.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-sitePrimary/10 text-sitePrimary rounded-full text-xs font-medium">
                {providerTreatments.length}
              </span>
            )}
          </div>
          <TreatmentsSection
            allTreatments={enrichedAllTreatments}
            providerTreatments={providerTreatments}
            addresses={addresses}
            existingTreatmentsAtAddresses={existingTreatmentsAtAddresses}
            currencies={currencies}
            user={user}
            error={treatmentsError}
          />
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, useCallback } from "react";
import { CustomField } from "@/lib/types/customFields";
import {
  getCustomFieldsForDoctor,
  getCustomFieldsForCorporate,
} from "@/lib/services/user/confirmations";
import {
  submitDoctorApplication as apiSubmitDoctor,
  submitCorporateApplication as apiSubmitCorporate,
  DoctorApplicationData,
  CorporateApplicationData,
  ApplyProfessionalAccountResponse,
} from "@/lib/services/user/professionalAccount";
import { groupCustomFields } from "@/lib/utils/groupCustomFields";

interface UseProfessionalAccountReturn {
  // State
  isLoadingCustomFields: boolean;
  customFields: CustomField[];
  groupedCustomFields: { [key: string]: CustomField[] };
  isSubmitting: boolean;

  // Actions
  loadDoctorCustomFields: () => Promise<CustomField[]>;
  loadCorporateCustomFields: () => Promise<CustomField[]>;
  submitDoctorApplication: (
    data: DoctorApplicationData
  ) => Promise<ApplyProfessionalAccountResponse>;
  submitCorporateApplication: (
    data: CorporateApplicationData
  ) => Promise<ApplyProfessionalAccountResponse>;
  resetCustomFields: () => void;
}

export const useProfessionalAccount = (): UseProfessionalAccountReturn => {
  const [isLoadingCustomFields, setIsLoadingCustomFields] = useState(false);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [groupedCustomFields, setGroupedCustomFields] = useState<{
    [key: string]: CustomField[];
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadDoctorCustomFields = useCallback(async (): Promise<CustomField[]> => {
    setIsLoadingCustomFields(true);
    try {
      const fields = await getCustomFieldsForDoctor();
      // API'den gelen sırayı korumak için id'ye göre sıralamıyoruz
      // Direkt API'den gelen sırayı kullanıyoruz
      setCustomFields(fields);
      setGroupedCustomFields(groupCustomFields(fields));
      return fields;
    } catch (error) {
      console.error("Custom fields yüklenemedi:", error);
      setCustomFields([]);
      setGroupedCustomFields({});
      return [];
    } finally {
      setIsLoadingCustomFields(false);
    }
  }, []);

  const loadCorporateCustomFields = useCallback(async (): Promise<CustomField[]> => {
    setIsLoadingCustomFields(true);
    try {
      const fields = await getCustomFieldsForCorporate();
      // API'den gelen sırayı korumak için id'ye göre sıralamıyoruz
      // Direkt API'den gelen sırayı kullanıyoruz
      setCustomFields(fields);
      setGroupedCustomFields(groupCustomFields(fields));
      return fields;
    } catch (error) {
      console.error("Custom fields yüklenemedi:", error);
      setCustomFields([]);
      setGroupedCustomFields({});
      return [];
    } finally {
      setIsLoadingCustomFields(false);
    }
  }, []);

  const submitDoctorApplication = useCallback(
    async (data: DoctorApplicationData): Promise<ApplyProfessionalAccountResponse> => {
      setIsSubmitting(true);
      try {
        return await apiSubmitDoctor(data);
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const submitCorporateApplication = useCallback(
    async (
      data: CorporateApplicationData
    ): Promise<ApplyProfessionalAccountResponse> => {
      setIsSubmitting(true);
      try {
        return await apiSubmitCorporate(data);
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const resetCustomFields = useCallback(() => {
    setCustomFields([]);
    setGroupedCustomFields({});
  }, []);

  return {
    isLoadingCustomFields,
    customFields,
    groupedCustomFields,
    isSubmitting,
    loadDoctorCustomFields,
    loadCorporateCustomFields,
    submitDoctorApplication,
    submitCorporateApplication,
    resetCustomFields,
  };
};


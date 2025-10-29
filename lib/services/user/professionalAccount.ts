import api from "@/lib/axios";

export interface ApplyProfessionalAccountResponse {
  status: boolean;
  message: string;
  data?: any;
}

export interface DoctorApplicationData {
  documentFiles: File[];
  customFields: { [key: string]: any };
}

export interface CorporateApplicationData {
  documentFiles: File[];
  customFields: { [key: string]: any };
}

/**
 * Doktor başvuru formu verilerini FormData'ya çevirir
 */
export const prepareDoctorFormData = (formData: DoctorApplicationData): FormData => {
  const submitData = new FormData();
  submitData.append("user_type", "doctor");

  // Custom fields'ları ekle
  if (formData.customFields) {
    Object.entries(formData.customFields).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        submitData.append(`custom_fields[${key}]`, JSON.stringify(value));
      } else {
        submitData.append(`custom_fields[${key}]`, String(value));
      }
    });
  }

  // Dosyaları ekle
  formData.documentFiles.forEach((file: File, index: number) => {
    submitData.append(`documents[${index}]`, file);
  });

  return submitData;
};

/**
 * Kurum başvuru formu verilerini FormData'ya çevirir
 */
export const prepareCorporateFormData = (formData: CorporateApplicationData): FormData => {
  const submitData = new FormData();
  submitData.append("user_type", "corporate");

  // Custom fields'ları ekle
  if (formData.customFields) {
    Object.entries(formData.customFields).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        submitData.append(`custom_fields[${key}]`, JSON.stringify(value));
      } else {
        submitData.append(`custom_fields[${key}]`, String(value));
      }
    });
  }

  // Dosyaları ekle
  formData.documentFiles.forEach((file: File, index: number) => {
    submitData.append(`documents[${index}]`, file);
  });

  return submitData;
};

/**
 * Doktor başvurusu gönderir
 */
export const submitDoctorApplication = async (
  formData: DoctorApplicationData
): Promise<ApplyProfessionalAccountResponse> => {
  try {
    const submitData = prepareDoctorFormData(formData);
    const response = await api.post(`user/type/apply`, submitData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      status: response.data.status || false,
      message: response.data.message || "Doktor başvurunuz başarıyla gönderildi.",
      data: response.data.data,
    };
  } catch (error: any) {
    throw {
      message: error?.response?.data?.message || "Bir hata oluştu. Lütfen tekrar deneyin.",
      error,
    };
  }
};

/**
 * Kurum başvurusu gönderir
 */
export const submitCorporateApplication = async (
  formData: CorporateApplicationData
): Promise<ApplyProfessionalAccountResponse> => {
  try {
    const submitData = prepareCorporateFormData(formData);
    const response = await api.post(`user/type/apply`, submitData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      status: response.data.status || false,
      message: response.data.message || "Kurum başvurunuz başarıyla gönderildi.",
      data: response.data.data,
    };
  } catch (error: any) {
    throw {
      message: error?.response?.data?.message || "Bir hata oluştu. Lütfen tekrar deneyin.",
      error,
    };
  }
};


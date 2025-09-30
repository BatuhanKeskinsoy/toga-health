import api from "@/lib/axios";

interface ProfessionalAccountData {
  user_type: "doctor" | "corporate";
  specialty_id?: string;
  license_number: string;
  company_name?: string;
  tax_number?: string;
  address?: string;
  phone?: string;
  email?: string;
  documents: Array<{
    document_type: string;
    title: string;
    description: string;
    document: File;
  }>;
}

export async function applyProfessionalAccount(data: FormData) {
  try {
    const res = await api.post(`user/type/apply`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error) {
    console.error("Professional account application error:", error);
    throw error;
  }
}
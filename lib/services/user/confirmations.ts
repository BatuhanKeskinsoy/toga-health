import api from "@/lib/axios";

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

export async function getCustomFieldsForDoctor() {
  try {
    const res = await api.get(`/custom-fields/doctor`);
    return res.data.data;
} catch (error) {
    console.error("Get custom fields for doctor error:", error);
    throw error;
  }
}

export async function getCustomFieldsForCorporate() {
  try {
    const res = await api.get(`/custom-fields/corporate`);
    return res.data.data;
  } catch (error) {
    console.error("Get custom fields for corporate error:", error);
    throw error;
  }
}
import api from "@/lib/axios";
import { 
  CorporatesListResponse, 
  CorporateDetailResponse, 
  CorporatesListParams,
  CorporateUser,
  HospitalDetailResponse
} from "@/lib/types/provider/hospitalTypes";

const API_URL = "/corporates";

// Hastaneleri listele
export async function getCorporates(params?: CorporatesListParams): Promise<CorporatesListResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.city) queryParams.append('city', params.city);
    if (params?.district) queryParams.append('district', params.district);
    if (params?.country) queryParams.append('country', params.country);
    if (params?.is_available !== undefined) queryParams.append('is_available', params.is_available.toString());
    if (params?.emergency_available !== undefined) queryParams.append('emergency_available', params.emergency_available.toString());
    if (params?.online_consultation !== undefined) queryParams.append('online_consultation', params.online_consultation.toString());
    if (params?.home_visit !== undefined) queryParams.append('home_visit', params.home_visit.toString());
    if (params?.["24_7_available"] !== undefined) queryParams.append('24_7_available', params["24_7_available"].toString());
    if (params?.min_rating) queryParams.append('min_rating', params.min_rating.toString());
    if (params?.max_rating) queryParams.append('max_rating', params.max_rating.toString());
    if (params?.branches?.length) queryParams.append('branches', params.branches.join(','));
    if (params?.facilities?.length) queryParams.append('facilities', params.facilities.join(','));
    if (params?.insurance_accepted?.length) queryParams.append('insurance_accepted', params.insurance_accepted.join(','));
    if (params?.payment_methods?.length) queryParams.append('payment_methods', params.payment_methods.join(','));
    if (params?.languages?.length) queryParams.append('languages', params.languages.join(','));
    if (params?.certifications?.length) queryParams.append('certifications', params.certifications.join(','));

    const response = await api.get(`${API_URL}?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Get corporates API error:', error);
    throw error;
  }
}

// Hastane detayını getir
export async function getCorporateDetail(
  slug: string
): Promise<CorporateDetailResponse> {
  try {
    // Tüm yorumları çekmek için büyük bir per_page değeri gönder
    const response = await api.get(`${API_URL}/${slug}?comments_per_page=1000`);
    return response.data;
  } catch (error) {
    console.error('Get corporate detail API error:', error);
    throw error;
  }
}

// Sadece hastaneleri getir (type: "hospital")
export async function getHospitals(params?: Omit<CorporatesListParams, 'type'>): Promise<CorporatesListResponse> {
  return getCorporates({ ...params, type: "hospital" });
}

// Sadece tıp merkezlerini getir (type: "medical_center")
export async function getMedicalCenters(params?: Omit<CorporatesListParams, 'type'>): Promise<CorporatesListResponse> {
  return getCorporates({ ...params, type: "medical_center" });
}

// Sadece klinikleri getir (type: "clinic")
export async function getClinics(params?: Omit<CorporatesListParams, 'type'>): Promise<CorporatesListResponse> {
  return getCorporates({ ...params, type: "clinic" });
}

// Sadece laboratuvarları getir (type: "laboratory")
export async function getLaboratories(params?: Omit<CorporatesListParams, 'type'>): Promise<CorporatesListResponse> {
  return getCorporates({ ...params, type: "laboratory" });
}

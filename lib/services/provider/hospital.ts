import api from "@/lib/axios";
import { 
  CorporatesListResponse, 
  CorporateDetailResponse, 
  CorporatesListParams,
  CorporateUser 
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
export async function getCorporateDetail(slug: string): Promise<CorporateDetailResponse> {
  try {
    const response = await api.get(`${API_URL}/${slug}`);
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

// Legacy compatibility - eski HospitalTypes formatına dönüştür
export function convertToLegacyFormat(corporate: CorporateUser): any {
  return {
    ...corporate,
    type: corporate.corporate?.type || "hospital",
    photo: corporate.photo || "",
    rating: parseFloat(corporate.rating) || 0,
    experience: corporate.corporate?.experience || "",
    description: corporate.corporate?.description || "",
    address: corporate.active_addresses?.[0]?.address || "",
    phone: `${corporate.phone_code}${corporate.phone_number}`,
    location: `${corporate.district}, ${corporate.city}`,
    reviewCount: corporate.corporate?.review_count || 0,
    email: corporate.email,
    website: corporate.corporate?.website || "",
    branches: corporate.corporate?.branches || [],
    facilities: corporate.corporate?.facilities || [],
    workingHours: {
      monday: corporate.corporate?.working_days?.monday ? 
        `${corporate.corporate.working_days.monday.start}-${corporate.corporate.working_days.monday.end}` : null,
      tuesday: corporate.corporate?.working_days?.tuesday ? 
        `${corporate.corporate.working_days.tuesday.start}-${corporate.corporate.working_days.tuesday.end}` : null,
      wednesday: corporate.corporate?.working_days?.wednesday ? 
        `${corporate.corporate.working_days.wednesday.start}-${corporate.corporate.working_days.wednesday.end}` : null,
      thursday: corporate.corporate?.working_days?.thursday ? 
        `${corporate.corporate.working_days.thursday.start}-${corporate.corporate.working_days.thursday.end}` : null,
      friday: corporate.corporate?.working_days?.friday ? 
        `${corporate.corporate.working_days.friday.start}-${corporate.corporate.working_days.friday.end}` : null,
      saturday: corporate.corporate?.working_days?.saturday ? 
        `${corporate.corporate.working_days.saturday.start}-${corporate.corporate.working_days.saturday.end}` : null,
      sunday: corporate.corporate?.working_days?.sunday ? 
        `${corporate.corporate.working_days.sunday.start}-${corporate.corporate.working_days.sunday.end}` : null,
    },
    isAvailable: corporate.corporate?.is_available || false,
    addresses: corporate.active_addresses?.map(addr => ({
      id: addr.id,
      name: addr.name,
      address: addr.address,
      isDefault: addr.is_default,
      isActive: addr.is_active
    })) || [],
    about: {
      description: corporate.corporate?.about?.description || "",
      facilities: corporate.corporate?.about?.facilities || [],
      branches: corporate.corporate?.about?.branches || []
    },
    profile: {
      description: corporate.corporate?.profile?.description || "",
      branches: corporate.corporate?.profile?.branches || []
    },
    services: corporate.active_services?.map(service => ({
      title: service.title,
      description: service.description
    })) || [],
    gallery: corporate.active_gallery?.map(gallery => ({
      id: gallery.id,
      title: gallery.title,
      image: gallery.image,
      description: gallery.description
    })) || [],
    comments: corporate.approved_comments || []
  };
}
import api from "@/lib/axios";
import {
  DoctorsListResponse,
  DoctorDetailResponse,
  DoctorsListParams,
  DoctorUser,
  SpecialistTypes,
} from "@/lib/types/provider/doctorTypes";

const API_URL = "/doctors";

export const getDoctors = async (
  params?: DoctorsListParams
): Promise<DoctorsListResponse> => {
  try {
    const response = await api.get(API_URL, { params });
    return response.data;
  } catch (error) {
    console.error("Get doctors API error:", error);
    throw error;
  }
};

export const getDoctorDetail = async (
  slug: string
): Promise<DoctorDetailResponse> => {
  try {
    const response = await api.get(`${API_URL}/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Get doctor detail API error:", error);
    throw error;
  }
};

// Legacy compatibility - eski SpecialistTypes formatına dönüştür
export function convertToLegacyFormat(doctor: DoctorUser): SpecialistTypes {
  return {
    id: doctor.id,
    slug: doctor.slug,
    name: doctor.name,
    type: doctor.doctor?.type || "specialist",
    photo: doctor.photo || doctor.active_gallery?.[0]?.image || "",
    rating: parseFloat(doctor.rating) || 0,
    experience: doctor.doctor?.experience || "",
    description: doctor.doctor?.description || "",
    address: doctor.active_addresses?.[0]?.address || "",
    phone: `${doctor.phone_code}${doctor.phone_number}`,
    location: `${doctor.district}, ${doctor.city}`,
    reviewCount: doctor.doctor?.review_count || 0,
    email: doctor.email,
    website: "", // Doctor API'de website yok
    branches: doctor.doctor?.branches || [],
    facilities: [], // Doctor API'de facilities yok
    workingHours: {
      monday: doctor.doctor?.working_days?.monday && doctor.doctor.working_days.monday.start && doctor.doctor.working_days.monday.end ?
        `${doctor.doctor.working_days.monday.start}-${doctor.doctor.working_days.monday.end}` : null,
      tuesday: doctor.doctor?.working_days?.tuesday && doctor.doctor.working_days.tuesday.start && doctor.doctor.working_days.tuesday.end ?
        `${doctor.doctor.working_days.tuesday.start}-${doctor.doctor.working_days.tuesday.end}` : null,
      wednesday: doctor.doctor?.working_days?.wednesday && doctor.doctor.working_days.wednesday.start && doctor.doctor.working_days.wednesday.end ?
        `${doctor.doctor.working_days.wednesday.start}-${doctor.doctor.working_days.wednesday.end}` : null,
      thursday: doctor.doctor?.working_days?.thursday && doctor.doctor.working_days.thursday.start && doctor.doctor.working_days.thursday.end ?
        `${doctor.doctor.working_days.thursday.start}-${doctor.doctor.working_days.thursday.end}` : null,
      friday: doctor.doctor?.working_days?.friday && doctor.doctor.working_days.friday.start && doctor.doctor.working_days.friday.end ?
        `${doctor.doctor.working_days.friday.start}-${doctor.doctor.working_days.friday.end}` : null,
      saturday: doctor.doctor?.working_days?.saturday && doctor.doctor.working_days.saturday.start && doctor.doctor.working_days.saturday.end ?
        `${doctor.doctor.working_days.saturday.start}-${doctor.doctor.working_days.saturday.end}` : null,
      sunday: doctor.doctor?.working_days?.sunday && doctor.doctor.working_days.sunday.start && doctor.doctor.working_days.sunday.end ?
        `${doctor.doctor.working_days.sunday.start}-${doctor.doctor.working_days.sunday.end}` : null,
    },
    isAvailable: doctor.doctor?.is_available || false,
    addresses: doctor.active_addresses?.map(addr => ({
      id: addr.id,
      name: addr.name,
      address: addr.address,
      isDefault: addr.is_default,
      isActive: addr.is_active
    })) || [],
    about: {
      description: doctor.doctor?.about?.description || "",
      facilities: doctor.doctor?.about?.branches || [],
      branches: doctor.doctor?.about?.branches || []
    },
    profile: {
      description: doctor.doctor?.profile?.description || "",
      branches: doctor.doctor?.profile?.branches || []
    },
    services: doctor.active_services?.map(service => ({
      title: service.title,
      description: service.description
    })) || [],
    gallery: doctor.active_gallery?.map(gallery => ({
      id: gallery.id,
      title: gallery.title,
      image: gallery.image,
      description: gallery.description
    })) || [],
    comments: doctor.approved_comments || [],
    specialty: {
      id: doctor.doctor?.specialty?.id || 0,
      name: doctor.doctor?.specialty?.name || "",
      slug: doctor.doctor?.specialty?.slug || "",
      description: doctor.doctor?.specialty?.description || ""
    },
    education: doctor.doctor?.education || [],
    experience_list: doctor.doctor?.experience_list || [],
    certifications: doctor.doctor?.certifications || [],
    languages: doctor.doctor?.languages || [],
    insurance_accepted: doctor.doctor?.insurance_accepted || [],
    payment_methods: doctor.doctor?.payment_methods || [],
    consultation_fee: doctor.doctor?.consultation_fee || "0",
    examination_fee: doctor.doctor?.examination_fee || "0",
    appointment_duration: doctor.doctor?.appointment_duration || 30,
    online_consultation: doctor.doctor?.online_consultation || false,
    home_visit: doctor.doctor?.home_visit || false,
    emergency_available: doctor.doctor?.emergency_available || false
  };
}

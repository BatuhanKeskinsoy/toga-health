import { CorporateUser, HospitalDetailResponse } from "./corporateTypes";
import { DoctorUser, DoctorDetailResponse } from "./doctorTypes";
import { Provider, DoctorDetailResponse as NewDoctorDetailResponse, CorporateDetailResponse } from "../providers/providersTypes";

// Ortak provider type'ı - hospital, doctor veya disease provider olabilir
export type ProviderData = CorporateUser | DoctorUser | Provider | HospitalDetailResponse | DoctorDetailResponse | NewDoctorDetailResponse | CorporateDetailResponse;

// Provider türünü belirleyen type guard'lar
export const isHospitalData = (data: ProviderData): data is CorporateUser => {
  return 'corporate' in data;
};

export const isDoctorData = (data: ProviderData): data is DoctorUser => {
  return 'doctor' in data;
};

export const isDiseaseProviderData = (data: ProviderData): data is Provider => {
  return 'user_type' in data && (data.user_type === 'doctor' || data.user_type === 'corporate') && 'diseases' in data;
};

export const isHospitalDetailData = (data: ProviderData): data is HospitalDetailResponse | CorporateDetailResponse => {
  return 'user_type' in data && data.user_type === 'corporate' && 'corporate_info' in data && 'doctors' in data;
};

export const isDoctorDetailData = (data: ProviderData): data is DoctorDetailResponse | NewDoctorDetailResponse => {
  return 'user_type' in data && data.user_type === 'doctor' && 'doctor_info' in data && 'comments_pagination' in data;
};

// Ortak provider props interface'i
export interface ProviderProps {
  isHospital: boolean;
  providerData?: ProviderData | null;
  providerError?: string | null;
}

// Provider card props
export interface ProviderCardProps {
  onList?: boolean;
  isHospital: boolean;
  providerData?: ProviderData | null;
}

// Provider main props
export interface ProviderMainProps {
  isHospital: boolean;
  providerData?: ProviderData | null;
}

// Provider view props
export interface ProviderViewProps {
  isHospital: boolean;
  providerData?: ProviderData | null;
  providerError?: string | null;
  initialAppointmentData?: any | null; // Server-side'da çekilen ilk appointment verisi
}

// Provider sidebar props
export interface ProviderSidebarProps {
  isHospital: boolean;
  providerData?: ProviderData | null;
  providerError?: string | null;
  onList?: boolean; // Liste görünümü için
  initialAppointmentData?: any | null; // Server-side'da çekilen ilk appointment verisi
}

// Tab component props
export interface TabComponentProps {
  isHospital: boolean;
  providerData?: ProviderData | null;
  selectedAddress?: any;
}

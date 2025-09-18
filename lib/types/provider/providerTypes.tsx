import { CorporateUser } from "./hospitalTypes";
import { DoctorUser } from "./doctorTypes";

// Ortak provider type'ı - hospital veya doctor olabilir
export type ProviderData = CorporateUser | DoctorUser;

// Provider türünü belirleyen type guard'lar
export const isHospitalData = (data: ProviderData): data is CorporateUser => {
  return 'corporate' in data;
};

export const isDoctorData = (data: ProviderData): data is DoctorUser => {
  return 'doctor' in data;
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
}

// Provider sidebar props
export interface ProviderSidebarProps {
  isHospital: boolean;
  providerData?: ProviderData | null;
  providerError?: string | null;
}

// Tab component props
export interface TabComponentProps {
  isHospital: boolean;
  providerData?: ProviderData | null;
  selectedAddress?: any;
}

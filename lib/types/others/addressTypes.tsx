export interface DoctorAddress {
  id: string;
  name: string;
  address: string;
  city: string;
  district: string;
  phone: string;
  workingHours: {
    start: string;
    end: string;
  };
  isActive: boolean;
  isDefault?: boolean;
  doctorPhoto?: string;
  doctorName: string;
  doctorSpecialty: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  features?: string[];
}

export interface AddressSelectionProps {
  addresses: DoctorAddress[];
  selectedAddress: DoctorAddress | null;
  onAddressSelect: (address: DoctorAddress) => void;
  isLoading?: boolean;
}

export interface DoctorInfo {
  id: string;
  name: string;
  specialty: string;
  photo: string;
  description: string;
}

export interface AddressData {
  doctor: DoctorInfo;
  addresses: DoctorAddress[];
} 
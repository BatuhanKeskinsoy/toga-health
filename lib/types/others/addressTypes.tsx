export interface DoctorAddress {
  id: string;
  name: string;
  address: string;
  doctorPhoto?: string;
  doctorName: string;
  doctorSpecialty: string;
}

export interface AddressSelectionProps {
  addresses: DoctorAddress[];
  selectedAddress: DoctorAddress | null;
  onAddressSelect: (address: DoctorAddress) => void;
  isLoading?: boolean;
  isHospital?: boolean;
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
export interface HospitalTypes {
  id: number;
  slug: string;
  name: string;
  type: string;
  photo: string;
  rating: number;
  experience: string;
  description: string;
  address: string;
  phone: string;
  location: string;
  reviewCount: number;
  email: string;
  website: string;
  branches: string[];
  facilities: string[];
  workingHours: {
    monday: string | null;
    tuesday: string | null;
    wednesday: string | null;
    thursday: string | null;
    friday: string | null;
    saturday: string | null;
    sunday: string | null;
  };
  isAvailable: boolean;
  addresses: {
    id: number;
    name: string;
    address: string;
    isDefault: boolean;
    isActive: boolean;
  }[];
  about: {
    description: string;
    facilities: string[];
    branches: string[];
  };
  profile: {
    description: string;
    branches: string[];
  };
  services: {
    title: string;
    description: string;
  }[];
  gallery: {
    id: number;
    title: string;
    image: string;
    description: string;
  }[];
  comments: {
    id: number;
    author: string;
    rating: number;
    date: Date | string;
    comment: string;
  }[];
}

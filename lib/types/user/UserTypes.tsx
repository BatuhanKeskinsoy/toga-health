interface Location {
  country: string;
  city: string | null;
  district: string | null;
  address: string | null;
  full_address: string;
  country_slug: string;
  city_slug: string | null;
  district_slug: string | null;
}

interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  has_more: boolean;
}

export interface UserTypes {
  id: number;
  slug: string;
  name: string;
  email: string;
  phone: string;
  photo: string | null;
  rating: number | null;
  user_type: "individual" | "doctor" | "corporate";
  location: Location;
  diseases: any[];
  treatments: any[];
  services: any[];
  addresses: any[];
  gallery: any[];
  gallery_pagination: Pagination;
  comments: any[];
  comments_count: number;
  comments_pagination: Pagination;
  working_hours: any[];
  holidays: any[];
  notification_count: number;
  message_count: number;
};
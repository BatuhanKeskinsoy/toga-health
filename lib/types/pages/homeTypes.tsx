export interface HomeDoctor {
  id: number;
  name: string;
  expert_title: string | null;
  slug: string;
  photo: string;
  rating: number | null;
  user_type: "doctor";
  location: {
    country: string;
    city: string;
    district: string;
    country_slug: string;
    city_slug: string;
    district_slug: string;
  };
  specialty: {
    id: number;
    name: string;
    slug: string;
    translations?: {
      id: number;
      lang: string;
      name: string;
      slug: string;
    }[];
  } | null;
  hospital: {
    id: number | null;
    name: string | null;
    slug: string | null;
  };
}

export interface HomeHospital {
  id: number;
  name: string;
  slug: string;
  photo: string;
  rating: number | null;
  user_type: "corporate";
  location: {
    country: string;
    city: string;
    district: string;
    country_slug: string;
    city_slug: string;
    district_slug: string;
  };
  type: "hospital" | "clinic" | "medical_center" | "laboratory" | null;
}

export interface HomeComment {
  id: number;
  comment_id: number | null;
  user_id: number;
  receiver_id: number;
  author: string;
  rating: number;
  comment_date: string;
  comment: string;
  is_approved: boolean;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  parent_comment_id: number | null;
  answer: {
    id: number;
    name: string;
    expert_title: string | null;
    photo: string | null;
    age: number | null;
    country_slug: string | null;
    city_slug: string | null;
    district_slug: string | null;
    rating: number;
    hospital: {
      id: number | null;
      name: string | null;
      slug: string | null;
    };
    image_url: string;
    user_type: string;
    slug: string;
    country: string | null;
    city: string | null;
    district: string | null;
    doctor: {
      id: number;
      user_id: number;
      specialty_id: number;
      specialty: {
        id: number;
        name: string;
        slug: string;
        translations?: {
          id: number;
          lang: string;
          name: string;
          slug: string;
        }[];
      };
    };
  };
}

export interface HomeFAQ {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  lang_code: string;
  created_at: string;
  updated_at: string;
}

export interface PopularCountry {
  country: string;
  doctors_count: string;
  company_count: string;
}

export interface PopularSpecialty {
  id: number;
  name: string;
  slug: string;
  description: string;
  lang_code: string;
  parent_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  doctors_count: number;
}

export interface HomeData {
  doctors: HomeDoctor[];
  hospitals: HomeHospital[];
  comments: HomeComment[];
  faqs: HomeFAQ[];
  doctors_count: number;
  hospitals_count: number;
  countries_count: number;
  populer_countries: PopularCountry[];
  populer_specialties: PopularSpecialty[];
}

export interface HomeResponse {
  status: boolean;
  data: HomeData;
}

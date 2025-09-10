export interface Country {
  id: number;
  name: string;
  slug: string;
  code: string;
  rewrite: string;
}

export interface City {
  id: number;
  name: string;
  slug: string;
  country_id: number;
  countrySlug?: string; // Backward compatibility için
}

export interface District {
  id: number;
  name: string;
  slug: string;
  city_id: number;
  citySlug?: string; // Backward compatibility için
}


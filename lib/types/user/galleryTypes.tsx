// Galeri öğesi tipi
export interface GalleryItem {
  id: number;
  gallery_id: string;
  user_id: number;
  type: "image" | "video";
  title: string | null;
  image: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  image_url: string;
}

// Galeri oluşturma/güncelleme için form data tipi
export interface CreateGalleryFormData {
  images: File[];
  type: "image" | "video";
  title?: string;
  titles?: string[];
  video_links?: string[];
}

// Galeri oluşturma response tipi
export interface CreateGalleryResponse {
  status: boolean;
  message: string;
  data: {
    galleries: GalleryItem[];
    success_count: number;
    failed_count: number;
    total: number;
  };
}

// Galeri listesi response tipi
export interface GetGalleryResponse {
  status: boolean;
  message: string;
  data: GalleryItem[];
}

// Galeri güncelleme response tipi
export interface UpdateGalleryResponse {
  status: boolean;
  message: string;
  data: GalleryItem;
}

// Galeri silme response tipi
export interface DeleteGalleryResponse {
  status: boolean;
  message: string;
}

import api from "@/lib/axios";
import {
  CreateGalleryFormData,
  CreateGalleryResponse,
  GetGalleryResponse,
  UpdateGalleryResponse,
  DeleteGalleryResponse,
} from "@/lib/types/user/galleryTypes";

// Tüm Galeriyi getir
export async function getUserGallery(): Promise<GetGalleryResponse> {
  const res = await api.get(`/provider/gallery`);
  return res.data;
}

// Galeri oluştur
export async function createUserGallery(
  gallery: CreateGalleryFormData
): Promise<CreateGalleryResponse> {
  const formData = new FormData();
  
  // Dosyaları form data'ya ekle
  gallery.images.forEach((image, index) => {
    formData.append(`images[${index}]`, image);
  });
  
  // Tip bilgisini ekle
  formData.append("type", gallery.type);
  
  // Genel başlık varsa ekle
  if (gallery.title) {
    formData.append("title", gallery.title);
  }
  
  // Her resim için ayrı başlık varsa ekle
  if (gallery.titles && gallery.titles.length > 0) {
    gallery.titles.forEach((title, index) => {
      formData.append(`titles[${index}]`, title);
    });
  }

  // Video linklerini ekle
  if (gallery.video_links && gallery.video_links.length > 0) {
    gallery.video_links.forEach((link, index) => {
      formData.append(`video_links[${index}]`, link);
    });
  }

  const res = await api.post(`/provider/gallery`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

// Galeri güncelle
export async function updateUserGallery(
  galleryId: number,
  gallery: CreateGalleryFormData
): Promise<UpdateGalleryResponse> {
  if (gallery.type === "video") {
    // Video için JSON gönder - tek video_link
    const videoData = {
      type: "video",
      title: (gallery.titles && gallery.titles.length > 0) 
        ? gallery.titles[0] 
        : gallery.title || "",
      video_link: gallery.video_links?.[0] || ""
    };

    const res = await api.post(`/provider/gallery/${galleryId}/update`, videoData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } else {
    // Image için multipart/form-data gönder
    const formData = new FormData();
    
    // Update için tek dosya gönder
    if (gallery.images && gallery.images.length > 0) {
      formData.append(`image`, gallery.images[0]);
    }
    
    // Tip bilgisini ekle
    formData.append("type", gallery.type);
    
    // Update için tek title gönder
    const titleToSend = (gallery.titles && gallery.titles.length > 0) 
      ? gallery.titles[0] 
      : gallery.title;
    
    if (titleToSend) {
      formData.append("title", titleToSend);
    }

    const res = await api.post(`/provider/gallery/${galleryId}/update`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }
}

// Galeri sil
export async function deleteUserGallery(galleryId: number): Promise<DeleteGalleryResponse> {
  const res = await api.delete(`/provider/gallery/${galleryId}`);
  return res.data;
}

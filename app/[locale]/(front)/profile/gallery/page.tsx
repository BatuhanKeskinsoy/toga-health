import React from 'react';
import { getUserGallery } from '@/lib/services/user/gallery';
import GalleryContent from '@/components/(front)/UserProfile/Gallery/GalleryContent';

export default async function GalleryPage() {

  // Server-side'da galeri verilerini çek
  let galleryItems = [];
  let error = null;

  try {
    const response = await getUserGallery();
    galleryItems = response.data || [];
  } catch (err) {
    console.error('Galeri verileri yüklenirken hata:', err);
    error = 'Galeri verileri yüklenirken bir hata oluştu';
  }

  return (
    <GalleryContent 
      initialGalleryItems={galleryItems}
      initialError={error}
    />
  );
}
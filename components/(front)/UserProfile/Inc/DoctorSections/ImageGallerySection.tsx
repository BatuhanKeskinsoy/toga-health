"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { FiImage, FiPlus, FiTrash2, FiEye, FiX, FiUpload } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { useTranslations } from "next-intl";

interface ImageGallerySectionProps {
  formData: {
    images: any[];
  };
  updateArrayField: (field: string, value: any) => void;
}

export default function ImageGallerySection({ formData, updateArrayField }: ImageGallerySectionProps) {
  // Local state for image gallery
  const [imageGallery, setImageGallery] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations();

  // Initialize image gallery from form data (images array)
  useEffect(() => {
    // Only update gallery if images array exists and has content
    if (formData.images && Array.isArray(formData.images) && formData.images.length > 0) {
      // Convert images array to gallery format for display
      const imageItems = formData.images.map((image, index) => {
        // Handle different image formats (File objects, URLs, or objects)
        if (image instanceof File) {
          // If it's a File object
          return {
            id: `file_${Date.now()}_${index}`,
            link: URL.createObjectURL(image),
            type: "image",
            name: image.name,
            file: image,
            isNew: true
          };
        } else if (typeof image === 'string') {
          // If it's a URL string (existing image from server)
          return {
            id: `url_${Date.now()}_${index}`,
            link: image,
            type: "image",
            name: `Resim ${index + 1}`,
            file: null,
            isNew: false,
            originalUrl: image
          };
        } else if (image && typeof image === 'object') {
          // If it's an object with link/url
          return {
            id: image.id || `obj_${Date.now()}_${index}`,
            link: image.link || image.url || image.src || '',
            type: "image",
            name: image.name || `Resim ${index + 1}`,
            file: image.file || null,
            isNew: false,
            originalUrl: image.link || image.url || image.src || ''
          };
        }
        return null;
      }).filter(Boolean); // Remove null items
      
      setImageGallery(imageItems);
    } else if (!formData.images || formData.images.length === 0) {
      setImageGallery([]);
    }
    // If formData.images is undefined, don't change the gallery (preserve existing state)
  }, [formData.images]); // Only depend on images array, not entire formData

  // Handle file selection
  const handleFileSelect = useCallback((files: FileList) => {
    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );

    if (imageFiles.length === 0) {
      alert("Lütfen geçerli resim dosyaları seçiniz");
      return;
    }

    // Convert files to images array format
    const newImageItems = imageFiles.map(file => ({
      id: `new_${Date.now()}_${Math.random()}`, // Unique ID for local state only
      file: file, // Keep the file object
      link: URL.createObjectURL(file), // Create preview URL for display
      name: file.name,
      isNew: true
    }));

    const updatedGallery = [...imageGallery, ...newImageItems];
    setImageGallery(updatedGallery);
    
    // Update the images array with both existing URLs and new File objects
    const updatedImagesArray = updatedGallery.map(item => {
      if (item.file) {
        // New file
        return item.file;
      } else if (item.originalUrl) {
        // Existing image from server
        return item.originalUrl;
      }
      return null;
    }).filter(Boolean);
    
    // Update the form data
    updateArrayField('images', updatedImagesArray);
  }, [imageGallery, updateArrayField]);

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileSelect(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files) {
      handleFileSelect(files);
    }
  };

  // Handle image removal
  const handleRemoveImage = useCallback(async (index: number) => {
    const imageToRemove = imageGallery[index];
    
    // Check if this is an existing image from server (has originalUrl and no file)
    if (imageToRemove.originalUrl && !imageToRemove.file) {
      // Show confirmation dialog using SweetAlert2
      const result = await Swal.fire({
        title: 'Emin misiniz?',
        text: 'Bu fotoğrafı silmek istediğinizden emin misiniz?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Evet, Sil',
        cancelButtonText: 'Vazgeç',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        reverseButtons: true
      });
      
      if (!result.isConfirmed) {
        return;
      }
      
      try {
        // For now, just remove from local state (API call will be implemented later)
        const updatedGallery = imageGallery.filter((_, i) => i !== index);
        setImageGallery(updatedGallery);
        
        // Update the images array
        const updatedImagesArray = updatedGallery.map(item => {
          if (item.file) {
            return item.file;
          } else if (item.originalUrl) {
            return item.originalUrl;
          }
          return null;
        }).filter(Boolean);
        
        // Update form data
        if (updatedImagesArray.length > 0) {
          updateArrayField('images', updatedImagesArray);
        } else {
          updateArrayField('images', []);
        }
        
      } catch (error) {
        console.error('Error deleting image:', error);
        Swal.fire({
          title: 'Hata!',
          text: 'Fotoğraf silinirken bir hata oluştu. Lütfen tekrar deneyin.',
          icon: 'error',
          confirmButtonText: 'Tamam',
          confirmButtonColor: '#dc3545'
        });
      }
    } else {
      // For new images (File objects), just remove from local state
      const updatedGallery = imageGallery.filter((_, i) => i !== index);
      setImageGallery(updatedGallery);
      
      // Update the images array
      const updatedImagesArray = updatedGallery.map(item => {
        if (item.file) {
          return item.file;
        } else if (item.originalUrl) {
          return item.originalUrl;
        }
        return null;
      }).filter(Boolean);
      
      // Update form data
      if (updatedImagesArray.length > 0) {
        updateArrayField('images', updatedImagesArray);
      } else {
        updateArrayField('images', []);
      }
    }
  }, [imageGallery, updateArrayField]);

  // Open image modal
  const openImageModal = (image: any) => {
    setSelectedImage(image);
  };

  // Close image modal
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-sitePrimary/20 to-sitePrimary/30 rounded-xl flex items-center justify-center">
            <FiImage className="text-sitePrimary text-lg" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Fotoğraf Galerisi</h2>
            <p className="text-gray-600 text-sm">Profiliniz için profesyonel fotoğraflar ekleyin</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
              isDragOver 
                ? 'border-sitePrimary bg-gradient-to-r from-sitePrimary/5 to-sitePrimary/10' 
                : 'border-gray-200 hover:border-sitePrimary/50 hover:bg-gray-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-sitePrimary/10 to-sitePrimary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUpload className="text-2xl text-sitePrimary" />
            </div>
            <p className="text-gray-700 mb-2 font-medium">
              Resim dosyalarını buraya sürükleyin veya tıklayarak seçin
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Desteklenen formatlar: JPG, JPEG, PNG, GIF, WebP
            </p>
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-sitePrimary text-white px-8 py-3 rounded-xl hover:bg-sitePrimary/90 transition-all duration-200 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
            >
              <FiPlus className="text-lg" />
              Resim Seç
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
              capture="environment"
            />
            
            <div className="text-xs text-gray-500 mt-4">
              Birden fazla resim seçebilirsiniz (JPG, PNG, GIF, WebP)
            </div>
          </div>
          
          {imageGallery.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {imageGallery.map((image, index) => (
                <div key={image.id || index} className="relative group aspect-square">
                  {/* Image */}
                  <img
                    src={image.link}
                    alt={image.name || `Galeri Resmi ${index + 1}`}
                    className="w-full h-full object-cover rounded-xl cursor-pointer border border-gray-200"
                    onClick={() => openImageModal(image)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  
                  {/* New Image Badge */}
                  {image.isNew && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                      Yeni
                    </div>
                  )}
                  
                  {/* Error Fallback */}
                  <div className="hidden w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl items-center justify-center border border-gray-200">
                    <div className="text-center">
                      <FiImage className="text-2xl text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Resim yüklenemedi</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons - Fixed in top right */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {/* View Button */}
                    <button
                      type="button"
                      onClick={() => openImageModal(image)}
                      className="bg-sitePrimary text-white p-1.5 rounded-full hover:bg-sitePrimary/90 transition-all duration-200 cursor-pointer shadow-lg"
                      title="Resmi Büyüt"
                    >
                      <FiEye size={14} />
                    </button>
                    
                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white p-1.5 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-200 cursor-pointer shadow-lg"
                      title="Resmi Kaldır"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                  
                  {/* Image Name */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-xs p-3 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity">
                    {image.name}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiImage className="text-3xl text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium mb-2">Henüz resim eklenmemiş</p>
              <p className="text-sm text-gray-500">Resim dosyalarını sürükleyin veya seçin</p>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage.link}
              alt={selectedImage.name || 'Büyük Resim'}
              className="max-w-full max-h-full object-contain rounded-xl"
            />
            
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all duration-200 cursor-pointer"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

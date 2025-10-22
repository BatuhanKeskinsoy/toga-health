"use client";
import React, { useState, useEffect } from "react";
import { GalleryItem } from "@/lib/types/user/galleryTypes";
import { getUserGallery } from "@/lib/services/user/gallery";
import GalleryItemComponent from "./GalleryItem";
import GalleryUploadModal from "./GalleryUploadModal";

export default function GalleryList() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");

  // Galeri verilerini yükle
  const loadGallery = async () => {
    try {
      const response = await getUserGallery();
      setGalleryItems(response.data);
    } catch (error) {
      console.error("Galeri yüklenirken hata:", error);
    } finally {
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  // Galeri öğesi silme
  const handleDelete = (id: number) => {
    setGalleryItems(prev => prev.filter(item => item.id !== id));
  };

  // Galeri öğesi düzenleme
  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setIsUploadModalOpen(true);
  };

  // Modal kapatma
  const handleCloseModal = () => {
    setIsUploadModalOpen(false);
    setEditingItem(null);
  };

  // Başarılı yükleme sonrası
  const handleUploadSuccess = () => {
    loadGallery();
  };

  // Filtrelenmiş öğeler
  const filteredItems = galleryItems.filter(item => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Galeri</h1>
          <p className="text-gray-600 mt-1">
            Toplam {galleryItems.length} öğe
          </p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Yeni Ekle</span>
        </button>
      </div>

      {/* Filtreler */}
      <div className="flex space-x-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Tümü ({galleryItems.length})
        </button>
        <button
          onClick={() => setFilter("image")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "image"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Resimler ({galleryItems.filter(item => item.type === "image").length})
        </button>
        <button
          onClick={() => setFilter("video")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "video"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Videolar ({galleryItems.filter(item => item.type === "video").length})
        </button>
      </div>

      {/* Galeri Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {filter === "all" ? "Henüz galeri öğesi yok" : `Henüz ${filter === "image" ? "resim" : "video"} yok`}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === "all" 
              ? "İlk galeri öğenizi eklemek için yukarıdaki butona tıklayın."
              : `İlk ${filter === "image" ? "resminizi" : "videonuzu"} eklemek için yukarıdaki butona tıklayın.`
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <GalleryItemComponent
              key={item.id}
              item={item}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <GalleryUploadModal
          onClose={handleCloseModal}
          onSuccess={handleUploadSuccess}
          editItem={editingItem}
        />
      )}
    </div>
  );
}

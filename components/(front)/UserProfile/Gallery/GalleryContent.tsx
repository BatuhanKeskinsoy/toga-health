"use client";
import React, { useState } from "react";
import { GalleryItem } from "@/lib/types/user/galleryTypes";
import { getUserGallery } from "@/lib/services/user/gallery";
import CustomButton from "@/components/others/CustomButton";
import { IoAddOutline, IoRefreshOutline } from "react-icons/io5";
import GalleryItemComponent from "./GalleryItem";
import GalleryUploadModal from "./GalleryUploadModal";

interface GalleryContentProps {
  user: any;
  initialGalleryItems: GalleryItem[];
  initialError: string | null;
}

export default function GalleryContent({
  user,
  initialGalleryItems,
  initialError,
}: GalleryContentProps) {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialGalleryItems);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [error, setError] = useState<string | null>(initialError);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");

  // Yenile butonu
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      const response = await getUserGallery();
      setGalleryItems(response.data || []);
    } catch (err) {
      console.error("Galeri yüklenirken hata:", err);
      setError("Galeri yüklenirken bir hata oluştu");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Galeri öğesi oluşturulduktan sonra listeyi yenile
  const handleGalleryCreated = () => {
    setShowUploadModal(false);
    setEditingItem(null);
    handleRefresh();
  };

  // Galeri öğesi güncellendikten sonra listeyi yenile
  const handleGalleryUpdated = () => {
    handleRefresh();
  };

  // Galeri öğesi silindikten sonra listeyi yenile
  const handleGalleryDeleted = (id: number) => {
    setGalleryItems(prev => prev.filter(item => item.id !== id));
  };

  // Galeri öğesi düzenleme
  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setShowUploadModal(true);
  };

  // Modal kapatma
  const handleCloseModal = () => {
    setShowUploadModal(false);
    setEditingItem(null);
  };

  // Filtrelenmiş öğeler
  const filteredItems = galleryItems.filter(item => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  return (
    <div className="flex max-lg:flex-col lg:gap-8 gap-4 w-full">
      {/* Header Section */}
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Galeri</h1>
          <div className="flex gap-3">
            <CustomButton
              title={isRefreshing ? "Yenileniyor..." : "Yenile"}
              containerStyles="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              leftIcon={<IoRefreshOutline className="text-lg" />}
              handleClick={handleRefresh}
              isDisabled={isRefreshing}
            />
            <CustomButton
              title="Yeni Ekle"
              containerStyles="flex items-center gap-2 px-4 py-2 bg-sitePrimary text-white rounded-md hover:bg-sitePrimary/90 transition-colors"
              leftIcon={<IoAddOutline className="text-lg" />}
              handleClick={() => setShowUploadModal(true)}
            />
          </div>
        </div>

        {/* Filtreler */}
        {galleryItems.length > 0 && (
          <div className="flex space-x-2 mt-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-sitePrimary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tümü ({galleryItems.length})
            </button>
            <button
              onClick={() => setFilter("image")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "image"
                  ? "bg-sitePrimary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Resimler ({galleryItems.filter(item => item.type === "image").length})
            </button>
            <button
              onClick={() => setFilter("video")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "video"
                  ? "bg-sitePrimary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Videolar ({galleryItems.filter(item => item.type === "video").length})
            </button>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
            <CustomButton
              title="Tekrar Dene"
              containerStyles="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
              handleClick={handleRefresh}
            />
          </div>
        )}

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <IoAddOutline className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filter === "all" ? "Henüz galeri öğesi yok" : `Henüz ${filter === "image" ? "resim" : "video"} yok`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === "all" 
                ? "İlk galeri öğenizi ekleyerek başlayın"
                : `İlk ${filter === "image" ? "resminizi" : "videonuzu"} ekleyerek başlayın`
              }
            </p>
            <CustomButton
              title="İlk Öğemi Ekle"
              containerStyles="flex items-center gap-2 px-6 py-3 bg-sitePrimary text-white rounded-md hover:bg-sitePrimary/90 transition-colors"
              leftIcon={<IoAddOutline className="text-lg" />}
              handleClick={() => setShowUploadModal(true)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {filteredItems.map((item) => (
              <GalleryItemComponent
                key={item.id}
                item={item}
                onDelete={handleGalleryDeleted}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <GalleryUploadModal
          onClose={handleCloseModal}
          onSuccess={handleGalleryCreated}
          editItem={editingItem}
        />
      )}
    </div>
  );
}

"use client";
import Image from "next/image";
import React, { useState } from "react";
import { IoExpand } from "react-icons/io5";
import Zoom from "react-medium-image-zoom";
import { getYoutubeThumbnail, extractYoutubeVideoId } from "@/lib/functions/getYoutubeThumbnail";
import { useTranslations } from "next-intl";

interface VideoZoomProps {
  thumbnail: string;
  youtubeId: string;
  title: string;
}

const VideoZoom: React.FC<VideoZoomProps> = ({ thumbnail, youtubeId, title }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsZoomed(false);
    }
  };

  return (
    <>
      <div
        className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden group cursor-pointer"
        onClick={() => setIsZoomed(true)}
      >
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-sitePrimary/30 transition-all duration-300 pointer-events-none flex items-center justify-center">
          <IoExpand className="text-4xl text-white group-hover:scale-125 transition-all duration-300" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <h5 className="text-white text-sm font-medium">{title}</h5>
        </div>
      </div>

      {isZoomed && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div className="relative w-full max-w-4xl aspect-video">
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300 transition-colors"
            >
              ✕
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
              title={title}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
};

interface GalleryProps {
  isHospital?: boolean;
  hospitalData?: any;
  specialistData?: any;
}

function Gallery({ isHospital = false, hospitalData, specialistData }: GalleryProps) {
  const t = useTranslations()
  const gallery = isHospital ? hospitalData?.gallery : specialistData?.gallery;
  const videos = isHospital ? hospitalData?.videos : specialistData?.videos;

  if (!gallery) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">{t('Yükleniyor')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {t('Galeri')}
        </h3>
        <p className="text-gray-600">
          {t('Muayenehane ve tedavi süreçlerinden görüntüler')}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((item: any, index: number) => (
          <div
            key={index}
            className="relative w-full h-40 rounded-md overflow-hidden group"
          >
            <Zoom>
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="w-full h-full object-cover transition-transform duration-300"
              />
            </Zoom>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-sitePrimary/30 transition-all duration-300 pointer-events-none flex items-center justify-center">
              <IoExpand className="text-4xl text-white group-hover:scale-125 transition-all duration-300" />
            </div>
          </div>
        ))}
      </div>

      {videos && videos.length > 0 && (
        <div className="flex flex-col gap-3 mt-4">
          <h4 className="text-md font-medium text-gray-700">
            {t('Video Galeri')}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video: any, index: number) => {
              const videoId = extractYoutubeVideoId(video.url);
              const thumbnail = getYoutubeThumbnail(video.url, 'maxres');
              
              return (
                <VideoZoom
                  key={index}
                  thumbnail={thumbnail}
                  youtubeId={videoId}
                  title={video.title}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;

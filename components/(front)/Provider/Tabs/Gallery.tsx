import Image from "next/image";
import React, { useState } from "react";
import { IoExpand } from "react-icons/io5";
import Zoom from "react-medium-image-zoom";
import { getYoutubeThumbnail, extractYoutubeVideoId } from "@/lib/functions/getYoutubeThumbnail";

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
}

function Gallery({ isHospital = false }: GalleryProps) {
  // Hastane galeri verileri
  const hospitalGallery = [
    {
      src: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&h=1200&fit=crop&crop=center",
      alt: "Hastane Dış Görünüm"
    },
    {
      src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=1200&fit=crop&crop=center",
      alt: "Acil Servis"
    },
    {
      src: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&h=1200&fit=crop&crop=center",
      alt: "Ameliyathane"
    },
    {
      src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=1200&fit=crop&crop=center",
      alt: "Yoğun Bakım Ünitesi"
    },
    {
      src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=1200&fit=crop&crop=center",
      alt: "Laboratuvar"
    },
    {
      src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=1200&fit=crop&crop=center",
      alt: "Radyoloji Merkezi"
    },
    {
      src: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&h=1200&fit=crop&crop=center",
      alt: "Fizik Tedavi Merkezi"
    },
    {
      src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=1200&fit=crop&crop=center",
      alt: "Poliklinik"
    }
  ];

  // Doktor galeri verileri
  const doctorGallery = [
    {
      src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&h=1200&fit=crop&crop=face",
      alt: "Doktor Muayene"
    },
    {
      src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&h=1200&fit=crop&crop=face",
      alt: "Doktor Muayene"
    },
    {
      src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&h=1200&fit=crop&crop=face",
      alt: "Doktor Muayene"
    },
    {
      src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&h=1200&fit=crop&crop=face",
      alt: "Doktor Muayene"
    },
    {
      src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&h=1200&fit=crop&crop=face",
      alt: "Doktor Muayene"
    },
    {
      src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&h=1200&fit=crop&crop=face",
      alt: "Doktor Muayene"
    },
    {
      src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&h=1200&fit=crop&crop=face",
      alt: "Doktor Muayene"
    },
    {
      src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&h=1200&fit=crop&crop=face",
      alt: "Doktor Muayene"
    }
  ];

  const gallery = isHospital ? hospitalGallery : doctorGallery;

  // YouTube URL'leri
  const hospitalVideos = [
    {
      url: "https://www.youtube.com/watch?v=05z5ciHMmcA",
      title: "Hastane Tanıtım Videosu"
    },
    {
      url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
      title: "Modern Tıbbi Cihazlar"
    }
  ];

  const doctorVideos = [
    {
      url: "https://www.youtube.com/watch?v=05z5ciHMmcA",
      title: "Sağlıklı Yaşam İçin Öneriler"
    },
    {
      url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
      title: "Düzenli Egzersizin Faydaları"
    }
  ];

  const videos = isHospital ? hospitalVideos : doctorVideos;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {isHospital ? "Hastane Galerisi" : "Galeri"}
        </h3>
        <p className="text-gray-600">
          {isHospital 
            ? "Modern hastane tesislerimiz, ameliyathanelerimiz ve tedavi merkezlerimizden görüntüler. Hastanemizin kaliteli hizmet anlayışını yansıtan fotoğraflar."
            : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error omnis, adipisci sit perferendis sint vero a quia expedita dolorem optio, consequuntur nulla, quaerat magni modi impedit rerum ea delectus maiores."
          }
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((item, index) => (
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

      <div className="flex flex-col gap-3 mt-4">
        <h4 className="text-md font-medium text-gray-700">
          {isHospital ? "Hastane Videoları" : "Video Galeri"}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.map((video, index) => {
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
    </div>
  );
}

export default Gallery;

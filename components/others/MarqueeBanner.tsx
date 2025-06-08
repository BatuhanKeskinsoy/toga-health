"use client";
import React from "react";

interface MarqueeBannerProps {
  messages: string[] | string;
  speed?: number; // Temel hız değeri
}

const MarqueeBanner: React.FC<MarqueeBannerProps> = ({
  messages,
  speed = 20,
}) => {
  const messageArray = Array.isArray(messages) ? messages : [messages];

  // Toplam karakter sayısı (boşluklar dahil)
  const totalLength = messageArray.reduce((acc, msg) => acc + msg.length, 0);

  // Dinamik süre: karakter sayısına bağlı olarak hızı ayarla
  const duration = speed + totalLength * 0.003;

  return (
    <div className="relative overflow-hidden w-full">
      <div
        className="flex gap-8 min-w-max ltr:animate-marquee rtl:animate-marqueeRtl whitespace-nowrap text-xs will-change-transform"
        style={{
          animationDuration: `${duration}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationPlayState: "running",
        }}
      >
        {...messageArray.map((msg, index) => (
          <span key={index}>{msg}</span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeBanner;

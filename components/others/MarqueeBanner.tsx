"use client";
import React, { useMemo } from "react";

interface MarqueeBannerProps {
  messages: string[] | string;
  speed?: number; // Temel hız değeri
}

const MarqueeBanner: React.FC<MarqueeBannerProps> = ({
  messages,
  speed = 20,
}) => {
  const { messageArray, duration } = useMemo(() => {
    const array = Array.isArray(messages) ? messages : [messages];
    const totalLength = array.reduce((acc, msg) => acc + msg.length, 0);
    const calculatedDuration = speed + totalLength * 0.003;
    
    return {
      messageArray: array,
      duration: calculatedDuration
    };
  }, [messages, speed]);

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
        {messageArray.map((msg, index) => (
          <span key={`${msg}-${index}`}>{msg}</span>
        ))}
      </div>
    </div>
  );
};

export default React.memo(MarqueeBanner);

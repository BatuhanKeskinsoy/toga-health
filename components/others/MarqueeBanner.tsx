"use client";
import React from "react";

interface MarqueeBannerProps {
  messages: string[] | string;
  speed?: number;
}

const MarqueeBanner: React.FC<MarqueeBannerProps> = ({
  messages,
  speed = 20,
}) => {
  const messageArray = Array.isArray(messages) ? messages : [messages];

  return (
    <div className="relative overflow-hidden w-full">
      <div
        className="flex gap-8 min-w-max ltr:animate-marquee rtl:animate-marqueeRtl whitespace-nowrap text-xs will-change-transform"
        style={{
          animation: `ltr:marquee rtl:marqueeRtl ${speed}s linear infinite`,
          animationPlayState: "running",
        }}
      >
        {[...messageArray].map((msg, index) => (
          <span key={index}>{msg}</span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeBanner;
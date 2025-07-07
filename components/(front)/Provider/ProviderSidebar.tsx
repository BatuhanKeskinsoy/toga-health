"use client";
import React, { useState, useEffect } from "react";
import AppointmentTimes from "@/components/(front)/Provider/AppointmentTimes/AppointmentTimes";

function ProviderSidebar({ isHospital }: { isHospital: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleAnimationTrigger = () => {
      setIsAnimating(true);
      
      if (window.innerWidth < 1024) { 
        const sidebar = document.querySelector('[data-sidebar]');
        if (sidebar) {
          sidebar.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }
      
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    };

    // Event listener ekle
    window.addEventListener('triggerAppointmentAnimation', handleAnimationTrigger);

    // Cleanup
    return () => {
      window.removeEventListener('triggerAppointmentAnimation', handleAnimationTrigger);
    };
  }, []);

  return (
    <aside 
      data-sidebar
      className={`w-full shadow-lg shadow-gray-200 transition-all duration-500 ease-in-out ${
        isExpanded ? '' : 'sticky top-4'
      }`}>
      <div className="flex flex-col gap-4">
        <div className={`flex flex-col items-center overflow-hidden rounded-md transition-all duration-700 ${
          isAnimating ? 'ring-4 ring-sitePrimary/40 shadow-2xl shadow-sitePrimary/40 scale-[1.01] animate-pulse' : ''
        }`}>
          <div className={`flex items-center justify-center text-white text-xl font-medium tracking-wide py-5 w-full transition-all duration-700 ${
            isAnimating 
              ? 'bg-gradient-to-r from-sitePrimary via-sitePrimary/80 to-sitePrimary animate-pulse' 
              : 'bg-sitePrimary'
          }`}>
            Randevu Oluştur
          </div>
          <div className="bg-white w-full">
            <div>Adres Seçiniz</div>
            <AppointmentTimes onExpandedChange={setIsExpanded} />
          </div>
        </div>
      </div>
    </aside>
  );
}

export default ProviderSidebar;

"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useGoogleAuth } from '@/lib/hooks/auth/useGoogleAuth';
import { IoLogoGoogle } from "react-icons/io5";
import { useTranslations } from "next-intl";

interface GoogleOneTapProps {
  mode: 'login' | 'register';
  onSuccess?: (result?: any) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  autoPrompt?: boolean;
  promptMomentNotification?: boolean;
  cancelOnTapOutside?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          cancel: () => void;
          disableAutoSelect: () => void;
          storeCredential: (credential: { id: string; password: string }) => void;
        };
      };
    };
  }
}

const GoogleOneTap: React.FC<GoogleOneTapProps> = ({
  mode,
  onSuccess,
  onError,
  disabled = false,
  autoPrompt = false,
  className = '',
  style,
}) => {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const { handleGoogleAuth } = useGoogleAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleManualGoogleAuth = async () => {
    if (isLoading || disabled) {
      return;
    }
    setIsLoading(true);

    try {
      const result = await handleGoogleAuth();

      if (result.success) {
        onSuccess?.();
      }
    } catch (error: any) {
      console.error('Google auth error:', error);
      onError?.(error.message || 'Google kimlik doğrulama hatası');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${className}`}
      style={style}
    >
      {/* Google One Tap Container */}
      {autoPrompt && (
        <div className="google-one-tap-container">
          <div id="g_id_onload"></div>
        </div>
      )}

      {/* Manual Google Auth Button */}
      {isLoading ? (
        <div className="flex lg:gap-3 gap-4 items-center justify-center border border-gray-200 rounded-md px-2 py-3 w-full cursor-pointer opacity-50">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sitePrimary"></div>
          <div className="flex flex-col items-start justify-center capitalize">
            <span className="font-medium text-sm">Google</span>
            <span className="font-light text-xs">İşleniyor...</span>
          </div>
        </div>
      ) : (
        <div
          onClick={handleManualGoogleAuth}
          className="flex lg:gap-3 gap-4 items-center justify-center border border-gray-200 rounded-md px-2 py-3 w-full cursor-pointer hover:bg-sitePrimary/10 hover:border-sitePrimary/10 hover:text-sitePrimary transition-all duration-300"
        >
          <IoLogoGoogle className="text-4xl" />
          <div className="flex flex-col items-start justify-center capitalize">
            <span className="font-medium text-sm">Google</span>
            <span className="font-light text-xs">
              {mode === 'login' ? t("İle giriş yap") : t("İle kayıt ol")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleOneTap;
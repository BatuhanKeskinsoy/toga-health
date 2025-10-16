"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useGoogleAuth } from '@/lib/hooks/auth/useGoogleAuth';
import { IoLogoGoogle } from "react-icons/io5";
import { useTranslations } from "next-intl";

interface GoogleOneTapProps {
  mode: 'login' | 'register';
  onSuccess?: (isNewUser?: boolean) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
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
  style,
  className = '',
}) => {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const { googleLogin, googleRegister } = useGoogleAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  // Google One Tap script'ini yükle
  useEffect(() => {
    const loadGoogleScript = () => {
      if (window.google?.accounts?.id) {
        setIsScriptLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsScriptLoaded(true);
      };
      script.onerror = () => {
        onError?.('Google One Tap script yüklenemedi');
      };

      document.head.appendChild(script);
    };

    loadGoogleScript();
  }, [onError]);

  // Google One Tap'ı başlat
  useEffect(() => {
    if (!isScriptLoaded || !window.google?.accounts?.id || disabled) {
      return;
    }

    const initializeGoogleAuth = () => {
      try {
        window.google.accounts.id.initialize({
          client_id: "1066162450127-jolqngnprbkv39338fpn1ebop8us0rl4.apps.googleusercontent.com",
          callback: handleCredentialResponse,
          auto_select: false,
        });
      } catch (error) {
        console.error('Google Auth başlatılamadı:', error);
        onError?.('Google Auth başlatılamadı');
      }
    };

    initializeGoogleAuth();
  }, [isScriptLoaded, disabled]);

  // Google Sign-In Button render
  useEffect(() => {
    if (!isScriptLoaded || !window.google?.accounts?.id) {
      return;
    }

    const renderGoogleButton = () => {
      const buttonElement = document.getElementById('google-signin-button');
      if (buttonElement && window.google?.accounts?.id) {
        // Önceki button'u temizle
        buttonElement.innerHTML = '';
        
        window.google.accounts.id.renderButton(buttonElement, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: mode === 'login' ? 'signin_with' : 'signup_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          locale: 'tr',
        });
      }
    };

    renderGoogleButton();
  }, [isScriptLoaded, mode]);

  const handleCredentialResponse = async (response: any) => {
    if (!response.credential) {
      onError?.('Google kimlik doğrulama bilgisi alınamadı');
      return;
    }

    setIsLoading(true);

    try {
      const result = mode === 'login' 
        ? await googleLogin(response.credential)
        : await googleRegister(response.credential, "individual");

      if (result.success) {
        onSuccess?.(result.isNewUser);
      }
    } catch (error: any) {
      console.error('Google auth error:', error);
      onError?.(error.message || 'Google kimlik doğrulama hatası');
    } finally {
      setIsLoading(false);
    }
  };


  if (!isScriptLoaded) {
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        style={style}
      >
        <div className="text-gray-500 text-sm">
          Google yükleniyor...
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`${className}`}
      style={style}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-3 px-4 py-3 w-full border border-gray-200 rounded-md">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sitePrimary"></div>
          <span className="text-sm">İşleniyor...</span>
        </div>
      ) : (
        <div
          id="google-signin-button"
          className="w-full"
        />
      )}
    </div>
  );
};

export default GoogleOneTap;

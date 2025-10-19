"use client";
import React, { useEffect, useRef, useState } from "react";
import { useFacebookAuth } from "@/lib/hooks/auth/useFacebookAuth";
import { FaFacebook } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { facebookAuthCallbackService } from "@/lib/services/auth/facebookAuth";

interface FacebookAuthButtonProps {
  mode: "login" | "register";
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
    facebook?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          cancel: () => void;
          disableAutoSelect: () => void;
          storeCredential: (credential: {
            id: string;
            password: string;
          }) => void;
        };
      };
    };
  }
}

const FacebookAuthButton: React.FC<FacebookAuthButtonProps> = ({
  mode,
  className = "",
}) => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get("redirect") || "/";
  const [isLoading, setIsLoading] = useState(false);
  const { handleFacebookAuth } = useFacebookAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleManualFacebookAuth = async () => {
    setIsLoading(true);

    try {
      await handleFacebookAuth();
    } catch (error: any) {
      console.error("Facebook auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const code = searchParams.get("code");
    const provider = searchParams.get("provider");
    if (!code || provider !== "facebook") return;

    const completeCallback = async () => {
      try {
        setIsLoading(true);
        const resp = await facebookAuthCallbackService(code);

        if (resp?.user) {
          router.push(redirectTo);
        } else {
          // Bazı backendler token döner; yine de yönlendir
          router.push(redirectTo);
        }
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    };

    completeCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className={`${className}`}>
      {isLoading ? (
        <div className="flex lg:gap-3 gap-4 items-center justify-center border border-gray-200 rounded-md px-2 py-3 w-full cursor-pointer opacity-50">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sitePrimary"></div>
          <div className="flex flex-col items-start justify-center capitalize">
            <span className="font-medium text-sm">Facebook</span>
            <span className="font-light text-xs">İşleniyor...</span>
          </div>
        </div>
      ) : (
        <div
          onClick={handleManualFacebookAuth}
          className="flex lg:gap-3 gap-4 items-center justify-center border border-gray-200 rounded-md px-2 py-3 w-full cursor-pointer hover:bg-sitePrimary/10 hover:border-sitePrimary/10 hover:text-sitePrimary transition-all duration-300"
        >
          <FaFacebook className="text-4xl text-blue-600" />
          <div className="flex flex-col items-start justify-center capitalize">
            <span className="font-medium text-sm">Facebook</span>
            <span className="font-light text-xs">
              {mode === "login" ? t("İle giriş yap") : t("İle kayıt ol")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacebookAuthButton;

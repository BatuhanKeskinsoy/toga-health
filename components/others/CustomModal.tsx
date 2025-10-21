"use client";
import React, { useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  allowOutsideClick?: boolean;
  allowEscapeKey?: boolean;
}

export default function CustomModal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  allowOutsideClick = true,
  allowEscapeKey = true
}: CustomModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Modal açıldığında body scroll'u engelle
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  // ESC tuşu ile kapatma
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (allowEscapeKey && e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, allowEscapeKey, onClose]);

  // Backdrop click ile kapatma
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (allowOutsideClick && e.target === backdropRef.current) {
      onClose();
    }
  };

  // Modal click'ini durdur (modal içeriğine tıklandığında kapanmasın)
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-full"
      onClick={handleBackdropClick}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)'
      }}
    >
      <div
        ref={modalRef}
        className="bg-white lg:rounded-lg shadow-2xl w-full lg:w-[800px] max-w-full overflow-hidden"
        style={{
          animation: 'modalSlideIn 0.3s ease-out'
        }}
        onClick={handleModalClick}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
            <span className="text-2xl">📍</span>
            {title}
          </h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Kapat"
            >
              <IoClose className="text-2xl" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-lg:h-[calc(100vh-85px)] max-h-[calc(100vh-85px)]">
          {children}
        </div>
      </div>

      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import CustomModal from "@/components/Customs/CustomModal";
import CustomButton from "@/components/Customs/CustomButton";
import { Service } from "@/lib/types/appointments";
import { useTranslations } from "next-intl";

interface ServiceSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  onServiceSelect: (service: Service) => void;
}

const ServiceSelectionModal: React.FC<ServiceSelectionModalProps> = ({
  isOpen,
  onClose,
  services,
  onServiceSelect,
}) => {
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<number | null>(null);
  const [showPrepaymentConfirmation, setShowPrepaymentConfirmation] = useState(false);
  const t = useTranslations();

  // Modal açıldığında state'leri sıfırla
  useEffect(() => {
    if (!isOpen) {
      setSelectedServiceIndex(null);
      setShowPrepaymentConfirmation(false);
    }
  }, [isOpen]);

  const handleServiceClick = (index: number) => {
    setSelectedServiceIndex(index);
  };

  const handleConfirm = () => {
    if (selectedServiceIndex === null) {
      return;
    }

    const selectedService = services[selectedServiceIndex];

    // Prepayment kontrolü
    if (selectedService.prepayment_required) {
      // Prepayment zorunlu ise onay ekranını göster
      setShowPrepaymentConfirmation(true);
    } else {
      // Prepayment yoksa direkt servis seçimini tamamla
      onServiceSelect(selectedService);
      onClose();
      setSelectedServiceIndex(null);
      setShowPrepaymentConfirmation(false);
    }
  };

  const handlePrepaymentConfirm = () => {
    if (selectedServiceIndex === null) return;
    
    const selectedService = services[selectedServiceIndex];
    onServiceSelect(selectedService);
    onClose();
    setSelectedServiceIndex(null);
    setShowPrepaymentConfirmation(false);
  };

  const handlePrepaymentCancel = () => {
    setShowPrepaymentConfirmation(false);
  };

  const handleBack = () => {
    setShowPrepaymentConfirmation(false);
  };

  const handleClose = () => {
    setSelectedServiceIndex(null);
    setShowPrepaymentConfirmation(false);
    onClose();
  };

  const selectedService = selectedServiceIndex !== null ? services[selectedServiceIndex] : null;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      title={showPrepaymentConfirmation ? t("Ödeme Zorunlu") : t("Hizmet Seçiniz")}
    >
      {showPrepaymentConfirmation && selectedService ? (
        // Prepayment onay ekranı
        <div className="flex flex-col gap-4">
          <div className="text-center py-4">
            <p className="text-base mb-2 text-gray-700">
              {t("Seçtiğiniz hizmet için ön ödeme yapılması gerekmektedir")}
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 my-4">
              <p className="text-lg font-bold text-sitePrimary">
                {selectedService.prepayment_info?.formatted_prepayment}
              </p>
              {selectedService.prepayment_info?.prepayment_description && (
                <p className="text-sm text-gray-600 mt-2">
                  {selectedService.prepayment_info.prepayment_description}
                </p>
              )}
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left">
              <h4 className="font-semibold text-gray-800 mb-2">
                {selectedService.name}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                {selectedService.description}
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">{t("Hizmet Fiyatı")}:</span>
                <span className="font-bold text-sitePrimary">
                  {selectedService.price} {selectedService.currency}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <CustomButton
              btnType="button"
              handleClick={handlePrepaymentCancel}
              containerStyles="flex items-center justify-center gap-2 flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              title={t("İptal")}
            />
            <CustomButton
              btnType="button"
              handleClick={handleBack}
              containerStyles="flex items-center justify-center gap-2 flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              title={t("Geri")}
            />
            <CustomButton
              btnType="button"
              handleClick={handlePrepaymentConfirm}
              containerStyles="flex items-center justify-center gap-2 flex-1 px-6 py-3 bg-sitePrimary text-white rounded-lg hover:bg-sitePrimary/80 transition-colors"
              title={t("Ödeme Yap")}
            />
          </div>
        </div>
      ) : (
        // Servis seçim ekranı
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            {t("Randevunuz için bir hizmet seçiniz")}
          </p>

          <div className="max-h-96 overflow-y-auto space-y-3">
            {services.map((service, index) => {
              const isSelected = selectedServiceIndex === index;

              return (
                <div
                  key={service.service_id || index}
                  onClick={() => handleServiceClick(index)}
                  className={`p-4 border rounded-md cursor-pointer transition-all ${
                    isSelected
                      ? "border-sitePrimary bg-sitePrimary/5"
                      : "border-gray-200 hover:border-sitePrimary/30"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">
                        {service.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {service.description}
                      </p>
                      {service.prepayment_required ? (
                        <div className="mt-2 text-xs font-medium text-orange-600 bg-orange-50 p-2 rounded">
                          ⚠️ {t("Ödeme zorunlu")}:{" "}
                          {service.prepayment_info?.formatted_prepayment || ""}
                        </div>
                      ) : (
                        <div className="mt-2 text-xs font-medium text-green-600 bg-green-50 p-2 rounded">
                          ✓ {t("Ödeme yapılmadan randevu alınabilir")}
                        </div>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-bold text-sitePrimary">
                        {service.price} {service.currency}
                      </span>
                      {service.type === "treatment" &&
                        "duration" in service && (
                          <div className="text-xs text-gray-500 mt-1">
                            {service.duration}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <CustomButton
              btnType="button"
              handleClick={handleClose}
              containerStyles="flex items-center justify-center gap-2 flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              title={t("İptal")}
            />
            <CustomButton
              btnType="button"
              handleClick={handleConfirm}
              isDisabled={selectedServiceIndex === null}
              containerStyles={`flex items-center justify-center gap-2 flex-1 px-6 py-3 rounded-lg transition-colors ${
                selectedServiceIndex === null
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-sitePrimary text-white hover:bg-sitePrimary/80"
              }`}
              title={t("Devam Et")}
            />
          </div>
        </div>
      )}
    </CustomModal>
  );
};

export default ServiceSelectionModal;


"use client";
import React, { useState } from "react";
import { PendingDoctorRequest } from "@/lib/types/provider/requestsTypes";
import CustomButton from "@/components/others/CustomButton";
import { FaCheck, FaInfoCircle, FaTimes } from "react-icons/fa";
import ProfilePhoto from "@/components/others/ProfilePhoto";
import CustomModal from "@/components/others/CustomModal";
import CustomInput from "@/components/others/CustomInput";
import { approveDoctor, rejectDoctor } from "@/lib/services/provider/requests";
import Swal from "sweetalert2";

interface PendingRequestCardProps {
  request: PendingDoctorRequest;
  onUpdate: (request: PendingDoctorRequest) => void;
  onRemove: (requestId: number) => void;
  onApproved: () => void;
}

const PendingRequestCard: React.FC<PendingRequestCardProps> = ({
  request,
  onUpdate,
  onRemove,
  onApproved,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = async () => {
    const result = await Swal.fire({
      title: "İsteği Onayla",
      text: `${request.user.name} adlı doktorun isteğini onaylamak istediğinizden emin misiniz?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Evet, Onayla",
      cancelButtonText: "İptal",
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        await approveDoctor(request.id);

        Swal.fire({
          title: "Başarılı!",
          text: "Doktor isteği başarıyla onaylandı.",
          icon: "success",
          confirmButtonColor: "#10b981",
        });

        // Başarılı olursa request'i güncelle
        const updatedRequest = { ...request, status: "approved" };
        onUpdate(updatedRequest);

        // Onaylandığında aktif doktorlar listesini güncelle
        onApproved();

        // 2 saniye sonra listeyi güncelle
        setTimeout(() => {
          onRemove(request.id);
        }, 2000);
      } catch (error) {
        console.error("Error approving request:", error);
        Swal.fire({
          title: "Hata!",
          text: "İstek onaylanırken bir hata oluştu.",
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleReject = () => {
    setIsRejectModalOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      Swal.fire({
        title: "Hata!",
        text: "Lütfen reddetme nedenini belirtin.",
        icon: "warning",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    setIsLoading(true);
    try {
      await rejectDoctor(request.id, rejectReason);

      Swal.fire({
        title: "Başarılı!",
        text: "Doktor isteği başarıyla reddedildi.",
        icon: "success",
        confirmButtonColor: "#10b981",
      });

      // Başarılı olursa request'i güncelle
      const updatedRequest = {
        ...request,
        status: "rejected",
        rejection_reason: rejectReason,
      };
      onUpdate(updatedRequest);

      // 2 saniye sonra listeyi güncelle
      setTimeout(() => {
        onRemove(request.id);
      }, 2000);

      // Modal'ı kapat ve form'u temizle
      setIsRejectModalOpen(false);
      setRejectReason("");
    } catch (error) {
      console.error("Error rejecting request:", error);
      Swal.fire({
        title: "Hata!",
        text: "İstek reddedilirken bir hata oluştu.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Bekliyor";
      case "approved":
        return "Onaylandı";
      case "rejected":
        return "Reddedildi";
      default:
        return "Bilinmiyor";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:bg-sitePrimary/5 hover:border-sitePrimary/20 transition-colors">
      <div className="flex flex-col items-center sm:flex-row gap-4">
        {/* Header */}
        <div className="flex items-start gap-2 w-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
              <ProfilePhoto
                photo={request.user.photo}
                name={request.user.name}
                size={48}
                fontSize={16}
                responsiveSizes={{
                  desktop: 48,
                  mobile: 32,
                }}
                responsiveFontSizes={{
                  desktop: 16,
                  mobile: 12,
                }}
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {request.user.name}
              </h3>
              <p className="text-xs text-gray-500">
                {request.user.doctor.specialty.name}
              </p>
            </div>
          </div>
        </div>

        <span
          className={`px-2 py-1 rounded-full text-xs font-medium mt-0.5 ${getStatusColor(
            request.status
          )}`}
        >
          {getStatusText(request.status)}
        </span>
        {/* Request Info */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <span>{request.user.phone_number}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(request.user.rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600">{request.user.rating}</span>
        </div>

        {/* Actions */}
        {request.status === "pending" && (
          <div className="flex flex-col sm:flex-row gap-2">
            <CustomButton
              handleClick={handleApprove}
              btnType="button"
              containerStyles="flex items-center justify-center gap-2 flex-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
              leftIcon={<FaCheck size={16} />}
              textStyles="hidden"
            />
            <CustomButton
              handleClick={handleReject}
              btnType="button"
              containerStyles="flex items-center justify-center gap-2 flex-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
              leftIcon={<FaTimes size={16} />}
              textStyles="hidden"
            />
          </div>
        )}

        {request.status === "approved" && (
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center justify-center gap-2 flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-md text-sm font-medium">
              <FaCheck size={16} />
              Onaylandı
            </div>
          </div>
        )}

        {request.status === "rejected" && (
          <div className="flex max-lg:flex-col items-center gap-2">
            {request.rejection_reason && (
              <div className="relative flex flex-col gap-2 group max-lg:w-full">
                <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 transition-colors duration-300 rounded-md text-xs font-medium text-nowrap cursor-pointer hover:bg-red-200">
                  Red Sebebi
                  <FaInfoCircle size={14} className="min-w-4" />
                </div>
                <div className="lg:invisible lg:opacity-0 text-center lg:absolute lg:top-full lg:right-0 text-xs text-gray-600 shadow-md shadow-gray-300 bg-gray-100 p-2 rounded-md lg:z-10 transition-all duration-300 group-hover:visible group-hover:opacity-100">
                  <p>{request.rejection_reason}</p>
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2">
              <CustomButton
                handleClick={handleApprove}
                title="İsteği Onayla"
                btnType="button"
                containerStyles="flex items-center justify-center gap-2 flex-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                leftIcon={<FaCheck size={16} />}
                textStyles="lg:hidden"
                isDisabled={isLoading}
              />
            </div>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      <CustomModal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setRejectReason("");
        }}
        title="İsteği Reddet"
      >
        <div className="flex flex-col gap-4">
          <div className="text-sm text-gray-600">
            <strong>{request.user.name}</strong> adlı doktorun isteğini
            reddetmek için bir neden belirtin:
          </div>

          <CustomInput
            label="Reddetme Nedeni"
            type="text"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            required
          />

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <CustomButton
              btnType="button"
              handleClick={() => {
                setIsRejectModalOpen(false);
                setRejectReason("");
              }}
              isDisabled={isLoading}
              containerStyles="flex items-center justify-center gap-2 flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              title="İptal"
            />
            <CustomButton
              btnType="button"
              handleClick={handleRejectConfirm}
              isDisabled={isLoading}
              containerStyles="flex items-center justify-center gap-2 flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              title={isLoading ? "Reddediliyor..." : "Reddet"}
            />
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default PendingRequestCard;

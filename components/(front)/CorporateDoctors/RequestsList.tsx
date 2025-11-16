"use client";

import React from "react";
import { PendingDoctorRequest } from "@/lib/types/provider/requestsTypes";
import PendingRequestCard from "@/components/(front)/CorporateDoctors/RequestCard";
import { useTranslations } from "next-intl";

interface PendingRequestsListProps {
  requests: PendingDoctorRequest[];
  onRequestUpdate: (requests: PendingDoctorRequest[]) => void;
  onRequestApproved: () => void;
}

const PendingRequestsList: React.FC<PendingRequestsListProps> = ({
  requests,
  onRequestUpdate,
  onRequestApproved
}) => {
  const t = useTranslations();
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{t("Bekleyen istek bulunmuyor")}</h3>
        <p className="text-gray-500">{t("Henüz onay bekleyen doktor isteği bulunmuyor")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2">
      {requests.map((request) => (
        <PendingRequestCard
          key={request.id}
          request={request}
          onUpdate={(updatedRequest) => {
            const updatedRequests = requests.map(r => 
              r.id === updatedRequest.id ? updatedRequest : r
            );
            onRequestUpdate(updatedRequests);
          }}
          onRemove={(requestId) => {
            const updatedRequests = requests.filter(r => r.id !== requestId);
            onRequestUpdate(updatedRequests);
          }}
          onApproved={onRequestApproved}
        />
      ))}
    </div>
  );
};

export default PendingRequestsList;

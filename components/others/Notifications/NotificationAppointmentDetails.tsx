import React from "react";
import ProfilePhoto from "@/components/others/ProfilePhoto";

interface NotificationAppointmentDetailsProps {
  doctorName: string;
  doctorPhoto?: string;
  department: string;
  date: string;
  time: string;
  message: string;
  cancellationReason?: string;
  isMobile: boolean;
  type: "appointment_confirmed" | "appointment_cancelled";
  statusText: string;
  cancelReasonLabel: string;
}

const NotificationAppointmentDetails: React.FC<NotificationAppointmentDetailsProps> = ({
  doctorName,
  doctorPhoto,
  department,
  date,
  time,
  message,
  cancellationReason,
  isMobile,
  type,
  statusText,
  cancelReasonLabel,
}) => {
  const isConfirmed = type === "appointment_confirmed";
  const statusColor = isConfirmed ? "text-green-500" : "text-red-500";
  const photoSize = isMobile ? 90 : 120;

  return (
    <div className="flex flex-col gap-4 items-center py-4 text-[14px]">
      <div className="flex justify-center gap-2 w-full border-b border-gray-200 text-center pb-4 mb-4">
        <div className={`flex items-center gap-2 ${statusColor}`}>
          <span className="lg:text-2xl text-xl">
            {statusText}
          </span>
        </div>
      </div>
      
      <div className="flex lg:gap-6 gap-4 items-start lg:h-[120px] h-[90px]">
        <div className="relative rounded-full overflow-hidden lg:min-w-[120px] min-w-[90px]">
          <ProfilePhoto
            photo={doctorPhoto}
            name={doctorName}
            size={photoSize}
          />
        </div>
        
        <div className="flex flex-col items-start justify-evenly gap-1 h-full">
          <span className="lg:text-lg text-base font-medium text-gray-700">
            {doctorName}
          </span>
          <span className="text-xs opacity-80">{department}</span>
          <div className="text-xs bg-gray-100 px-3 py-2 rounded-md border border-gray-200">
            {date} {time}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-2 bg-gray-100 p-3 text-xs text-center rounded-md w-full">
        {message}
        {!isConfirmed && cancellationReason && (
          <div className="text-[10px] py-2 bg-sitePrimary/5 text-sitePrimary rounded-md px-4">
            {cancelReasonLabel} {cancellationReason}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationAppointmentDetails;

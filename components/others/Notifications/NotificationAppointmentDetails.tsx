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
  type: string;
  t: any;
}

const NotificationAppointmentDetails: React.FC<
  NotificationAppointmentDetailsProps
> = ({
  doctorName,
  doctorPhoto,
  department,
  date,
  time,
  message,
  cancellationReason,
  isMobile,
  type,
  t,
}) => (
  <div className="flex flex-col gap-4 items-center py-4 text-[14px]">
    <div className="flex justify-center gap-2 w-full border-b border-gray-200 text-center pb-4 mb-4">
      <div
        className={`flex items-center gap-2 ${
          type === "appointment_confirmed" ? "text-green-500" : "text-red-500"
        }`}
      >
        <span className="lg:text-2xl text-xl">
          {type === "appointment_confirmed"
            ? t("Randevu Onaylandı")
            : t("Randevu İptal Edildi")}
        </span>
      </div>
    </div>
    <div className="flex lg:gap-6 gap-4 items-start lg:h-[120px] h-[90px]">
      <div className="relative rounded-full overflow-hidden lg:min-w-[120px] min-w-[90px]">
        <ProfilePhoto
          photo={doctorPhoto}
          name={doctorName}
          size={isMobile ? 90 : 120}
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
      {type === "appointment_cancelled" && cancellationReason && (
        <div className="text-[10px] py-2 bg-red-500/10 text-sitePrimary rounded-md px-4">
          {t("İptal Nedeni")} : {cancellationReason}
        </div>
      )}
    </div>
  </div>
);

export default NotificationAppointmentDetails;

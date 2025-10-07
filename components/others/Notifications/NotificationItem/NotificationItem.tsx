"use client";
import React, { useCallback } from "react";
import { convertDate } from "@/lib/functions/getConvertDate";
import { NotificationItemTypes } from "./notificationTypes";
import CustomButton from "@/components/others/CustomButton";
import { notificationRead } from "@/lib/services/notification/notificationRead";
import NotificationTitle from "../NotificationTitle";
import NotificationAppointmentDetails from "../NotificationAppointmentDetails";
import { showNotificationDetailsModal } from "../NotificationDetailsModal";
import ReactDOMServer from "react-dom/server";
import { useTranslations } from "next-intl";

interface INotificationItemProps {
  notification: NotificationItemTypes;
  mutateNotifications: () => void;
  markAsRead?: (notificationId: string | number) => Promise<void>;
  isMobile: boolean;
}

function NotificationItem({
  notification,
  mutateNotifications,
  markAsRead,
  isMobile,
}: INotificationItemProps) {
  const t = useTranslations();
  const isRead = Boolean(notification.read_at);
  const { data } = notification;

  const handleMarkAsRead = useCallback(async () => {
    try {
      if (markAsRead) {
        await markAsRead(notification.id);
      } else {
        await notificationRead(notification.id);
        mutateNotifications();
      }
    } catch (error) {
      console.error(t("Hata!"), error);
    }
  }, [notification.id, mutateNotifications, markAsRead, t]);

  const handleShowDetails = useCallback(() => {
    let htmlContent = "";
    
    const isAppointmentType = data.type === "appointment_confirmed" || data.type === "appointment_cancelled";
    
    if (isAppointmentType) {
      const cancellationReason = data.type === "appointment_cancelled" ? data.cancellation_reason : undefined;
      
      htmlContent = ReactDOMServer.renderToString(
        <NotificationAppointmentDetails
          doctorName={data.doctor_name}
          doctorPhoto={data.doctor_photo}
          department={data.department}
          date={data.date}
          time={data.time}
          message={data.message}
          cancellationReason={cancellationReason}
          isMobile={isMobile}
          type={data.type as "appointment_confirmed" | "appointment_cancelled"}
          statusText={data.type === "appointment_confirmed" ? t("Randevu Onaylandı") : t("Randevu İptal Edildi")}
          cancelReasonLabel={t("İptal Nedeni")}
        />
      );
    } else {
      htmlContent = `<div class='text-left text-[14px]'><p>${data.message}</p></div>`;
    }
    
    showNotificationDetailsModal({ 
      html: htmlContent,
      confirmButtonText: "Tamam"
    });
  }, [data, isMobile, t]);

  const containerClasses = `flex flex-col gap-2 lg:px-8 px-4 lg:py-4 py-6 border-b last:border-b-0 border-gray-200 transition-all duration-500 ${
    isRead ? "opacity-30 bg-white" : "bg-gray-100 hover:bg-white"
  }`;

  const buttonClasses = `px-2 py-1 text-white rounded-sm max-lg:w-full ${
    isRead ? "bg-gray-400" : "bg-sitePrimary"
  }`;

  return (
    <div className={containerClasses}>
      <NotificationTitle
        type={data.type}
        title={data.title}
        isRead={isRead}
      />
      
      <div className="text-gray-600 text-xs max-lg:text-center">
        {data.message}
      </div>
      
      <div className="flex max-lg:flex-col max-lg:w-full items-center justify-between text-[10px] mt-1 max-lg:gap-2">
        <div className="flex max-lg:flex-col max-lg:w-full gap-2 items-center">
          <CustomButton
            title={t("Detayları Görüntüle")}
            containerStyles={buttonClasses}
            handleClick={handleShowDetails}
          />
          
          {!isRead && (
            <CustomButton
              title={t("Okundu Olarak İşaretle")}
              containerStyles="hover:text-sitePrimary"
              handleClick={handleMarkAsRead}
            />
          )}
        </div>
        
        <span className="text-gray-400">
          {convertDate(new Date(notification.created_at))}
        </span>
      </div>
    </div>
  );
}

export default React.memo(NotificationItem);

"use client";
import React from "react";
import { convertDate } from "@/lib/functions/getConvertDate";
import {
  NotificationData,
  NotificationItemTypes,
  AppointmentCancelledData,
} from "@/lib/types/notifications/NotificationTypes";
import CustomButton from "@/components/others/CustomButton";
import { notificationRead } from "@/lib/utils/notification/notificationRead";
import {
  IoCheckmark,
  IoCheckmarkSharp,
  IoClose,
  IoCloseSharp,
} from "react-icons/io5";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";
import { renderToString } from "react-dom/server";
import ProfilePhoto from "@/components/others/ProfilePhoto";

interface INotificationItemProps {
  notification: NotificationItemTypes;
  mutateNotifications: () => void;
  mutateUser: () => void;
  isMobile: boolean;
}

// Type guard
function isAppointmentCancelledData(
  data: NotificationData
): data is AppointmentCancelledData {
  return data.type === "appointment_cancelled";
}

function NotificationItem({
  notification,
  mutateNotifications,
  mutateUser,
  isMobile,
}: INotificationItemProps) {
  const isRead = Boolean(notification.read_at);

  const handleMarkAsRead = async () => {
    try {
      await notificationRead(notification.id);
      mutateNotifications();
      mutateUser();
    } catch (error) {
      console.error("Bildirim okunamadı:", error);
    }
  };

  const renderTitle = () => {
    const { type, title } = notification.data;
    const baseClass = "flex items-center gap-1.5 text-sm font-medium max-lg:justify-center";

    if (isRead)
      return <div className="font-medium text-sm text-gray-700">{title}</div>;

    switch (type) {
      case "appointment_confirmed":
        return (
          <div className={`${baseClass} text-green-500`}>
            <IoCheckmarkSharp className="text-xl -mt-0.5" />
            <span>{title}</span>
          </div>
        );
      case "appointment_cancelled":
        return (
          <div className={`${baseClass} text-red-500`}>
            <IoCloseSharp className="text-xl -mt-0.5" />
            <span>{title}</span>
          </div>
        );
      default:
        return <div className={`${baseClass} text-sitePrimary`}>{title}</div>;
    }
  };

  const getHtmlContent = () => {
    const data = notification.data;

    if (
      data.type === "appointment_confirmed" ||
      data.type === "appointment_cancelled"
    ) {
      return renderToString(
        <div className="flex flex-col gap-4 items-center py-4 text-[14px]">
          <div className="flex justify-center gap-2 w-full border-b border-gray-200 text-center pb-4 mb-4">
            {data.type === "appointment_confirmed" ? (
              <div className="flex items-center gap-2 text-green-500">
                <span className="lg:text-2xl text-xl">{data.title}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-500">
                <span className="lg:text-2xl text-xl">{data.title}</span>
              </div>
            )}
          </div>

          <div className="flex lg:gap-6 gap-4 items-start lg:h-[120px] h-[90px]">
            <div className="relative rounded-full overflow-hidden lg:min-w-[120px] min-w-[90px]">
              <ProfilePhoto
                photo={
                  /* data.doctor_photo ?? undefined */ "https://instagram.fesb4-1.fna.fbcdn.net/v/t51.2885-19/358804165_297088469447981_5366497534552503370_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_ht=instagram.fesb4-1.fna.fbcdn.net&_nc_cat=105&_nc_oc=Q6cZ2QGQgX7syHaHltQ8dUIrGSltbGfwfx_yEz3qW2IiwWLdsyEUBHDRwuCUk4UvNIQ4uUs&_nc_ohc=HWyMwJnHiRcQ7kNvwE3qxQP&_nc_gid=xNSqkqaVcGvAJYB-cN3Qdw&edm=ACE-g0gBAAAA&ccb=7-5&oh=00_AfPwp83-e3klMBHbCbcS5Go9oYVw4ORENJWvE_UVB8Mm7g&oe=685B2356&_nc_sid=b15361"
                }
                name={data.doctor_name}
                size={isMobile ? 90 : 120}
              />
            </div>
            <div className="flex flex-col items-start justify-evenly gap-1 h-full">
              <span className="lg:text-lg text-base font-medium text-gray-700">
                {data.doctor_name}
              </span>
              <span className="text-xs opacity-80">{data.department}</span>
              <div className="text-xs bg-gray-100 px-3 py-2 rounded-md border border-gray-200">
                {data.date} {data.time}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 bg-gray-100 p-3 text-xs text-center rounded-md w-full">
            {data.message}
            {isAppointmentCancelledData(data) && data.cancellation_reason && (
              <div className="text-[10px] py-2 bg-red-500/10 text-sitePrimary rounded-md px-4">
                İptal Nedeni : {data.cancellation_reason}
              </div>
            )}
          </div>
        </div>
      );
    }

    return renderToString(
      <div className="text-left text-[14px]">
        <p>{data.message}</p>
      </div>
    );
  };

  const handleShowDetails = () => {
    funcSweetAlert({
      html: getHtmlContent(),
      icon: null,
      confirmButtonText: "Tamam",
    });
  };

  return (
    <div
      className={`flex flex-col gap-2 lg:px-8 px-4 lg:py-4 py-6 border-b last:border-b-0 border-gray-200 transition-all duration-300 ${
        isRead ? "opacity-30 bg-white" : "bg-gray-100 hover:bg-white"
      }`}
    >
      {renderTitle()}

      <div className="text-gray-600 text-xs max-lg:text-center">{notification.data.message}</div>

      <div className="flex max-lg:flex-col max-lg:w-full items-center justify-between text-[10px] mt-1 max-lg:gap-2">
        <div className="flex max-lg:flex-col max-lg:w-full gap-2 items-center">
          <CustomButton
            title="Detayları Görüntüle"
            containerStyles="bg-sitePrimary px-2 py-1 text-white rounded-sm max-lg:w-full"
            handleClick={handleShowDetails}
          />
          {!isRead && (
            <CustomButton
              title="Okundu Olarak İşaretle"
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

export default NotificationItem;

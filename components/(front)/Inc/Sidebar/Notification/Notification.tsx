"use client";
import React from "react";
import NotificationWrapper from "@/components/others/Notifications/NotificationWrapper";

function Notification() {
  return (
    <div className="relative flex flex-col w-full h-[calc(100dvh-77px)] overflow-y-auto overflow-x-hidden">
      <NotificationWrapper />
    </div>
  );
}

export default Notification;

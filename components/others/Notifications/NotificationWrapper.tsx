"use client";
import React from "react";
import { useTranslations } from "next-intl";
import Notifications from "./Notifications";

function NotificationWrapper() {
  const t = useTranslations();

  return <Notifications />;
}

export default NotificationWrapper; 
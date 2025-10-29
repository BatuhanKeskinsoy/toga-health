"use client";
import React from "react";
import { IoCalendar } from "react-icons/io5";
import CustomButton from "@/components/Customs/CustomButton";
import { useTranslations } from "next-intl";

const AppointmentButton = () => {
  const t = useTranslations();

  const triggerAppointmentAnimation = () => {
    window.dispatchEvent(new CustomEvent("triggerAppointmentAnimation"));
  };

  return (
    <CustomButton
      title={t("Randevu Al")}
      containerStyles="flex items-center gap-2 rounded-md bg-gray-100 text-gray-500 px-4 py-2 min-w-max hover:bg-sitePrimary hover:text-white transition-all duration-300"
      leftIcon={<IoCalendar size={20} />}
      handleClick={triggerAppointmentAnimation}
    />
  );
};

export default AppointmentButton; 
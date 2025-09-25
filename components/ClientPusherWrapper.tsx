"use client";
import React from "react";
import { PusherProvider } from "@/lib/context/PusherContext";
import { UserTypes } from "@/lib/types/user/UserTypes";

interface ClientPusherWrapperProps {
  children: React.ReactNode;
  user?: UserTypes | null;
}

export default function ClientPusherWrapper({ children, user }: ClientPusherWrapperProps) {
  return (
    <PusherProvider user={user}>
      {children}
    </PusherProvider>
  );
}

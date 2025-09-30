"use client";
import React from "react";
import type { UserTypes } from "@/lib/types/user/UserTypes";

type Props = {
  user: UserTypes;
};

export default function CorporateProfiledetailsView({ user }: Props) {
  return (
    <div className="bg-white rounded-md border border-gray-200 shadow-sm p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Kurumsal Profil Detayları</h2>
      <div className="text-sm text-gray-600">{user.name}</div>
      {/* TODO: Implement corporate-specific fields */}
    </div>
  );
}



"use client";
import React from "react";
import { CustomInput } from "@/components/others/CustomInput";
import CustomButton from "@/components/others/CustomButton";
import { MdBusiness, MdLocationOn, MdPhone } from "react-icons/md";

interface BranchesSectionProps {
  branches: Array<{
    name: string;
    address: string;
    phone: string;
  }>;
  onBranchChange: (index: number, field: string, value: string) => void;
  onAddBranch: () => void;
  onRemoveBranch: (index: number) => void;
}

export default function BranchesSection({
  branches,
  onBranchChange,
  onAddBranch,
  onRemoveBranch,
}: BranchesSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-md font-medium text-gray-900">Şube Bilgileri</h4>
        <CustomButton
          title="Şube Ekle"
          btnType="button"
          handleClick={onAddBranch}
          containerStyles="bg-sitePrimary text-white px-4 py-2 rounded-md hover:bg-sitePrimary/90 text-sm"
        />
      </div>
      
      <div className="space-y-4">
        {branches.map((branch, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
            <CustomInput
              label="Şube Adı"
              name={`branch_${index}_name`}
              value={branch.name}
              onChange={(e) => onBranchChange(index, "name", e.target.value)}
              icon={<MdBusiness />}
            />
            
            <CustomInput
              label="Adres"
              name={`branch_${index}_address`}
              value={branch.address}
              onChange={(e) => onBranchChange(index, "address", e.target.value)}
              icon={<MdLocationOn />}
            />
            
            <CustomInput
              label="Telefon"
              name={`branch_${index}_phone`}
              value={branch.phone}
              onChange={(e) => onBranchChange(index, "phone", e.target.value)}
              icon={<MdPhone />}
            />
            
            {branches.length > 1 && (
              <div className="flex items-end">
                <CustomButton
                  title="Sil"
                  btnType="button"
                  handleClick={() => onRemoveBranch(index)}
                  containerStyles="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

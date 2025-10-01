"use client";
import React from "react";
import { CustomInput } from "@/components/others/CustomInput";
import CustomButton from "@/components/others/CustomButton";
import { MdWork } from "react-icons/md";

interface ExperienceSectionProps {
  experience_list: Array<{
    position: string;
    hospital: string;
    start_date: string;
    end_date: string;
  }>;
  onArrayChange: (index: number, field: string, value: string) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

export default function ExperienceSection({
  experience_list,
  onArrayChange,
  onAddItem,
  onRemoveItem,
}: ExperienceSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-md font-medium text-gray-900">Deneyim Bilgileri</h4>
        <CustomButton
          title="Deneyim Ekle"
          btnType="button"
          handleClick={onAddItem}
          containerStyles="bg-sitePrimary text-white px-4 py-2 rounded-md hover:bg-sitePrimary/90 text-sm"
        />
      </div>
      
      <div className="space-y-4">
        {experience_list.map((exp, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                label="Pozisyon"
                name={`experience_${index}_position`}
                value={exp.position}
                onChange={(e) => onArrayChange(index, "position", e.target.value)}
                icon={<MdWork />}
              />
              
              <CustomInput
                label="Hastane/Kurum"
                name={`experience_${index}_hospital`}
                value={exp.hospital}
                onChange={(e) => onArrayChange(index, "hospital", e.target.value)}
                icon={<MdWork />}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                label="Başlangıç Tarihi"
                name={`experience_${index}_start_date`}
                type="date"
                value={exp.start_date}
                onChange={(e) => onArrayChange(index, "start_date", e.target.value)}
                icon={<MdWork />}
              />
              
              <CustomInput
                label="Bitiş Tarihi"
                name={`experience_${index}_end_date`}
                type="date"
                value={exp.end_date}
                onChange={(e) => onArrayChange(index, "end_date", e.target.value)}
                icon={<MdWork />}
              />
            </div>
            
            {experience_list.length > 1 && (
              <div className="flex justify-end">
                <CustomButton
                  title="Sil"
                  btnType="button"
                  handleClick={() => onRemoveItem(index)}
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

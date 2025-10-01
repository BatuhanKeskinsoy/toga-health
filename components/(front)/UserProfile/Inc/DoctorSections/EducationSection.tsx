"use client";
import React from "react";
import { CustomInput } from "@/components/others/CustomInput";
import CustomButton from "@/components/others/CustomButton";
import { MdSchool } from "react-icons/md";

interface EducationSectionProps {
  education: Array<{
    degree: string;
    university: string;
    year: string;
  }>;
  onArrayChange: (index: number, field: string, value: string) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

export default function EducationSection({
  education,
  onArrayChange,
  onAddItem,
  onRemoveItem,
}: EducationSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-md font-medium text-gray-900">Eğitim Bilgileri</h4>
        <CustomButton
          title="Eğitim Ekle"
          btnType="button"
          handleClick={onAddItem}
          containerStyles="bg-sitePrimary text-white px-4 py-2 rounded-md hover:bg-sitePrimary/90 text-sm"
        />
      </div>
      
      <div className="space-y-4">
        {education.map((edu, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
            <CustomInput
              label="Derece"
              name={`education_${index}_degree`}
              value={edu.degree}
              onChange={(e) => onArrayChange(index, "degree", e.target.value)}
              icon={<MdSchool />}
            />
            
            <CustomInput
              label="Üniversite"
              name={`education_${index}_university`}
              value={edu.university}
              onChange={(e) => onArrayChange(index, "university", e.target.value)}
              icon={<MdSchool />}
            />
            
            <CustomInput
              label="Yıl"
              name={`education_${index}_year`}
              type="number"
              value={edu.year}
              onChange={(e) => onArrayChange(index, "year", e.target.value)}
              icon={<MdSchool />}
            />
            
            {education.length > 1 && (
              <div className="flex items-end">
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

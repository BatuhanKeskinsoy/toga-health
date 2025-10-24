"use client";
import React, { useState } from "react";
import CustomModal from "@/components/others/CustomModal";
import CustomInput from "@/components/others/CustomInput";
import CustomSelect from "@/components/others/CustomSelect";
import CustomButton from "@/components/others/CustomButton";

interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  userId: number;
}

const AddDoctorModal: React.FC<AddDoctorModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userId,
}) => {
  const [formData, setFormData] = useState({
    doctor_id: "",
    corporate_id: "",
    role: "doctor",
    permissions: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.doctor_id || !formData.corporate_id) {
      alert("Lütfen tüm alanları doldurun");
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({
        doctor_id: parseInt(formData.doctor_id),
        corporate_id: parseInt(formData.corporate_id),
        role: formData.role,
        permissions: formData.permissions,
      });

      // Form'u temizle
      setFormData({
        doctor_id: "",
        corporate_id: "",
        role: "doctor",
        permissions: [],
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRoleChange = (option: any) => {
    setFormData((prev) => ({
      ...prev,
      role: option?.value || "doctor",
    }));
  };

  const permissionOptions = [
    { value: "view_appointments", label: "Randevuları Görüntüle" },
    { value: "manage_appointments", label: "Randevuları Yönet" },
    { value: "view_patients", label: "Hastaları Görüntüle" },
    { value: "manage_patients", label: "Hastaları Yönet" },
    { value: "view_reports", label: "Raporları Görüntüle" },
    { value: "manage_reports", label: "Raporları Yönet" },
  ];

  const roleOptions = [
    { id: 1, name: "Doktor", value: "doctor" },
    { id: 2, name: "Uzman Doktor", value: "specialist" },
    { id: 3, name: "Başhekim", value: "chief_physician" },
    { id: 4, name: "Yönetici", value: "admin" },
  ];

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Yeni Doktor Ekle">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <CustomInput
            label="Doktor ID"
            type="number"
            value={formData.doctor_id}
            onChange={(e) => handleInputChange("doctor_id", e.target.value)}
            placeholder="Doktor ID'sini girin"
            required
          />

          <CustomInput
            label="Kurumsal ID"
            type="number"
            value={formData.corporate_id}
            onChange={(e) => handleInputChange("corporate_id", e.target.value)}
            placeholder="Kurumsal ID'sini girin"
            required
          />

          <CustomSelect
            id="role"
            name="role"
            label="Rol"
            value={
              roleOptions.find(
                (option) => option.value === formData.role
              ) || null
            }
            options={roleOptions}
            onChange={handleRoleChange}
            required
          />

          {/* Permissions */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">İzinler</label>
            <div className="grid grid-cols-2 gap-2">
              {permissionOptions.map((option) => (
                <label key={option.value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(option.value)}
                    onChange={(e) => {
                      const newPermissions = e.target.checked
                        ? [...formData.permissions, option.value]
                        : formData.permissions.filter(
                            (p) => p !== option.value
                          );
                      handleInputChange("permissions", newPermissions);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <CustomButton
            btnType="button"
            handleClick={onClose}
            isDisabled={isLoading}
            containerStyles="flex items-center justify-center gap-2 flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            title="İptal"
          />
          <CustomButton
            btnType="submit"
            containerStyles="flex items-center justify-center gap-2 flex-1 px-6 py-3 bg-sitePrimary text-white rounded-lg hover:bg-sitePrimary/90 transition-colors"
            isDisabled={isLoading}
            title={isLoading ? "Ekleniyor..." : "Ekle"}
          />
        </div>
      </form>
    </CustomModal>
  );
};

export default AddDoctorModal;

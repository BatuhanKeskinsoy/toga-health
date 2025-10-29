"use client";
import React, {
  useState,
  useEffect,
  useRef,
  FormEvent,
  ChangeEvent,
} from "react";
import CustomModal from "@/components/Customs/CustomModal";
import CustomButton from "@/components/Customs/CustomButton";
import CustomFieldInput from "./CustomFieldInput";
import { useTranslations } from "next-intl";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";
import { useProfessionalAccount } from "@/lib/hooks/user/useProfessionalAccount";
import { validateCustomFields } from "@/lib/utils/validateCustomFields";
import { IoDocumentTextOutline, IoClose } from "react-icons/io5";
import Image from "next/image";

interface CorporateApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CorporateApplicationForm({
  isOpen,
  onClose,
  onSuccess,
}: CorporateApplicationFormProps) {
  const t = useTranslations();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isLoadingCustomFields,
    customFields,
    groupedCustomFields,
    isSubmitting,
    loadCorporateCustomFields,
    submitCorporateApplication,
  } = useProfessionalAccount();

  const [customFieldsData, setCustomFieldsData] = useState<{
    [key: string]: any;
  }>({});

  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<
    { file: File; preview: string }[]
  >([]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Custom fields'ları yükle
  useEffect(() => {
    if (isOpen) {
      loadData();
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const loadData = async () => {
    try {
      await loadCorporateCustomFields();

      // Custom fields için initial values
      const initialValues: { [key: string]: any } = {};
      customFields.forEach((field) => {
        if (field.type === "checkbox") {
          initialValues[field.key] = false;
        } else if (field.type === "multiselect" || field.type === "file") {
          initialValues[field.key] = [];
        } else {
          initialValues[field.key] = "";
        }
      });
      setCustomFieldsData(initialValues);
    } catch (error) {
      console.error("Veri yükleme hatası:", error);
      await funcSweetAlert({
        title: t("Hata"),
        text: t("Veri yüklenirken bir hata oluştu. Lütfen tekrar deneyin."),
        icon: "error",
        confirmButtonText: t("Tamam"),
      });
    }
  };

  const resetForm = () => {
    setCustomFieldsData({});
    setDocumentFiles([]);
    setFilePreviews([]);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCustomFieldChange = (fieldKey: string, value: any) => {
    setCustomFieldsData((prev) => {
      const updated = { ...prev, [fieldKey]: value };
      
      // File type field ise, preview'ları güncelle
      const field = customFields.find((f) => f.key === fieldKey);
      if (field?.type === "file" && Array.isArray(value)) {
        const newFiles = value.filter((v): v is File => v instanceof File);
        const newPreviews = newFiles
          .filter((file) => file.type.startsWith("image/"))
          .map((file) => ({
            file,
            preview: URL.createObjectURL(file),
          }));
        
        // Eski preview'ları temizle
        const oldFiles = Array.isArray(prev[fieldKey]) 
          ? (prev[fieldKey] as File[]).filter((f) => !newFiles.includes(f))
          : [];
        oldFiles.forEach((file) => {
          const oldPreview = filePreviews.find((p) => p.file === file);
          if (oldPreview) {
            URL.revokeObjectURL(oldPreview.preview);
          }
        });
        
        setFilePreviews((prevPreviews) => [
          ...prevPreviews.filter((p) => newFiles.includes(p.file)),
          ...newPreviews,
        ]);
      }
      
      return updated;
    });
    
    // Hata varsa temizle
    if (errors[`custom_${fieldKey}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`custom_${fieldKey}`];
        return newErrors;
      });
    }
  };

  const handleCustomFieldFileRemove = (fieldKey: string, index: number) => {
    const field = customFields.find((f) => f.key === fieldKey);
    if (field?.type === "file") {
      const files = Array.isArray(customFieldsData[fieldKey])
        ? (customFieldsData[fieldKey] as File[])
        : [];
      const fileToRemove = files[index];
      
      // Preview'ı temizle
      const previewToRemove = filePreviews.find((p) => p.file === fileToRemove);
      if (previewToRemove) {
        URL.revokeObjectURL(previewToRemove.preview);
        setFilePreviews((prev) => prev.filter((p) => p.file !== fileToRemove));
      }
    }
  };

  const getCustomFieldFilePreviews = (files: File[]): Array<{ file: File; preview: string }> => {
    return filePreviews.filter((p) => files.includes(p.file));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Tüm file field'larından desteklenen formatları topla
    const allAllowedExtensions: string[] = [];
    customFields.forEach((field) => {
      if (field.type === "file") {
        const mimesRule = field.validation_rules.find((rule) =>
          rule.startsWith("mimes:")
        );
        if (mimesRule) {
          const mimesValue = mimesRule.split(":")[1];
          if (mimesValue) {
            const formats = mimesValue.split(",").map((m) => m.trim());
            formats.forEach((format) => {
              const formatMap: { [key: string]: string[] } = {
                webp: [".webp"],
                jpeg: [".jpg", ".jpeg"],
                jpg: [".jpg", ".jpeg"],
                png: [".png"],
                pdf: [".pdf"],
                doc: [".doc"],
                docx: [".docx"],
                jif: [".jif"],
              };
              const extensions = formatMap[format.toLowerCase()] || [`.${format}`];
              extensions.forEach((ext) => {
                if (!allAllowedExtensions.includes(ext)) {
                  allAllowedExtensions.push(ext);
                }
              });
            });
          }
        } else {
          // Varsayılan formatlar
          [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"].forEach((ext) => {
            if (!allAllowedExtensions.includes(ext)) {
              allAllowedExtensions.push(ext);
            }
          });
        }
      }
    });

    // Eğer hiç file field yoksa varsayılan formatları kullan
    const validTypes =
      allAllowedExtensions.length > 0
        ? allAllowedExtensions
        : [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"];

    const newFiles = Array.from(files);
    const validFiles = newFiles.filter((file) => {
      const extension = file.name
        .substring(file.name.lastIndexOf("."))
        .toLowerCase();
      return validTypes.includes(extension);
    });

    if (validFiles.length !== newFiles.length) {
      const formatNames = validTypes
        .map((ext) => ext.replace(".", "").toUpperCase())
        .join(", ");
      funcSweetAlert({
        title: t("Uyarı"),
        text: t(`Sadece ${formatNames} formatları desteklenir.`),
        icon: "warning",
        confirmButtonText: t("Tamam"),
      });
    }

    const newFilesList = [...documentFiles, ...validFiles];
    setDocumentFiles(newFilesList);

    // Preview oluştur (sadece resimler için)
    const newPreviews = validFiles
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

    setFilePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveFile = (index: number) => {
    const fileToRemove = documentFiles[index];
    const previewToRemove = filePreviews.find((p) => p.file === fileToRemove);

    if (previewToRemove) {
      URL.revokeObjectURL(previewToRemove.preview);
      setFilePreviews((prev) => prev.filter((p) => p.file !== fileToRemove));
    }

    setDocumentFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Artık genel documentFiles zorunlu değil, custom fields içindeki file field'ları kontrol ediliyor
    // Sadece eğer hiçbir file field yoksa ve documentFiles boşsa hata ver
    const hasFileFields = customFields.some((f) => f.type === "file");
    if (!hasFileFields && documentFiles.length === 0) {
      newErrors.documents = t("Lütfen en az bir belge dosyası seçin");
    }

    // Custom fields validation
    const customFieldsValidation = validateCustomFields(
      customFields,
      customFieldsData,
      t
    );
    Object.assign(newErrors, customFieldsValidation.errors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Custom fields içindeki file'ları ve genel documentFiles'i birleştir
      const allFiles: File[] = [...documentFiles];
      
      // Custom fields içindeki file type field'larından dosyaları topla
      customFields.forEach((field) => {
        if (field.type === "file") {
          const files = Array.isArray(customFieldsData[field.key])
            ? (customFieldsData[field.key] as File[])
            : [];
          allFiles.push(...files);
        }
      });

      // Custom fields içindeki file'ları çıkar (çünkü bunlar allFiles'e eklendi)
      const customFieldsForSubmit: { [key: string]: any } = {};
      Object.entries(customFieldsData).forEach(([key, value]) => {
        const field = customFields.find((f) => f.key === key);
        if (field?.type !== "file") {
          customFieldsForSubmit[key] = value;
        }
      });

      const result = await submitCorporateApplication({
        documentFiles: allFiles,
        customFields: customFieldsForSubmit,
      });

      if (result.status) {
        await funcSweetAlert({
          title: t("Başarılı"),
          text: result.message,
          icon: "success",
          confirmButtonText: t("Tamam"),
        });

        resetForm();
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      await funcSweetAlert({
        title: t("Hata"),
        text: error?.message || t("Bir hata oluştu. Lütfen tekrar deneyin."),
        icon: "error",
        confirmButtonText: t("Tamam"),
      });
    }
  };

  // Cleanup previews when component unmounts
  useEffect(() => {
    return () => {
      filePreviews.forEach((p) => URL.revokeObjectURL(p.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          <span className="text-2xl">🏥</span>
          <span>{t("Kurum Başvuru Formu")}</span>
        </span>
      }
      allowOutsideClick={!isSubmitting}
      allowEscapeKey={!isSubmitting}
    >
      {isLoadingCustomFields ? (
        <div className="text-center py-10">
          <p>{t("Yükleniyor...")}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customFields.map((field) => (
              <CustomFieldInput
                key={field.key}
                field={field}
                value={
                  customFieldsData[field.key] ||
                  (field.type === "file" || field.type === "multiselect"
                    ? []
                    : "")
                }
                onChange={(value) => handleCustomFieldChange(field.key, value)}
                error={errors[`custom_${field.key}`]}
                onFilePreview={
                  field.type === "file"
                    ? (files: File[]) => getCustomFieldFilePreviews(files)
                    : undefined
                }
                onFileRemove={
                  field.type === "file"
                    ? (index: number) => handleCustomFieldFileRemove(field.key, index)
                    : undefined
                }
              />
            ))}
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <CustomButton
              handleClick={onClose}
              containerStyles="px-6 py-3 rounded-md bg-gray-600 hover:bg-gray-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={t("İptal")}
              isDisabled={isSubmitting}
            />
            <CustomButton
              btnType="submit"
              containerStyles="px-6 py-3 rounded-md bg-sitePrimary hover:bg-sitePrimary/90 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={isSubmitting ? t("Gönderiliyor...") : t("Başvuru Gönder")}
              isDisabled={isSubmitting}
            />
          </div>
        </form>
      )}
    </CustomModal>
  );
}

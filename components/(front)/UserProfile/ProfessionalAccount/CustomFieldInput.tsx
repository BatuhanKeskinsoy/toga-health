"use client";
import React, { useRef } from "react";
import { useTranslations } from "next-intl";
import CustomInput from "@/components/Customs/CustomInput";
import CustomSelect from "@/components/Customs/CustomSelect";
import CustomMultiselect from "@/components/Customs/CustomMultiselect";
import CustomTextarea from "@/components/Customs/CustomTextarea";
import CustomCheckbox from "@/components/Customs/CustomCheckbox";
import { CustomField } from "@/lib/types/customFields";
import { IoDocumentTextOutline, IoClose } from "react-icons/io5";
import Image from "next/image";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";

interface CustomFieldInputProps {
  field: CustomField;
  value: string | number | boolean | string[] | File[];
  onChange: (value: string | number | boolean | string[] | File[]) => void;
  error?: string;
  onFilePreview?: (files: File[]) => Array<{ file: File; preview: string }>;
  onFileRemove?: (index: number) => void;
}

export default function CustomFieldInput({
  field,
  value,
  onChange,
  error,
  onFilePreview,
  onFileRemove,
}: CustomFieldInputProps) {
  const t = useTranslations();
  const fieldId = `custom_${field.key}`;

  switch (field.type) {
    case "text":
      return (
        <div className="w-full">
          <CustomInput
            id={fieldId}
            name={fieldId}
            label={field.label}
            type="text"
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );

    case "number":
      return (
        <div className="w-full">
          <CustomInput
            id={fieldId}
            name={fieldId}
            label={field.label}
            type="number"
            value={
              typeof value === "number"
                ? value.toString()
                : typeof value === "string"
                ? value
                : ""
            }
            onChange={(e) =>
              onChange(e.target.value ? parseFloat(e.target.value) : "")
            }
            required={field.required}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );

    case "textarea":
      return (
        <div className="col-span-1 md:col-span-2 w-full">
          <CustomTextarea
            id={fieldId}
            name={fieldId}
            label={field.label}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            rows={4}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );

    case "select":
      const selectOptions = field.options.map((opt, index) => {
        // Unique ID oluştur - value numeric ise onu kullan, değilse index kullan
        const numericId = parseInt(opt.value);
        return {
          id: !isNaN(numericId) && numericId > 0 ? numericId : index + 1,
          name: opt.label,
          value: opt.value,
        };
      });

      const selectedOption =
        selectOptions.find((opt) => String(opt.value) === String(value)) || null;

      return (
        <div className="w-full">
          <CustomSelect
            id={fieldId}
            name={fieldId}
            label={field.label}
            value={selectedOption}
            options={selectOptions}
            onChange={(option) => onChange(option?.value || "")}
            required={field.required}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );

    case "multiselect":
      const multiSelectOptions = field.options.map((opt, index) => ({
        id: parseInt(opt.value) || index + 1,
        name: opt.label,
        value: opt.value,
      }));

      const selectedValues =
        Array.isArray(value) && value.every((v) => typeof v === "string")
          ? (value as string[])
          : [];

      return (
        <div className="col-span-1 md:col-span-2 w-full">
          <CustomMultiselect
            id={fieldId}
            name={fieldId}
            label={field.label}
            value={selectedValues}
            options={multiSelectOptions}
            onChange={(values) => onChange(values)}
            placeholder={field.placeholder || "Seçiniz"}
            required={field.required}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );

    case "checkbox":
      return (
        <div className="col-span-1 md:col-span-2 w-full">
          <CustomCheckbox
            id={fieldId}
            label={field.label}
            checked={typeof value === "boolean" ? value : false}
            onChange={(checked) => onChange(checked)}
            required={field.required}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );

    case "file":
      const fileInputRef = useRef<HTMLInputElement>(null);
      const [isDragging, setIsDragging] = React.useState(false);
      const dragCounterRef = React.useRef(0);
      const files = Array.isArray(value)
        ? value.filter((v): v is File => v instanceof File)
        : [];

      // Validation rules'dan mimes formatlarını çıkar
      const mimesRule = field.validation_rules.find((rule) =>
        rule.startsWith("mimes:")
      );
      let allowedExtensions: string[] = [];
      let allowedFormats: string[] = [];

      if (mimesRule) {
        const mimesValue = mimesRule.split(":")[1];
        if (mimesValue) {
          allowedFormats = mimesValue.split(",").map((m) => m.trim());
          allowedExtensions = allowedFormats.map((format) => {
            // Format mapping: webp -> .webp, jpeg/jpg -> .jpg/.jpeg, png -> .png, pdf -> .pdf, doc -> .doc, docx -> .docx, jif -> .jif
            const formatMap: { [key: string]: string[] } = {
              webp: [".webp"],
              jpeg: [".jpeg"],
              jpg: [".jpg"],
              png: [".png"],
              pdf: [".pdf"],
              doc: [".doc"],
              docx: [".docx"],
              jif: [".jif"],
            };
            return formatMap[format.toLowerCase()] || [`.${format}`];
          }).flat();
        }
      }

      // Eğer mimes rule yoksa varsayılan formatları kullan
      if (allowedExtensions.length === 0) {
        allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png"];
        allowedFormats = ["PDF", "JPG", "JPEG", "PNG"];
      } else {
        // Formatları büyük harfli gösterim için düzenle
        allowedFormats = allowedExtensions.map((ext) =>
          ext.replace(".", "").toUpperCase()
        );
      }

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles || selectedFiles.length === 0) return;

        const newFiles = Array.from(selectedFiles);
        const validFiles = newFiles.filter((file) => {
          const extension = file.name
            .substring(file.name.lastIndexOf("."))
            .toLowerCase();
          return allowedExtensions.includes(extension);
        });

        if (validFiles.length !== newFiles.length) {
          funcSweetAlert({
            title: t("Uyarı"),
            text: t(`Sadece ${allowedFormats.join(", ")} formatları desteklenir.`),
            icon: "warning",
            confirmButtonText: t("Tamam"),
          });
        }

        onChange([...files, ...validFiles]);
      };

      const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounterRef.current++;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
          setIsDragging(true);
        }
      };

      const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounterRef.current--;
        if (dragCounterRef.current === 0) {
          setIsDragging(false);
        }
      };

      const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };

      const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        dragCounterRef.current = 0;

        const droppedFiles = e.dataTransfer.files;
        if (!droppedFiles || droppedFiles.length === 0) return;

        const newFiles = Array.from(droppedFiles);
        const validFiles = newFiles.filter((file) => {
          const extension = file.name
            .substring(file.name.lastIndexOf("."))
            .toLowerCase();
          return allowedExtensions.includes(extension);
        });

        if (validFiles.length !== newFiles.length) {
          funcSweetAlert({
            title: t("Uyarı"),
            text: t(`Sadece ${allowedFormats.join(", ")} formatları desteklenir.`),
            icon: "warning",
            confirmButtonText: t("Tamam"),
          });
        }

        onChange([...files, ...validFiles]);
      };

      const handleRemoveFile = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        onChange(newFiles);
        if (onFileRemove) {
          onFileRemove(index);
        }
      };

      const filePreviews = onFilePreview ? onFilePreview(files) : [];

      return (
        <div className="col-span-1 md:col-span-2 w-full">
          <label className="block mb-2 font-medium text-gray-700 text-sm">
            {field.label}
            {field.required && <span className="text-sitePrimary ml-1">*</span>}
          </label>
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
              isDragging
                ? "border-sitePrimary bg-sitePrimary/10"
                : "border-gray-300 bg-gray-50 hover:border-sitePrimary hover:bg-gray-100"
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"

              accept={allowedExtensions.join(",")}
              multiple
              onChange={handleFileChange}
              className="hidden"
              key={`${fieldId}-${files.length}`}
            />
            <div className="cursor-pointer">
              <IoDocumentTextOutline className="text-5xl mx-auto mb-3 text-gray-400" />
              <p className="text-sm text-gray-600 mb-1">
                {t("Dosyaları seçin veya buraya sürükleyin")}
              </p>
              <p className="text-xs text-gray-400">
                {allowedFormats.join(", ")} {t("formatları desteklenir")}
              </p>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          {files.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {files.map((file, index) => {
                const preview = filePreviews.find((p) => p.file === file);
                return (
                  <div
                    key={index}
                    className="relative border border-gray-200 rounded-lg overflow-hidden bg-white group hover:shadow-md transition-shadow"
                  >
                    {preview ? (
                      <div className="relative w-full h-20">
                        <Image
                          src={preview.preview}
                          alt={file.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-20 bg-gray-100 flex items-center justify-center">
                        <IoDocumentTextOutline className="text-3xl text-gray-400" />
                      </div>
                    )}
                    <div className="p-2">
                      <p
                        className="text-xs text-gray-700 font-medium truncate"
                        title={file.name}
                      >
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      aria-label={t("Dosyayı kaldır")}
                    >
                      <IoClose className="text-sm" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}

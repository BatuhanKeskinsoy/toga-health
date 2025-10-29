import { CustomField } from "@/lib/types/customFields";

export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

/**
 * Validation rules'ları parse eder ve kontrol eder
 */
const parseValidationRule = (rule: string): { type: string; value?: string | number } => {
  const parts = rule.split(":");
  return {
    type: parts[0],
    value: parts[1] ? (isNaN(Number(parts[1])) ? parts[1] : Number(parts[1])) : undefined,
  };
};

/**
 * Tek bir field'ı validation rules'a göre validate eder
 */
const validateFieldByRules = (
  field: CustomField,
  value: any,
  t?: (key: string) => string
): string | null => {
  if (!field.validation_rules || field.validation_rules.length === 0) {
    return null;
  }

  const rules = field.validation_rules.map(parseValidationRule);

  // Required kontrolü
  const hasRequired = rules.some((r) => r.type === "required");
  if (hasRequired) {
    if (field.type === "checkbox") {
      if (!value) {
        return t
          ? t(`${field.label} alanı zorunludur`)
          : `${field.label} alanı zorunludur`;
      }
    } else if (field.type === "multiselect") {
      if (!value || !Array.isArray(value) || value.length === 0) {
        return t
          ? t(`${field.label} alanından en az bir seçim yapmalısınız`)
          : `${field.label} alanından en az bir seçim yapmalısınız`;
      }
    } else if (field.type === "file") {
      const fileArray = Array.isArray(value)
        ? value.filter((v): v is File => v instanceof File)
        : [];
      if (fileArray.length === 0) {
        return t
          ? t(`${field.label} alanı zorunludur`)
          : `${field.label} alanı zorunludur`;
      }
    } else {
      if (!value || String(value).trim() === "") {
        return t
          ? t(`${field.label} alanı zorunludur`)
          : `${field.label} alanı zorunludur`;
      }
    }
  }

  // Eğer value yoksa ve required değilse, diğer kontrolleri yapma
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return null;
  }

  // String validasyonu
  if (field.type === "text" || field.type === "textarea") {
    const stringRule = rules.find((r) => r.type === "string");
    if (stringRule) {
      const strValue = String(value);

      // Max length kontrolü
      const maxRule = rules.find((r) => r.type === "max");
      if (maxRule && maxRule.value && strValue.length > (maxRule.value as number)) {
        return t
          ? t(`${field.label} en fazla ${maxRule.value} karakter olabilir`)
          : `${field.label} en fazla ${maxRule.value} karakter olabilir`;
      }

      // Min length kontrolü
      const minRule = rules.find((r) => r.type === "min");
      if (minRule && minRule.value && strValue.length < (minRule.value as number)) {
        return t
          ? t(`${field.label} en az ${minRule.value} karakter olmalıdır`)
          : `${field.label} en az ${minRule.value} karakter olmalıdır`;
      }
    }
  }

  // Integer/Number validasyonu
  if (field.type === "number") {
    const integerRule = rules.find((r) => r.type === "integer");
    if (integerRule) {
      const numValue = typeof value === "number" ? value : parseFloat(String(value));

      if (isNaN(numValue)) {
        return t
          ? t(`${field.label} geçerli bir sayı olmalıdır`)
          : `${field.label} geçerli bir sayı olmalıdır`;
      }

      // Min kontrolü
      const minRule = rules.find((r) => r.type === "min");
      if (minRule && minRule.value !== undefined && numValue < (minRule.value as number)) {
        return t
          ? t(`${field.label} en az ${minRule.value} olmalıdır`)
          : `${field.label} en az ${minRule.value} olmalıdır`;
      }

      // Max kontrolü
      const maxRule = rules.find((r) => r.type === "max");
      if (maxRule && maxRule.value !== undefined && numValue > (maxRule.value as number)) {
        return t
          ? t(`${field.label} en fazla ${maxRule.value} olabilir`)
          : `${field.label} en fazla ${maxRule.value} olabilir`;
      }
    }
  }

  // File validasyonu
  if (field.type === "file") {
    const mimesRule = rules.find((r) => r.type === "mimes");
    if (mimesRule && mimesRule.value) {
      const allowedMimes = String(mimesRule.value).split(",");
      const files = Array.isArray(value)
        ? value.filter((v): v is File => v instanceof File)
        : [];

      for (const file of files) {
        const extension = file.name
          .substring(file.name.lastIndexOf(".") + 1)
          .toLowerCase();
        const mimeType = file.type;

        const isAllowed =
          allowedMimes.some((mime) => {
            const cleanMime = mime.trim();
            return (
              extension === cleanMime ||
              mimeType.includes(cleanMime) ||
              (cleanMime === "jpeg" && extension === "jpg") ||
              (cleanMime === "jpg" && extension === "jpeg")
            );
          }) ||
          allowedMimes.includes(mimeType);

        if (!isAllowed) {
          return t
            ? t(`${field.label} için izin verilen formatlar: ${allowedMimes.join(", ")}`)
            : `${field.label} için izin verilen formatlar: ${allowedMimes.join(", ")}`;
        }
      }
    }
  }

  return null;
};

/**
 * Custom fields'ları validate eder
 */
export const validateCustomFields = (
  fields: CustomField[],
  values: { [key: string]: any },
  t?: (key: string) => string
): ValidationResult => {
  const errors: { [key: string]: string } = {};

  fields.forEach((field) => {
    const value = values[field.key];
    const error = validateFieldByRules(field, value, t);

    if (error) {
      errors[`custom_${field.key}`] = error;
    }

    // Backward compatibility: required field kontrolü (eğer validation_rules yoksa)
    if (!field.validation_rules || field.validation_rules.length === 0) {
      if (field.required) {
        if (field.type === "checkbox") {
          if (!value) {
            errors[`custom_${field.key}`] = t
              ? t(`${field.label} alanı zorunludur`)
              : `${field.label} alanı zorunludur`;
          }
        } else if (field.type === "multiselect") {
          if (!value || !Array.isArray(value) || value.length === 0) {
            errors[`custom_${field.key}`] = t
              ? t(`${field.label} alanından en az bir seçim yapmalısınız`)
              : `${field.label} alanından en az bir seçim yapmalısınız`;
          }
        } else if (field.type === "file") {
          const fileArray = Array.isArray(value)
            ? value.filter((v): v is File => v instanceof File)
            : [];
          if (fileArray.length === 0) {
            errors[`custom_${field.key}`] = t
              ? t(`${field.label} alanı zorunludur`)
              : `${field.label} alanı zorunludur`;
          }
        } else {
          if (!value || String(value).trim() === "") {
            errors[`custom_${field.key}`] = t
              ? t(`${field.label} alanı zorunludur`)
              : `${field.label} alanı zorunludur`;
          }
        }
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};


export interface CustomFieldOption {
  value: string;
  label: string;
}

export interface CustomField {
  id: number;
  key: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'checkbox' | 'textarea' | 'file';
  country_code: string | null;
  label: string;
  required: boolean;
  options: CustomFieldOption[];
  placeholder: string;
  group: string;
  validation_rules: string[];
}

export interface CustomFieldsResponse {
  success: boolean;
  data: CustomField[];
}

export interface CustomFieldValue {
  key: string;
  value: string | number | boolean | string[];
}

export interface CustomFieldGroup {
  groupName: string;
  fields: CustomField[];
}

export interface CustomFieldOption {
  value: string;
  label: string;
}

export interface CustomField {
  key: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'checkbox' | 'textarea';
  label: string;
  required: boolean;
  options: CustomFieldOption[];
  placeholder: string;
  group: string;
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

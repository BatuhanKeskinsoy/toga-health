import { CustomField } from '@/lib/types/customFields';

export const renderCustomField = (field: CustomField): string => {
  const fieldId = `custom_${field.key}`;
  const requiredMark = field.required ? '<span style="color: #ed1c24;">*</span>' : '';
  
  const baseLabel = `
    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 14px;">
      ${field.label} ${requiredMark}
    </label>
  `;

  const baseInputStyle = `
    width: 100%; 
    padding: 16px 20px; 
    border: 1px solid #d2d6d8; 
    border-radius: 8px; 
    font-size: 16px; 
    background: #f9fafb; 
    transition: all 0.3s ease;
  `;

  const focusEvents = `
    onfocus="this.style.borderColor='#ed1c24'; this.style.backgroundColor='white';" 
    onblur="this.style.borderColor='#d2d6d8'; this.style.backgroundColor='#f9fafb';"
  `;

  switch (field.type) {
    case 'text':
      return `
        <div style="margin-bottom: 24px;">
          ${baseLabel}
          <input 
            id="${fieldId}" 
            type="text" 
            placeholder="${field.placeholder}" 
            style="${baseInputStyle}" 
            ${focusEvents}
          >
        </div>
      `;

    case 'number':
      return `
        <div style="margin-bottom: 24px;">
          ${baseLabel}
          <input 
            id="${fieldId}" 
            type="number" 
            placeholder="${field.placeholder}" 
            style="${baseInputStyle}" 
            ${focusEvents}
          >
        </div>
      `;

    case 'textarea':
      return `
        <div style="margin-bottom: 24px;">
          ${baseLabel}
          <textarea 
            id="${fieldId}" 
            placeholder="${field.placeholder}" 
            style="${baseInputStyle} min-height: 100px; resize: vertical;" 
            ${focusEvents}
          ></textarea>
        </div>
      `;

    case 'select':
      const selectOptions = field.options.map(option => 
        `<option value="${option.value}">${option.label}</option>`
      ).join('');
      
      return `
        <div style="margin-bottom: 24px;">
          ${baseLabel}
          <div style="position: relative;">
            <select 
              id="${fieldId}" 
              style="${baseInputStyle} appearance: none; background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 4 5\"><path fill=\"%23666\" d=\"M2 0L0 2h4zm0 5L0 3h4z\"/></svg>'); background-repeat: no-repeat; background-position: right 16px center; background-size: 12px;" 
              ${focusEvents}
            >
              <option value="">${field.placeholder || 'Seçiniz'}</option>
              ${selectOptions}
            </select>
          </div>
        </div>
      `;

    case 'multiselect':
      const multiSelectOptions = field.options.map(option => 
        `<option value="${option.value}">${option.label}</option>`
      ).join('');
      
      return `
        <div style="margin-bottom: 24px;">
          ${baseLabel}
          <div style="position: relative;">
            <select 
              id="${fieldId}" 
              multiple 
              style="${baseInputStyle} min-height: 120px;" 
              ${focusEvents}
            >
              ${multiSelectOptions}
            </select>
            <p style="font-size: 12px; color: #6b7280; margin: 4px 0 0 0;">
              Birden fazla seçim yapmak için Ctrl (Windows) veya Cmd (Mac) tuşunu basılı tutun
            </p>
          </div>
        </div>
      `;

    case 'checkbox':
      return `
        <div style="margin-bottom: 24px;">
          <div style="display: flex; align-items: center; gap: 12px; padding: 16px 20px; border: 1px solid #d2d6d8; border-radius: 8px; background: #f9fafb; transition: all 0.3s ease;" 
               onmouseover="this.style.borderColor='#ed1c24'; this.style.backgroundColor='#fff5f5';" 
               onmouseout="this.style.borderColor='#d2d6d8'; this.style.backgroundColor='#f9fafb';">
            <input 
              id="${fieldId}" 
              type="checkbox" 
              style="width: 18px; height: 18px; accent-color: #ed1c24;"
            >
            <label for="${fieldId}" style="font-weight: 500; color: #374151; font-size: 14px; margin: 0; cursor: pointer;">
              ${field.label} ${requiredMark}
            </label>
          </div>
        </div>
      `;

    default:
      return '';
  }
};

export const groupCustomFields = (fields: CustomField[]): { [key: string]: CustomField[] } => {
  return fields.reduce((groups, field) => {
    if (!groups[field.group]) {
      groups[field.group] = [];
    }
    groups[field.group].push(field);
    return groups;
  }, {} as { [key: string]: CustomField[] });
};

export const getCustomFieldValue = (field: CustomField): string | number | boolean | string[] => {
  const fieldId = `custom_${field.key}`;
  const element = document.querySelector(`#${fieldId}`) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  
  if (!element) return '';

  switch (field.type) {
    case 'checkbox':
      return (element as HTMLInputElement).checked;
    
    case 'multiselect':
      const selectElement = element as HTMLSelectElement;
      return Array.from(selectElement.selectedOptions).map(option => option.value);
    
    case 'number':
      const numberValue = (element as HTMLInputElement).value;
      return numberValue ? parseInt(numberValue) : '';
    
    default:
      return element.value;
  }
};

export const validateCustomFields = (fields: CustomField[]): { isValid: boolean; message?: string } => {
  for (const field of fields) {
    if (field.required) {
      const value = getCustomFieldValue(field);
      
      if (field.type === 'checkbox') {
        if (!value) {
          return { isValid: false, message: `${field.label} alanı zorunludur` };
        }
      } else if (field.type === 'multiselect') {
        if (!value || (value as string[]).length === 0) {
          return { isValid: false, message: `${field.label} alanından en az bir seçim yapmalısınız` };
        }
      } else {
        if (!value || String(value).trim() === '') {
          return { isValid: false, message: `${field.label} alanı zorunludur` };
        }
      }
    }
  }
  
  return { isValid: true };
};

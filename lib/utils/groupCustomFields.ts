import { CustomField } from "@/lib/types/customFields";

/**
 * Custom fields'ları grup adlarına göre gruplandırır
 */
export const groupCustomFields = (
  fields: CustomField[]
): { [key: string]: CustomField[] } => {
  return fields.reduce(
    (groups, field) => {
      if (!groups[field.group]) {
        groups[field.group] = [];
      }
      groups[field.group].push(field);
      return groups;
    },
    {} as { [key: string]: CustomField[] }
  );
};


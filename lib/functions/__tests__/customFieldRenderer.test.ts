import { renderCustomField, groupCustomFields, validateCustomFields } from '../customFieldRenderer';
import { CustomField } from '@/lib/types/customFields';

// Mock DOM methods
Object.defineProperty(document, 'querySelector', {
  value: jest.fn(),
  writable: true
});

describe('CustomFieldRenderer', () => {
  const mockCustomFields: CustomField[] = [
    {
      key: 'npi_number',
      type: 'text',
      label: 'NPI Numarası',
      required: false,
      options: [],
      placeholder: 'NPI numaranızı giriniz',
      group: 'genel_bilgiler'
    },
    {
      key: 'telemedicine_platform',
      type: 'select',
      label: 'Teletıp Platformu',
      required: true,
      options: [
        { value: 'zoom', label: 'Zoom' },
        { value: 'teams', label: 'Microsoft Teams' }
      ],
      placeholder: '',
      group: 'hizmet_ozellikleri'
    },
    {
      key: 'parking_available',
      type: 'checkbox',
      label: 'Otopark Mevcut',
      required: false,
      options: [],
      placeholder: '',
      group: 'hizmet_ozellikleri'
    }
  ];

  describe('renderCustomField', () => {
    it('should render text field correctly', () => {
      const field = mockCustomFields[0];
      const result = renderCustomField(field);
      
      expect(result).toContain('input');
      expect(result).toContain('type="text"');
      expect(result).toContain('NPI Numarası');
      expect(result).toContain('NPI numaranızı giriniz');
    });

    it('should render select field correctly', () => {
      const field = mockCustomFields[1];
      const result = renderCustomField(field);
      
      expect(result).toContain('select');
      expect(result).toContain('Teletıp Platformu');
      expect(result).toContain('Zoom');
      expect(result).toContain('Microsoft Teams');
      expect(result).toContain('color: #ed1c24'); // Required field indicator
    });

    it('should render checkbox field correctly', () => {
      const field = mockCustomFields[2];
      const result = renderCustomField(field);
      
      expect(result).toContain('input');
      expect(result).toContain('type="checkbox"');
      expect(result).toContain('Otopark Mevcut');
    });
  });

  describe('groupCustomFields', () => {
    it('should group fields by group name', () => {
      const result = groupCustomFields(mockCustomFields);
      
      expect(result).toHaveProperty('genel_bilgiler');
      expect(result).toHaveProperty('hizmet_ozellikleri');
      expect(result.genel_bilgiler).toHaveLength(1);
      expect(result.hizmet_ozellikleri).toHaveLength(2);
    });
  });

  describe('validateCustomFields', () => {
    beforeEach(() => {
      // Mock DOM elements
      (document.querySelector as jest.Mock).mockImplementation((selector: string) => {
        if (selector === '#custom_telemedicine_platform') {
          return { value: 'zoom' };
        }
        if (selector === '#custom_parking_available') {
          return { checked: true };
        }
        return { value: 'test value' };
      });
    });

    it('should validate required fields', () => {
      const result = validateCustomFields(mockCustomFields);
      expect(result.isValid).toBe(true);
    });

    it('should fail validation for empty required fields', () => {
      (document.querySelector as jest.Mock).mockImplementation((selector: string) => {
        if (selector === '#custom_telemedicine_platform') {
          return { value: '' };
        }
        return { value: 'test value' };
      });

      const result = validateCustomFields(mockCustomFields);
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Teletıp Platformu');
    });
  });
});

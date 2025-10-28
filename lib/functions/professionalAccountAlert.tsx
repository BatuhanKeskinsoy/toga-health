"use client";
import Swal from 'sweetalert2';
import { applyProfessionalAccount, getCustomFieldsForDoctor, getCustomFieldsForCorporate } from '@/lib/services/user/confirmations';
import { CustomField } from '@/lib/types/customFields';
import { renderCustomField, groupCustomFields, getCustomFieldValue, validateCustomFields } from '@/lib/functions/customFieldRenderer';

// Modern DOM utility fonksiyonları
const getElementValue = (selector: string): string => {
  const element = document.querySelector(selector) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  return element?.value || '';
};

const addAnimation = (element: HTMLElement, delay: number): void => {
  if (!element) return;
  element.style.opacity = '0';
  element.style.transform = 'translateY(20px)';
  
  setTimeout(() => {
    element.style.transition = 'all 0.5s ease';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }, delay);
};

const addClickListener = (element: HTMLElement, callback: () => void): void => {
  if (!element) return;
  element.addEventListener('click', callback);
};

// Profesyonel hesap türü seçimi için SweetAlert
export const showProfessionalAccountTypeSelection = async (t: (key: string) => string) => {
  const result = await Swal.fire({
    title: '<div style="display: flex; align-items: center; justify-content: flex-start; gap: 8px;"><span style="font-size: 24px;">🏥</span><span>Profesyonel Hesap Başvurusu</span></div>',
    html: `
      <div style="text-align: center; lg:padding: 20px 0; padding: 6px;">
        <p style="font-size: 18px; color: #374151; margin-bottom: 30px; font-weight: 500;">
          ${t("Hangi tür profesyonel hesap için başvuru yapmak istiyorsunuz?")}
        </p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 600px; margin: 0 auto; @media (max-width: 768px) { grid-template-columns: 1fr; }">
          <!-- Doktor Seçeneği -->
          <div id="doctor-option" style="border: 2px solid #e5e7eb; border-radius: 16px; padding: 30px 20px; cursor: pointer; transition: all 0.3s ease; background: linear-gradient(135deg, #fff 0%, #f8fafc 100%);" 
               onmouseover="this.style.borderColor='#ed1c24'; this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 25px rgba(237, 28, 36, 0.15)';" 
               onmouseout="this.style.borderColor='#e5e7eb'; this.style.transform='translateY(0)'; this.style.boxShadow='none';">
            <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: linear-gradient(135deg, #ed1c24, #ff6b6b); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(237, 28, 36, 0.3); transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
                <circle cx="12" cy="8" r="2" fill="white"/>
              </svg>
            </div>
            <h3 style="font-size: 20px; font-weight: 600; color: #1f2937; margin: 0 0 10px 0;">Doktor</h3>
            <p style="font-size: 14px; color: #6b7280; margin: 0; line-height: 1.5;">
              ${t("Bireysel doktor hesabı oluşturun ve hastalarınızla randevular oluşturun.")}
            </p>
            <div style="margin-top: 15px; padding: 8px 16px; background: rgba(237, 28, 36, 0.1); border-radius: 20px; display: inline-block; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(237, 28, 36, 0.2)'; this.style.transform='scale(1.05)'" onmouseout="this.style.background='rgba(237, 28, 36, 0.1)'; this.style.transform='scale(1)'">
              <span style="font-size: 12px; color: #ed1c24; font-weight: 600;">Başvuru Yap</span>
            </div>
          </div>
          
          <!-- Kurum Seçeneği -->
          <div id="corporate-option" style="border: 2px solid #e5e7eb; border-radius: 16px; padding: 30px 20px; cursor: pointer; transition: all 0.3s ease; background: linear-gradient(135deg, #fff 0%, #f8fafc 100%);" 
               onmouseover="this.style.borderColor='#ed1c24'; this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 25px rgba(237, 28, 36, 0.15)';" 
               onmouseout="this.style.borderColor='#e5e7eb'; this.style.transform='translateY(0)'; this.style.boxShadow='none';">
            <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: linear-gradient(135deg, #ed1c24, #ff6b6b); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(237, 28, 36, 0.3); transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M19 19H5V5H19V19M17 12H15V17H13V12H11V10H13V7H15V10H17V12Z"/>
              </svg>
            </div>
            <h3 style="font-size: 20px; font-weight: 600; color: #1f2937; margin: 0 0 10px 0;">Kurum</h3>
            <p style="font-size: 14px; color: #6b7280; margin: 0; line-height: 1.5;">
              ${t("Hastane veya klinik hesabı oluşturun ve kurumsal hizmetlerinizi sunun.")}
            </p>
            <div style="margin-top: 15px; padding: 8px 16px; background: rgba(237, 28, 36, 0.1); border-radius: 20px; display: inline-block; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(237, 28, 36, 0.2)'; this.style.transform='scale(1.05)'" onmouseout="this.style.background='rgba(237, 28, 36, 0.1)'; this.style.transform='scale(1)'">
              <span style="font-size: 12px; color: #ed1c24; font-weight: 600;">Başvuru Yap</span>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 16px; border-left: 4px solid #ed1c24; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; background: #ed1c24; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span style="font-size: 20px;">💡</span>
            </div>
            <div>
              <p style="font-size: 14px; color: #374151; margin: 0 0 4px 0; font-weight: 600;">Bilgi</p>
              <p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.4;">
                ${t("Profesyonel hesabınız onaylandıktan sonra randevu alma ve verme özelliklerine erişebileceksiniz.")}
              </p>
            </div>
          </div>
        </div>
      </div>
    `,
    width: 'min(92vw, 700px)',
    showCancelButton: false,
    showConfirmButton: false,
    showDenyButton: false,
    showCloseButton: true,
    willOpen: () => {
      try {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
      } catch {}
    },
    allowOutsideClick: true,
    allowEscapeKey: true,
    customClass: {
      popup: 'swal2-popup-custom responsive-professional'
    },
    didOpen: () => {
      // Modern DOM query kullanımı
      const doctorOption = document.querySelector('#doctor-option') as HTMLElement;
      const corporateOption = document.querySelector('#corporate-option') as HTMLElement;
      const container = doctorOption?.parentElement as HTMLElement | null;
      
      // Animasyonları başlat
      addAnimation(doctorOption, 100);
      addAnimation(corporateOption, 200);
      
      // Click event'leri ekle
      addClickListener(doctorOption, () => Swal.clickConfirm());
      addClickListener(corporateOption, () => Swal.clickCancel());

      // Mobile responsive düzenlemeler
      if (typeof window !== 'undefined' && window.innerWidth < 640) {
        try {
          const popup = Swal.getPopup();
          const html = Swal.getHtmlContainer();
          const titleEl = Swal.getTitle();
          const descP = html?.querySelector('p');
          if (popup) {
            popup.style.padding = '0';
            popup.style.width = '100vw';
            popup.style.maxWidth = '100vw';
            popup.style.height = '100vh';
            popup.style.maxHeight = '100vh';
            popup.style.borderRadius = '0';
            popup.style.margin = '0';
            popup.style.position = 'fixed';
            popup.style.top = '0';
            popup.style.left = '0';
            popup.style.transform = 'none';
            popup.style.display = 'flex';
            (popup.style as any).flexDirection = 'column';
          }
          if (html) html.style.margin = '0';
          if (titleEl) (titleEl as HTMLElement).style.fontSize = '16px';
          if (descP) {
            (descP as HTMLElement).style.fontSize = '13px';
            (descP as HTMLElement).style.marginBottom = '10px';
          }
          if (html) {
            (html.style as any).flex = '1 1 auto';
            html.style.overflowY = 'auto';
            html.style.padding = '8px 10px 12px';
            html.style.width = '100%';
          }
          if (container) {
            container.style.display = 'grid';
            (container.style as any).gridTemplateColumns = '1fr';
            container.style.gap = '10px';
          }
          [doctorOption, corporateOption].forEach((el) => {
            if (el) {
              el.style.padding = '14px';
              el.style.borderRadius = '10px';
              // Başlık ve açıklama fontlarını küçült
              const h3 = el.querySelector('h3') as HTMLElement | null;
              const p = el.querySelector('p') as HTMLElement | null;
              const badge = el.querySelector('.pro-badge span') as HTMLElement | null;
              const icon = el.querySelector('.pro-icon') as HTMLElement | null;
              if (h3) h3.style.fontSize = '16px';
              if (p) p.style.fontSize = '12.5px';
              if (badge) badge.style.fontSize = '11px';
              if (icon) { icon.style.width = '56px'; icon.style.height = '56px'; icon.style.marginBottom = '10px'; }
            }
          });
        } catch {}
      }
      // Align header: title on left, close on right (without moving nodes)
      const closeBtn = Swal.getCloseButton();
      const titleEl = Swal.getTitle();
      const header = Swal.getPopup()?.querySelector('.swal2-header') as HTMLElement | null;
      if (header) {
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.justifyContent = 'space-between';
        header.style.width = '100%';
        header.style.gap = '8px';
      }
      if (titleEl) {
        const title = titleEl as HTMLElement;
        title.style.margin = '0';
        title.style.textAlign = 'left';
        title.style.display = 'flex';
        title.style.alignItems = 'center';
        title.style.gap = '8px';
        (title.style as any).flex = '1 1 auto';
        (title.style as any).minWidth = '0';
      }
      if (closeBtn) {
        const btn = closeBtn as HTMLElement;
        btn.style.position = 'static';
        btn.style.marginLeft = 'auto';
        (btn.style as any).flex = '0 0 auto';
        btn.style.alignSelf = 'center';
      }
    }
    ,willClose: () => {
      try {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      } catch {}
    }
  });

  if (result.isConfirmed) {
    // Doktor başvurusu
    await showDoctorApplicationForm();
  } else if (result.isDismissed && String(result.dismiss) === 'cancel') {
    // Kurum başvurusu
    await showCorporateApplicationForm();
  }
  // İptal durumunda hiçbir şey yapma
};

// Optimized file handling with preview
if (typeof window !== 'undefined') {
  (window as any).handleFileSelect = (input: HTMLInputElement) => {
  const fileList = document.getElementById('file-list');
  const selectedFiles = document.getElementById('selected-files');
  
  if (!fileList || !selectedFiles) return;
  
  // Use storage instead of input.files
  const files = (window as any).doctorFileStorage || [];
  
  if (files.length > 0) {
    fileList.style.display = 'block';
    
    // Get current file count in DOM
    const existingCount = selectedFiles.children.length;
    
    // Only process files that haven't been rendered yet
    if (files.length > existingCount) {
      const processFile = (index: number) => {
        if (index >= files.length) return;
        
        const file = files[index];
        const fileItem = document.createElement('div');
        fileItem.setAttribute('data-file-index', index.toString());
        fileItem.style.cssText = 'position: relative; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background: white; transition: transform 0.2s ease;';
        
        // Create preview based on file type
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            fileItem.innerHTML = `
              <img src="${e.target?.result}" style="width: 100%; height: 80px; object-fit: cover; display: block;" />
              <div style="padding: 4px;">
                <p style="font-size: 11px; color: #374151; margin: 0; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${file.name}">${file.name}</p>
                <p style="font-size: 10px; color: #6b7280; margin: 0;">${(file.size / 1024).toFixed(0)} KB</p>
              </div>
            `;
            fileItem.onmouseenter = () => fileItem.style.transform = 'scale(1.05)';
            fileItem.onmouseleave = () => fileItem.style.transform = 'scale(1)';
            selectedFiles.appendChild(fileItem);
            processFile(index + 1);
          };
          reader.onerror = () => processFile(index + 1);
          reader.readAsDataURL(file);
        } else {
          fileItem.innerHTML = `
            <div style="width: 100%; height: 80px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 32px;">📄</div>
            <div style="padding: 4px;">
              <p style="font-size: 11px; color: #374151; margin: 0; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${file.name}">${file.name}</p>
              <p style="font-size: 10px; color: #6b7280; margin: 0;">${(file.size / 1024).toFixed(0)} KB</p>
            </div>
          `;
          fileItem.onmouseenter = () => fileItem.style.transform = 'scale(1.05)';
          fileItem.onmouseleave = () => fileItem.style.transform = 'scale(1)';
          selectedFiles.appendChild(fileItem);
          processFile(index + 1);
        }
      };
      
      // Start from the first new file
      processFile(existingCount);
    }
  }
  };
}

if (typeof window !== 'undefined') {
  (window as any).handleFileSelectCorp = (input: HTMLInputElement) => {
  const fileList = document.getElementById('corp-file-list');
  const selectedFiles = document.getElementById('corp-selected-files');
  
  if (!fileList || !selectedFiles) return;
  
  // Use storage instead of input.files
  const files = (window as any).corporateFileStorage || [];
  
  if (files.length > 0) {
    fileList.style.display = 'block';
    
    // Get current file count in DOM
    const existingCount = selectedFiles.children.length;
    
    // Only process files that haven't been rendered yet
    if (files.length > existingCount) {
      const processFile = (index: number) => {
        if (index >= files.length) return;
        
        const file = files[index];
        const fileItem = document.createElement('div');
        fileItem.setAttribute('data-file-index', index.toString());
        fileItem.style.cssText = 'position: relative; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background: white; transition: transform 0.2s ease;';
        
        // Create preview based on file type
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            fileItem.innerHTML = `
              <img src="${e.target?.result}" style="width: 100%; height: 80px; object-fit: cover; display: block;" />
              <div style="padding: 4px;">
                <p style="font-size: 11px; color: #374151; margin: 0; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${file.name}">${file.name}</p>
                <p style="font-size: 10px; color: #6b7280; margin: 0;">${(file.size / 1024).toFixed(0)} KB</p>
              </div>
            `;
            fileItem.onmouseenter = () => fileItem.style.transform = 'scale(1.05)';
            fileItem.onmouseleave = () => fileItem.style.transform = 'scale(1)';
            selectedFiles.appendChild(fileItem);
            processFile(index + 1);
          };
          reader.onerror = () => processFile(index + 1);
          reader.readAsDataURL(file);
        } else {
          fileItem.innerHTML = `
            <div style="width: 100%; height: 80px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 32px;">📄</div>
            <div style="padding: 4px;">
              <p style="font-size: 11px; color: #374151; margin: 0; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${file.name}">${file.name}</p>
              <p style="font-size: 10px; color: #6b7280; margin: 0;">${(file.size / 1024).toFixed(0)} KB</p>
            </div>
          `;
          fileItem.onmouseenter = () => fileItem.style.transform = 'scale(1.05)';
          fileItem.onmouseleave = () => fileItem.style.transform = 'scale(1)';
          selectedFiles.appendChild(fileItem);
          processFile(index + 1);
        }
      };
      
      // Start from the first new file
      processFile(existingCount);
    }
  }
  };
}

// Doktor başvuru formu
export const showDoctorApplicationForm = async () => {
  const specialties = [
    { id: 1, name: 'Kardiyoloji' },
    { id: 2, name: 'Nöroloji' },
    { id: 3, name: 'Ortopedi' },
    { id: 4, name: 'Dermatoloji' },
    { id: 5, name: 'Gastroenteroloji' },
    { id: 6, name: 'Üroloji' },
    { id: 7, name: 'Jinekoloji' },
    { id: 8, name: 'Pediatri' },
    { id: 9, name: 'Psikiyatri' },
    { id: 10, name: 'Göz Hastalıkları' }
  ];

  // Custom fields'ları çek
  let customFields: CustomField[] = [];
  try {
    customFields = await getCustomFieldsForDoctor();
  } catch (error) {
    console.error('Custom fields yüklenemedi:', error);
  }

  // Custom fields'ları grupla
  const groupedCustomFields = groupCustomFields(customFields);

  const { value: formData } = await Swal.fire({
    title: 'Doktor Başvuru Formu',
    width: 'min(96vw, 800px)',
    showCloseButton: true,
    html: `
      <div style="text-align: left; max-height: 600px; overflow-y: auto; padding: 20px 0;">
        <!-- Temel Bilgiler -->
        <div style="margin-bottom: 32px;">
          <h3 style="font-size: 18px; font-weight: 600; color: #1f2937; margin: 0 0 20px 0; padding-bottom: 8px; border-bottom: 2px solid #ed1c24;">Temel Bilgiler</h3>
          
          <div style="margin-bottom: 24px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 14px;">Uzmanlık Alanı <span style="color: #ed1c24;">*</span></label>
            <div style="position: relative;">
              <select id="specialty" style="width: 100%; padding: 16px 20px; border: 1px solid #d2d6d8; border-radius: 8px; font-size: 16px; background: #f9fafb; transition: all 0.3s ease; appearance: none; background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 4 5\"><path fill=\"%23666\" d=\"M2 0L0 2h4zm0 5L0 3h4z\"/></svg>'); background-repeat: no-repeat; background-position: right 16px center; background-size: 12px;" onchange="this.style.borderColor='#ed1c24'; this.style.backgroundColor='white';" onfocus="this.style.borderColor='#ed1c24'; this.style.backgroundColor='white';" onblur="this.style.borderColor='#d2d6d8'; this.style.backgroundColor='#f9fafb';">
                <option value="">Uzmanlık alanınızı seçin</option>
                ${specialties.map(specialty => `<option value="${specialty.id}">${specialty.name}</option>`).join('')}
              </select>
            </div>
          </div>
          
          <div style="margin-bottom: 24px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 14px;">Lisans Numarası <span style="color: #ed1c24;">*</span></label>
            <input id="license_number" type="text" placeholder="Lisans numaranızı girin" style="width: 100%; padding: 16px 20px; border: 1px solid #d2d6d8; border-radius: 8px; font-size: 16px; background: #f9fafb; transition: all 0.3s ease;" onfocus="this.style.borderColor='#ed1c24'; this.style.backgroundColor='white';" onblur="this.style.borderColor='#d2d6d8'; this.style.backgroundColor='#f9fafb';">
          </div>
        </div>

        <!-- Custom Fields -->
        ${Object.entries(groupedCustomFields).map(([groupName, fields]) => `
          <div style="margin-bottom: 32px;">
            <h3 style="font-size: 18px; font-weight: 600; color: #1f2937; margin: 0 0 20px 0; padding-bottom: 8px; border-bottom: 2px solid #ed1c24;">
              ${groupName === 'genel_bilgiler' ? 'Genel Bilgiler' : 
                groupName === 'hizmet_ozellikleri' ? 'Hizmet Özellikleri' : 
                groupName === 'ek_bilgiler' ? 'Ek Bilgiler' : 
                groupName}
            </h3>
            ${fields.map(field => renderCustomField(field)).join('')}
          </div>
        `).join('')}
        
        <!-- Belge Dosyaları -->
        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 18px; font-weight: 600; color: #1f2937; margin: 0 0 20px 0; padding-bottom: 8px; border-bottom: 2px solid #ed1c24;">Belge Dosyaları</h3>
          <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 14px;">Belge Dosyaları (Birden fazla seçebilirsiniz) <span style="color: #ed1c24;">*</span></label>
          <div style="border: 2px dashed #d2d6d8; border-radius: 12px; padding: 24px; background: #f9fafb; transition: all 0.3s ease; text-align: center;" id="dropzone">
            <input id="document_files" type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" multiple style="display: none;">
            <div style="cursor: pointer; padding: 12px;" onclick="document.getElementById('document_files').click()">
              <div style="font-size: 48px; margin-bottom: 12px;">📎</div>
              <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px 0;">Dosyaları seçin veya buraya sürükleyin</p>
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">PDF, JPG, PNG, DOC, DOCX formatları desteklenir</p>
            </div>
            <div id="file-list" style="display: none; margin-top: 16px;">
              <div id="selected-files" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px;"></div>
            </div>
          </div>
        </div>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Başvuru Gönder',
    cancelButtonText: 'İptal',
    confirmButtonColor: '#ed1c24',
    didOpen: () => {
      // Clear and setup file storage for Doctor form
      (window as any).doctorFileStorage = [];
      // Setup file input listeners
      (window as any).setupFileInputs();
      
      const popup = Swal.getPopup();
      const html = Swal.getHtmlContainer();
      const closeBtn = Swal.getCloseButton();
      const titleEl = Swal.getTitle();
      const header = Swal.getPopup()?.querySelector('.swal2-header') as HTMLElement | null;
      if (window.innerWidth < 640) {
        const titleEl = Swal.getTitle();
        if (popup) {
          popup.style.padding = '0';
          popup.style.width = '100vw';
          popup.style.maxWidth = '100vw';
          popup.style.height = '100vh';
          popup.style.maxHeight = '100vh';
          popup.style.borderRadius = '0';
          popup.style.margin = '0';
          popup.style.position = 'fixed';
          popup.style.top = '0';
          popup.style.left = '0';
          popup.style.transform = 'none';
          popup.style.display = 'flex';
          (popup.style as any).flexDirection = 'column';
        }
        if (html) {
          html.style.margin = '0';
          (html.style as any).flex = '1 1 auto';
          html.style.overflowY = 'auto';
          html.style.padding = '8px 10px 12px';
          html.style.width = '100%';
        }
        if (titleEl) (titleEl as HTMLElement).style.fontSize = '16px';
        // Reduce inputs/labels font-size
        const labels = html?.querySelectorAll('label') || [];
        labels.forEach((el: any) => (el.style.fontSize = '12px'));
        const fields = html?.querySelectorAll('input, select, textarea') || [];
        fields.forEach((el: any) => { el.style.fontSize = '13px'; el.style.padding = '10px 12px'; });
      }
      if (header) {
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.justifyContent = 'space-between';
        header.style.width = '100%';
        header.style.gap = '8px';
        header.style.flexWrap = 'nowrap';
      }
      if (titleEl) {
        const title = titleEl as HTMLElement;
        title.style.margin = '0';
        title.style.textAlign = 'left';
        title.style.display = 'flex';
        title.style.alignItems = 'center';
        title.style.gap = '8px';
        (title.style as any).flex = '1 1 auto';
        (title.style as any).minWidth = '0';
      }
      if (closeBtn) {
        const btn = closeBtn as HTMLElement;
        btn.style.position = 'static';
        btn.style.marginLeft = 'auto';
        (btn.style as any).flex = '0 0 auto';
        btn.style.alignSelf = 'center';
      }
    },
    willClose: () => {
      try {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      } catch {}
    },
    preConfirm: () => {
      const specialty = getElementValue('#specialty');
      const licenseNumber = getElementValue('#license_number');
      
      // Use storage instead of input
      const filesArray = (window as any).doctorFileStorage || [];

      if (!specialty) {
        Swal.showValidationMessage('Lütfen uzmanlık alanınızı seçin');
        return false;
      }
      if (!licenseNumber) {
        Swal.showValidationMessage('Lütfen lisans numaranızı girin');
        return false;
      }
      if (filesArray.length === 0) {
        Swal.showValidationMessage('Lütfen en az bir belge dosyası seçin');
        return false;
      }

      console.log('preConfirm - Storage files count:', filesArray.length);
      filesArray.forEach((file: File, idx: number) => {
        console.log(`File ${idx}:`, file.name);
      });

      // Custom fields validation
      const customFieldsValidation = validateCustomFields(customFields);
      if (!customFieldsValidation.isValid) {
        Swal.showValidationMessage(customFieldsValidation.message || 'Lütfen tüm zorunlu alanları doldurun');
        return false;
      }

      // Custom fields data collection
      const customFieldsData: { [key: string]: any } = {};
      customFields.forEach(field => {
        customFieldsData[field.key] = getCustomFieldValue(field);
      });

      console.log('preConfirm - Returned files count:', filesArray.length);

      return {
        specialty,
        licenseNumber,
        documentFiles: filesArray,
        customFields: customFieldsData
      };
    }
  });

  if (formData) {
    await submitDoctorApplication(formData);
  }
};

// Kurum başvuru formu
export const showCorporateApplicationForm = async () => {
  // Custom fields'ları çek
  let customFields: CustomField[] = [];
  try {
    customFields = await getCustomFieldsForCorporate();
  } catch (error) {
    console.error('Custom fields yüklenemedi:', error);
  }

  // Custom fields'ları grupla
  const groupedCustomFields = groupCustomFields(customFields);

  const { value: formData } = await Swal.fire({
    title: 'Kurum Başvuru Formu',
    width: 'min(96vw, 800px)',
    showCloseButton: true,
    willOpen: () => {
      // Clear file storage for Corporate form
      (window as any).corporateFileStorage = [];
    },
    html: `
      <div style="text-align: left; max-height: 600px; overflow-y: auto; padding: 20px 0;">
        <!-- Temel Bilgiler -->
        <div style="margin-bottom: 32px;">
          <h3 style="font-size: 18px; font-weight: 600; color: #1f2937; margin: 0 0 20px 0; padding-bottom: 8px; border-bottom: 2px solid #ed1c24;">Temel Bilgiler</h3>
          
          <div style="margin-bottom: 24px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 14px;">Vergi Numarası <span style="color: #ed1c24;">*</span></label>
            <input id="tax_number" type="text" placeholder="Vergi numarasını girin" style="width: 100%; padding: 16px 20px; border: 1px solid #d2d6d8; border-radius: 8px; font-size: 16px; background: #f9fafb; transition: all 0.3s ease;" onfocus="this.style.borderColor='#ed1c24'; this.style.backgroundColor='white';" onblur="this.style.borderColor='#d2d6d8'; this.style.backgroundColor='#f9fafb';">
          </div>
          
          <div style="margin-bottom: 24px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 14px;">Ruhsat Numarası <span style="color: #ed1c24;">*</span></label>
            <input id="license_number" type="text" placeholder="Ruhsat numarasını girin" style="width: 100%; padding: 16px 20px; border: 1px solid #d2d6d8; border-radius: 8px; font-size: 16px; background: #f9fafb; transition: all 0.3s ease;" onfocus="this.style.borderColor='#ed1c24'; this.style.backgroundColor='white';" onblur="this.style.borderColor='#d2d6d8'; this.style.backgroundColor='#f9fafb';">
          </div>
        </div>

        <!-- Custom Fields -->
        ${Object.entries(groupedCustomFields).map(([groupName, fields]) => `
          <div style="margin-bottom: 32px;">
            <h3 style="font-size: 18px; font-weight: 600; color: #1f2937; margin: 0 0 20px 0; padding-bottom: 8px; border-bottom: 2px solid #ed1c24;">
              ${groupName === 'kurum_bilgileri' ? 'Kurum Bilgileri' : 
                groupName === 'ozellikler' ? 'Özellikler' : 
                groupName === 'akreditasyon' ? 'Akreditasyon' : 
                groupName}
            </h3>
            ${fields.map(field => renderCustomField(field)).join('')}
          </div>
        `).join('')}
        
        <!-- Belge Dosyaları -->
        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 18px; font-weight: 600; color: #1f2937; margin: 0 0 20px 0; padding-bottom: 8px; border-bottom: 2px solid #ed1c24;">Belge Dosyaları</h3>
          <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 14px;">Belge Dosyaları (Birden fazla seçebilirsiniz) <span style="color: #ed1c24;">*</span></label>
          <div style="border: 2px dashed #d2d6d8; border-radius: 12px; padding: 24px; background: #f9fafb; transition: all 0.3s ease; text-align: center;" id="corp-dropzone">
            <input id="corp_document_files" type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" multiple style="display: none;">
            <div style="cursor: pointer; padding: 12px;" onclick="document.getElementById('corp_document_files').click()">
              <div style="font-size: 48px; margin-bottom: 12px;">📎</div>
              <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px 0;">Dosyaları seçin veya buraya sürükleyin</p>
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">PDF, JPG, PNG, DOC, DOCX formatları desteklenir</p>
            </div>
            <div id="corp-file-list" style="display: none; margin-top: 16px;">
              <div id="corp-selected-files" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px;"></div>
            </div>
          </div>
        </div>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Başvuru Gönder',
    cancelButtonText: 'İptal',
    confirmButtonColor: '#ed1c24',
    didOpen: () => {
      // Clear and setup file storage for Doctor form
      (window as any).doctorFileStorage = [];
      // Setup file input listeners
      (window as any).setupFileInputs();
      
      const popup = Swal.getPopup();
      const html = Swal.getHtmlContainer();
      const closeBtn = Swal.getCloseButton();
      const titleEl = Swal.getTitle();
      const header = Swal.getPopup()?.querySelector('.swal2-header') as HTMLElement | null;
      if (window.innerWidth < 640) {
        const titleEl = Swal.getTitle();
        if (popup) {
          popup.style.padding = '0';
          popup.style.width = '100vw';
          popup.style.maxWidth = '100vw';
          popup.style.height = '100vh';
          popup.style.maxHeight = '100vh';
          popup.style.borderRadius = '0';
          popup.style.margin = '0';
          popup.style.position = 'fixed';
          popup.style.top = '0';
          popup.style.left = '0';
          popup.style.transform = 'none';
          popup.style.display = 'flex';
          (popup.style as any).flexDirection = 'column';
        }
        if (html) {
          html.style.margin = '0';
          (html.style as any).flex = '1 1 auto';
          html.style.overflowY = 'auto';
          html.style.padding = '8px 10px 12px';
          html.style.width = '100%';
        }
        if (titleEl) (titleEl as HTMLElement).style.fontSize = '16px';
        // Reduce inputs/labels font-size
        const labels = html?.querySelectorAll('label') || [];
        labels.forEach((el: any) => (el.style.fontSize = '12px'));
        const fields = html?.querySelectorAll('input, select, textarea') || [];
        fields.forEach((el: any) => { el.style.fontSize = '13px'; el.style.padding = '10px 12px'; });
      }
      if (header) {
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.justifyContent = 'space-between';
        header.style.width = '100%';
        header.style.gap = '8px';
        header.style.flexWrap = 'nowrap';
      }
      if (titleEl) {
        const title = titleEl as HTMLElement;
        title.style.margin = '0';
        title.style.textAlign = 'left';
        title.style.display = 'flex';
        title.style.alignItems = 'center';
        title.style.gap = '8px';
        (title.style as any).flex = '1 1 auto';
        (title.style as any).minWidth = '0';
      }
      if (closeBtn) {
        const btn = closeBtn as HTMLElement;
        btn.style.position = 'static';
        btn.style.marginLeft = 'auto';
        (btn.style as any).flex = '0 0 auto';
        btn.style.alignSelf = 'center';
      }
    },
    willClose: () => {
      try {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      } catch {}
    },
    preConfirm: () => {
      const taxNumber = getElementValue('#tax_number');
      const licenseNumber = getElementValue('#license_number');
      
      // Use storage instead of input
      const filesArray = (window as any).corporateFileStorage || [];

      if (!taxNumber) {
        Swal.showValidationMessage('Lütfen vergi numarasını girin');
        return false;
      }
      if (!licenseNumber) {
        Swal.showValidationMessage('Lütfen ruhsat numarasını girin');
        return false;
      }
      if (filesArray.length === 0) {
        Swal.showValidationMessage('Lütfen en az bir belge dosyası seçin');
        return false;
      }

      console.log('preConfirm Corporate - Storage files count:', filesArray.length);
      filesArray.forEach((file: File, idx: number) => {
        console.log(`File ${idx}:`, file.name);
      });

      // Custom fields validation
      const customFieldsValidation = validateCustomFields(customFields);
      if (!customFieldsValidation.isValid) {
        Swal.showValidationMessage(customFieldsValidation.message || 'Lütfen tüm zorunlu alanları doldurun');
        return false;
      }

      // Custom fields data collection
      const customFieldsData: { [key: string]: any } = {};
      customFields.forEach(field => {
        customFieldsData[field.key] = getCustomFieldValue(field);
      });

      return {
        taxNumber,
        licenseNumber,
        documentFiles: filesArray,
        customFields: customFieldsData
      };
    }
  });

  if (formData) {
    await submitCorporateApplication(formData);
  }
};

// Doktor başvurusu gönderme
const submitDoctorApplication = async (formData: any) => {
  try {
    // Loading göster
    Swal.fire({
      title: 'Gönderiliyor...',
      text: 'Başvurunuz işleniyor, lütfen bekleyin.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // FormData oluştur
    const submitData = new FormData();
    submitData.append("user_type", "doctor");
    submitData.append("specialty_id", formData.specialty);
    submitData.append("license_number", formData.licenseNumber);
    
    // Custom fields'ları ekle
    if (formData.customFields) {
      Object.entries(formData.customFields).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // Multiselect için
          submitData.append(`custom_fields[${key}]`, JSON.stringify(value));
        } else {
          submitData.append(`custom_fields[${key}]`, String(value));
        }
      });
    }
    
    // Her dosya için ayrı document entry'si oluştur (document_type olmadan)
    console.log('Doctor - Total files:', formData.documentFiles.length);
    formData.documentFiles.forEach((file: File, index: number) => {
      console.log(`Adding document[${index}]:`, file.name);
      submitData.append(`documents[${index}]`, file);
    });

    // API çağrısı
    const response = await applyProfessionalAccount(submitData);

    if (response.status) {
      Swal.fire({
        title: 'Başarılı!',
        text: response.message || 'Doktor başvurunuz başarıyla gönderildi.',
        icon: 'success',
        confirmButtonText: 'Tamam'
      });
    }
  } catch (error: any) {
    Swal.fire({
      title: 'Hata!',
      text: error?.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.',
      icon: 'error',
      confirmButtonText: 'Tamam'
    });
  }
};

// Kurum başvurusu gönderme
const submitCorporateApplication = async (formData: any) => {
  try {
    // Loading göster
    Swal.fire({
      title: 'Gönderiliyor...',
      text: 'Başvurunuz işleniyor, lütfen bekleyin.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // FormData oluştur
    const submitData = new FormData();
    submitData.append("user_type", "corporate");
    submitData.append("tax_number", formData.taxNumber);
    submitData.append("license_number", formData.licenseNumber);
    
    // Custom fields'ları ekle
    if (formData.customFields) {
      Object.entries(formData.customFields).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // Multiselect için
          submitData.append(`custom_fields[${key}]`, JSON.stringify(value));
        } else {
          submitData.append(`custom_fields[${key}]`, String(value));
        }
      });
    }
    
    // Her dosya için ayrı document entry'si oluştur (document_type olmadan)
    formData.documentFiles.forEach((file: File, index: number) => {
      submitData.append(`documents[${index}]`, file);
    });

    // API çağrısı
    const response = await applyProfessionalAccount(submitData);

    if (response.status) {
      Swal.fire({
        title: 'Başarılı!',
        text: response.message || 'Kurum başvurunuz başarıyla gönderildi.',
        icon: 'success',
        confirmButtonText: 'Tamam'
      });
    }
  } catch (error: any) {
    Swal.fire({
      title: 'Hata!',
      text: error?.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.',
      icon: 'error',
      confirmButtonText: 'Tamam'
    });
  }
};

// Global file storage for accumulating files
if (typeof window !== 'undefined') {
  (window as any).doctorFileStorage = [];
  (window as any).corporateFileStorage = [];

  // Global setup for file inputs
  (window as any).setupFileInputs = () => {
  setTimeout(() => {
    const doctorInput = document.getElementById('document_files') as HTMLInputElement;
    const corporateInput = document.getElementById('corp_document_files') as HTMLInputElement;
    
    if (doctorInput && !doctorInput.getAttribute('data-listener-added')) {
      doctorInput.addEventListener('change', (e) => {
        const input = e.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
          // Add new files to storage
          Array.from(input.files).forEach(file => {
            (window as any).doctorFileStorage.push(file);
          });
          // Call the display handler
          (window as any).handleFileSelect(doctorInput);
        }
      });
      doctorInput.setAttribute('data-listener-added', 'true');
    }
    
    if (corporateInput && !corporateInput.getAttribute('data-listener-added')) {
      corporateInput.addEventListener('change', (e) => {
        const input = e.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
          // Add new files to storage
          Array.from(input.files).forEach(file => {
            (window as any).corporateFileStorage.push(file);
          });
          // Call the display handler
          (window as any).handleFileSelectCorp(corporateInput);
        }
      });
      corporateInput.setAttribute('data-listener-added', 'true');
    }
  }, 100);
  };
}

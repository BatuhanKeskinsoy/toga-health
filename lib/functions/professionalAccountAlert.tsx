import Swal from 'sweetalert2';
import { applyProfessionalAccount } from '@/lib/services/user/professionalAccount';

// Modern DOM utility fonksiyonları
const getElementValue = (selector: string): string => {
  const element = document.querySelector(selector) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  return element?.value || '';
};

const getFileElement = (selector: string): File | null => {
  const element = document.querySelector(selector) as HTMLInputElement;
  return element?.files?.[0] || null;
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
export const showProfessionalAccountTypeSelection = async () => {
  const result = await Swal.fire({
    title: '<div style="display: flex; align-items: center; justify-content: flex-start; gap: 8px;"><span style="font-size: 24px;">🏥</span><span>Profesyonel Hesap Başvurusu</span></div>',
    html: `
      <div style="text-align: center; xl:padding: 20px 0; padding: 6px;">
        <p style="font-size: 18px; color: #374151; margin-bottom: 30px; font-weight: 500;">
          Hangi tür profesyonel hesap için başvuru yapmak istiyorsunuz?
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
              Bireysel doktor hesabı oluşturun ve hastalarınızla randevular oluşturun.
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
              Hastane veya klinik hesabı oluşturun ve kurumsal hizmetlerinizi sunun.
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
                Profesyonel hesabınız onaylandıktan sonra randevu alma ve verme özelliklerine erişebileceksiniz.
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
  } else if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
    // Kurum başvurusu
    await showCorporateApplicationForm();
  }
  // İptal durumunda hiçbir şey yapma
};

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

  const { value: formData } = await Swal.fire({
    title: 'Doktor Başvuru Formu',
    width: 'min(96vw, 800px)',
    showCloseButton: true,
    html: `
      <div style="text-align: left; max-height: 600px; overflow-y: auto; padding: 20px 0;">
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
        
        <div style="margin-bottom: 24px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 14px;">Belge Başlığı <span style="color: #ed1c24;">*</span></label>
          <input id="document_title" type="text" placeholder="Belge başlığı" value="Lisans Belgesi" style="width: 100%; padding: 16px 20px; border: 1px solid #d2d6d8; border-radius: 8px; font-size: 16px; background: #f9fafb; transition: all 0.3s ease;" onfocus="this.style.borderColor='#ed1c24'; this.style.backgroundColor='white';" onblur="this.style.borderColor='#d2d6d8'; this.style.backgroundColor='#f9fafb';">
        </div>
        
        <div style="margin-bottom: 24px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 14px;">Belge Açıklaması</label>
          <textarea id="document_description" placeholder="Belge açıklaması" rows="3" style="width: 100%; padding: 16px 20px; border: 1px solid #d2d6d8; border-radius: 8px; font-size: 16px; background: #f9fafb; transition: all 0.3s ease; resize: vertical; font-family: inherit;" onfocus="this.style.borderColor='#ed1c24'; this.style.backgroundColor='white';" onblur="this.style.borderColor='#d2d6d8'; this.style.backgroundColor='#f9fafb';"></textarea>
        </div>
        
        <div style="margin-bottom: 24px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 14px;">Belge Dosyası <span style="color: #ed1c24;">*</span></label>
          <div style="border: 2px dashed #d2d6d8; border-radius: 12px; padding: 24px; text-align: center; background: #f9fafb; transition: all 0.3s ease;" ondrop="this.style.borderColor='#ed1c24'; this.style.backgroundColor='#fff5f5';" ondragover="this.style.borderColor='#ed1c24';" ondragleave="this.style.borderColor='#d2d6d8'; this.style.backgroundColor='#f9fafb';">
            <input id="document_file" type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" style="width: 100%; padding: 12px; border: none; background: transparent; font-size: 16px; cursor: pointer;" onchange="document.getElementById('file-info').style.display='block'; this.parentElement.style.borderColor='#ed1c24'; this.parentElement.style.backgroundColor='#fff5f5';">
            <p style="font-size: 14px; color: #6b7280; margin: 8px 0 0 0;">📄 Dosya seçin veya buraya sürükleyin</p>
            <p style="font-size: 12px; color: #9ca3af; margin: 4px 0 0 0;">PDF, JPG, PNG, DOC, DOCX formatları desteklenir</p>
            <div id="file-info" style="display: none; margin-top: 12px; padding: 8px; background: #ed1c24; color: white; border-radius: 6px; font-size: 14px;">
              ✅ Dosya seçildi
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
    willOpen: () => {
      try {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
      } catch {}
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
      const documentTitle = getElementValue('#document_title');
      const documentDescription = getElementValue('#document_description');
      const documentFile = getFileElement('#document_file');

      if (!specialty) {
        Swal.showValidationMessage('Lütfen uzmanlık alanınızı seçin');
        return false;
      }
      if (!licenseNumber) {
        Swal.showValidationMessage('Lütfen lisans numaranızı girin');
        return false;
      }
      if (!documentTitle) {
        Swal.showValidationMessage('Lütfen belge başlığını girin');
        return false;
      }
      if (!documentFile) {
        Swal.showValidationMessage('Lütfen belge dosyasını seçin');
        return false;
      }

      return {
        specialty,
        licenseNumber,
        documentTitle,
        documentDescription,
        documentFile
      };
    }
  });

  if (formData) {
    await submitDoctorApplication(formData);
  }
};

// Kurum başvuru formu
export const showCorporateApplicationForm = async () => {
  const { value: formData } = await Swal.fire({
    title: 'Kurum Başvuru Formu',
    width: 'min(96vw, 800px)',
    showCloseButton: true,
    html: `
      <div style="text-align: left; max-height: 600px; overflow-y: auto; padding: 20px 0;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 14px;">Kurum Adı <span style="color: #ed1c24;">*</span></label>
            <input id="company_name" type="text" placeholder="Kurum adını girin" style="width: 100%; padding: 16px 20px; border: 1px solid #d2d6d8; border-radius: 8px; font-size: 16px; background: #f9fafb; transition: all 0.3s ease;" onfocus="this.style.borderColor='#ed1c24'; this.style.backgroundColor='white';" onblur="this.style.borderColor='#d2d6d8'; this.style.backgroundColor='#f9fafb';">
          </div>
          
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 14px;">Vergi Numarası <span style="color: #ed1c24;">*</span></label>
            <input id="tax_number" type="text" placeholder="Vergi numarasını girin" style="width: 100%; padding: 16px 20px; border: 1px solid #d2d6d8; border-radius: 8px; font-size: 16px; background: #f9fafb; transition: all 0.3s ease;" onfocus="this.style.borderColor='#ed1c24'; this.style.backgroundColor='white';" onblur="this.style.borderColor='#d2d6d8'; this.style.backgroundColor='#f9fafb';">
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 14px;">Ruhsat Numarası <span style="color: #ed1c24;">*</span></label>
            <input id="license_number" type="text" placeholder="Ruhsat numarasını girin" style="width: 100%; padding: 16px 20px; border: 1px solid #d2d6d8; border-radius: 8px; font-size: 16px; background: #f9fafb; transition: all 0.3s ease;" onfocus="this.style.borderColor='#ed1c24'; this.style.backgroundColor='white';" onblur="this.style.borderColor='#d2d6d8'; this.style.backgroundColor='#f9fafb';">
          </div>
          
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 14px;">Telefon</label>
            <input id="phone" type="tel" placeholder="Telefon numarası" style="width: 100%; padding: 16px 20px; border: 1px solid #d2d6d8; border-radius: 8px; font-size: 16px; background: #f9fafb; transition: all 0.3s ease;" onfocus="this.style.borderColor='#ed1c24'; this.style.backgroundColor='white';" onblur="this.style.borderColor='#d2d6d8'; this.style.backgroundColor='#f9fafb';">
          </div>
        </div>
        
        <div style="margin-bottom: 24px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 14px;">Adres</label>
          <textarea id="address" placeholder="Kurum adresi" rows="2" style="width: 100%; padding: 16px 20px; border: 1px solid #d2d6d8; border-radius: 8px; font-size: 16px; background: #f9fafb; transition: all 0.3s ease; resize: vertical; font-family: inherit;" onfocus="this.style.borderColor='#ed1c24'; this.style.backgroundColor='white';" onblur="this.style.borderColor='#d2d6d8'; this.style.backgroundColor='#f9fafb';"></textarea>
        </div>
        
        <div style="margin-bottom: 24px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 14px;">E-posta</label>
          <input id="email" type="email" placeholder="Kurum e-posta adresi" style="width: 100%; padding: 16px 20px; border: 1px solid #d2d6d8; border-radius: 8px; font-size: 16px; background: #f9fafb; transition: all 0.3s ease;" onfocus="this.style.borderColor='#ed1c24'; this.style.backgroundColor='white';" onblur="this.style.borderColor='#d2d6d8'; this.style.backgroundColor='#f9fafb';">
        </div>
        
        <div style="margin-bottom: 24px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 14px;">Belge Başlığı <span style="color: #ed1c24;">*</span></label>
          <input id="document_title" type="text" placeholder="Belge başlığı" value="Ruhsat Belgesi" style="width: 100%; padding: 16px 20px; border: 1px solid #d2d6d8; border-radius: 8px; font-size: 16px; background: #f9fafb; transition: all 0.3s ease;" onfocus="this.style.borderColor='#ed1c24'; this.style.backgroundColor='white';" onblur="this.style.borderColor='#d2d6d8'; this.style.backgroundColor='#f9fafb';">
        </div>
        
        <div style="margin-bottom: 24px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 14px;">Belge Açıklaması</label>
          <textarea id="document_description" placeholder="Belge açıklaması" rows="3" style="width: 100%; padding: 16px 20px; border: 1px solid #d2d6d8; border-radius: 8px; font-size: 16px; background: #f9fafb; transition: all 0.3s ease; resize: vertical; font-family: inherit;" onfocus="this.style.borderColor='#ed1c24'; this.style.backgroundColor='white';" onblur="this.style.borderColor='#d2d6d8'; this.style.backgroundColor='#f9fafb';"></textarea>
        </div>
        
        <div style="margin-bottom: 24px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 14px;">Belge Dosyası <span style="color: #ed1c24;">*</span></label>
          <div style="border: 2px dashed #d2d6d8; border-radius: 12px; padding: 24px; text-align: center; background: #f9fafb; transition: all 0.3s ease;" ondrop="this.style.borderColor='#ed1c24'; this.style.backgroundColor='#fff5f5';" ondragover="this.style.borderColor='#ed1c24';" ondragleave="this.style.borderColor='#d2d6d8'; this.style.backgroundColor='#f9fafb';">
            <input id="document_file" type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" style="width: 100%; padding: 12px; border: none; background: transparent; font-size: 16px; cursor: pointer;" onchange="document.getElementById('corp-file-info').style.display='block'; this.parentElement.style.borderColor='#ed1c24'; this.parentElement.style.backgroundColor='#fff5f5';">
            <p style="font-size: 14px; color: #6b7280; margin: 8px 0 0 0;">📄 Dosya seçin veya buraya sürükleyin</p>
            <p style="font-size: 12px; color: #9ca3af; margin: 4px 0 0 0;">PDF, JPG, PNG, DOC, DOCX formatları desteklenir</p>
            <div id="corp-file-info" style="display: none; margin-top: 12px; padding: 8px; background: #ed1c24; color: white; border-radius: 6px; font-size: 14px;">
              ✅ Dosya seçildi
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
    willOpen: () => {
      try {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
      } catch {}
    },
    willClose: () => {
      try {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      } catch {}
    },
    preConfirm: () => {
      const companyName = getElementValue('#company_name');
      const taxNumber = getElementValue('#tax_number');
      const licenseNumber = getElementValue('#license_number');
      const phone = getElementValue('#phone');
      const address = getElementValue('#address');
      const email = getElementValue('#email');
      const documentTitle = getElementValue('#document_title');
      const documentDescription = getElementValue('#document_description');
      const documentFile = getFileElement('#document_file');

      if (!companyName) {
        Swal.showValidationMessage('Lütfen kurum adını girin');
        return false;
      }
      if (!taxNumber) {
        Swal.showValidationMessage('Lütfen vergi numarasını girin');
        return false;
      }
      if (!licenseNumber) {
        Swal.showValidationMessage('Lütfen ruhsat numarasını girin');
        return false;
      }
      if (!documentTitle) {
        Swal.showValidationMessage('Lütfen belge başlığını girin');
        return false;
      }
      if (!documentFile) {
        Swal.showValidationMessage('Lütfen belge dosyasını seçin');
        return false;
      }

      return {
        companyName,
        taxNumber,
        licenseNumber,
        phone,
        address,
        email,
        documentTitle,
        documentDescription,
        documentFile
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
    submitData.append("documents[0][document_type]", "license");
    submitData.append("documents[0][title]", formData.documentTitle);
    submitData.append("documents[0][description]", formData.documentDescription);
    submitData.append("documents[0][document]", formData.documentFile);

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
    submitData.append("company_name", formData.companyName);
    submitData.append("tax_number", formData.taxNumber);
    submitData.append("license_number", formData.licenseNumber);
    submitData.append("address", formData.address || "");
    submitData.append("phone", formData.phone || "");
    submitData.append("email", formData.email || "");
    submitData.append("documents[0][document_type]", "license");
    submitData.append("documents[0][title]", formData.documentTitle);
    submitData.append("documents[0][description]", formData.documentDescription);
    submitData.append("documents[0][document]", formData.documentFile);

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

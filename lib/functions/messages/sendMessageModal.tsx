"use client"
import Swal, { SweetAlertResult } from "sweetalert2";
import { useTranslations } from "next-intl";

interface SendMessageModalResult {
  isConfirmed: boolean;
  isDismissed: boolean;
  value?: {
    title: string;
    content: string;
    action: "send" | "send_and_goto";
  };
}

interface SendMessageModalProps {
  receiverName: string;
  receiverPhoto?: string;
}

// Helper function: Avatar HTML oluştur
const createAvatarHtml = (name: string, photo?: string): string => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (photo) {
    return `
      <img 
        src="${photo}" 
        alt="${name}"
        class="w-12 h-12 rounded-full object-cover"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
      />
      <div style="display:none;" class="w-12 h-12 rounded-full bg-gradient-to-br from-sitePrimary to-blue-500 flex items-center justify-center text-white font-semibold text-lg border-2 border-sitePrimary shadow-sm">
        ${initials}
      </div>
    `;
  }

  return `
    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-sitePrimary to-blue-500 flex items-center justify-center text-white font-semibold text-lg border-2 border-sitePrimary shadow-sm">
      ${initials}
    </div>
  `;
};

// Helper function: Input değerlerini al ve validate et
const getInputValues = () => {
  const titleInput = document.getElementById("message-title") as HTMLInputElement;
  const contentTextarea = document.getElementById("message-content") as HTMLTextAreaElement;

  return {
    title: titleInput?.value?.trim() || "",
    content: contentTextarea?.value?.trim() || "",
    titleInput,
    contentTextarea,
  };
};

// Helper function: Validation yap
const validateInputs = (
  title: string,
  content: string,
  titleInput?: HTMLInputElement,
  contentTextarea?: HTMLTextAreaElement
): string | null => {
  const t = useTranslations();
  if (!title) {
    titleInput?.focus();
    return `<div class="flex items-center gap-2 text-red-600"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg> ${t("Lütfen mesaj başlığı girin")}</div>`;
  }

  if (title.length < 3) {
    titleInput?.focus();
    return `<div class="flex items-center gap-2 text-red-600"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg> ${t("Mesaj başlığı en az 3 karakter olmalıdır")}</div>`;
  }

  if (!content) {
    contentTextarea?.focus();
    return `<div class="flex items-center gap-2 text-red-600"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg> ${t("Lütfen mesajınızı yazın")}</div>`;
  }

  if (content.length < 10) {
    contentTextarea?.focus();
    return `<div class="flex items-center gap-2 text-red-600"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg> ${t("Mesajınız en az 10 karakter olmalıdır")}</div>`;
  }

  return null;
};

export async function sendMessageModal({
  receiverName,
  receiverPhoto,
}: SendMessageModalProps): Promise<SendMessageModalResult> {
  const t = useTranslations();
  const result: SweetAlertResult = await Swal.fire({
    html: `
      <div class="flex flex-col gap-6 w-full">
        <!-- Header with photo -->
        <div class="flex items-center gap-3 pb-4 border-b border-gray-100">
          ${createAvatarHtml(receiverName, receiverPhoto)}
          <div class="text-left flex-1">
            <h3 class="text-xl font-semibold text-gray-900">${t("Mesaj Gönder")}</h3>
            <p class="text-sm text-gray-500 mt-0.5">${receiverName}</p>
          </div>
        </div>
        
        <!-- Form Inputs -->
        <div class="flex flex-col gap-5 w-full">
          <div class="flex flex-col gap-2">
            <label for="message-title" class="text-left text-sm font-semibold text-gray-700">
              ${t("Mesaj Başlığı")}
            </label>
            <input
              id="message-title"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-sitePrimary focus:border-transparent transition-all outline-none text-gray-900 placeholder-gray-400"
              placeholder="${t("Örn: Randevu Hakkında")}"
              maxlength="100"
              autocomplete="off"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="message-content" class="text-left text-sm font-semibold text-gray-700">
              ${t("Mesajınız")}
            </label>
            <textarea
              id="message-content"
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-sitePrimary focus:border-transparent transition-all outline-none text-gray-900 placeholder-gray-400 resize-none"
              placeholder="${t("Lütfen mesajınızı yazın")}"
              rows="6"
              maxlength="1000"
            ></textarea>
            <div class="flex justify-between items-center text-xs text-gray-500">
              <span>${t("Maksimum 1000 karakter")}</span>
              <span id="char-count">0 / 1000</span>
            </div>
          </div>
        </div>
      </div>
    `,
    width: window.innerWidth < 768 ? "100%" : "600px",
    padding: "0",
    heightAuto: window.innerWidth < 768 ? false : true,
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: `<span class="flex items-center gap-2"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg> ${t("Gönder ve Mesaja Git")}</span>`,
    denyButtonText: `<span class="flex items-center gap-2"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg> ${t("Mesajı Gönder")}</span>`,
    cancelButtonText: `<span class="flex items-center gap-2"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg> ${t("İptal")}</span>`,
    confirmButtonColor: "#0284c7",
    denyButtonColor: "#22c55e",
    cancelButtonColor: "#ef4444",
    customClass: {
      container: window.innerWidth < 768 
        ? "!p-0 !m-0" 
        : "!p-4",
      popup: window.innerWidth < 768
        ? "!rounded-none !m-0 !w-screen !max-w-none !h-screen !max-h-screen !flex !flex-col !shadow-none"
        : "!rounded-2xl !shadow-2xl !max-w-[600px] !w-full",
      htmlContainer: window.innerWidth < 768
        ? "!m-0 !p-6 !flex-1 !overflow-auto"
        : "!m-0 !p-6",
      actions: window.innerWidth < 768
        ? "!w-full !m-0 !p-4 !gap-2 !flex !flex-col !border-t !border-gray-200 !bg-gray-50"
        : "!w-full !m-0 !p-6 !pt-4 !gap-2 !flex !flex-row !justify-end !border-t !border-gray-100",
      confirmButton: window.innerWidth < 768
        ? "!m-0 !w-full !px-6 !py-3.5 !text-base !font-semibold !rounded-md !shadow-sm hover:!shadow-md !transition-all !flex !items-center !justify-center !order-1"
        : "!m-0 !px-6 !py-3 !text-sm !font-semibold !rounded-md !shadow-sm hover:!shadow-md !transition-all !flex !items-center !justify-center",
      denyButton: window.innerWidth < 768
        ? "!m-0 !w-full !px-6 !py-3.5 !text-base !font-semibold !rounded-md !shadow-sm hover:!shadow-md !transition-all !flex !items-center !justify-center !order-2"
        : "!m-0 !px-6 !py-3 !text-sm !font-semibold !rounded-md !shadow-sm hover:!shadow-md !transition-all !flex !items-center !justify-center",
      cancelButton: window.innerWidth < 768
        ? "!m-0 !w-full !px-6 !py-3.5 !text-base !font-semibold !rounded-md !shadow-sm hover:!shadow-md !transition-all !flex !items-center !justify-center !order-3"
        : "!m-0 !px-6 !py-3 !text-sm !font-semibold !rounded-md !shadow-sm hover:!shadow-md !transition-all !flex !items-center !justify-center",
    },
    backdrop: true,
    allowOutsideClick: true,
    allowEscapeKey: true,
    focusConfirm: false,
    didOpen: () => {
      // Body scroll'u kapat
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      
      // Scrollbar genişliğini hesapla
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      
      // Modal kapandığında restore et
      (window as any).__swalOriginalOverflow = originalOverflow;
      (window as any).__swalOriginalPaddingRight = originalPaddingRight;

      const titleInput = document.getElementById(
        "message-title"
      ) as HTMLInputElement;
      const contentTextarea = document.getElementById(
        "message-content"
      ) as HTMLTextAreaElement;
      const charCount = document.getElementById("char-count");

      // Karakter sayacı
      if (contentTextarea && charCount) {
        const updateCharCount = () => {
          const count = contentTextarea.value.length;
          charCount.textContent = `${count} / ${t("Maksimum 1000 karakter")}`;
          
          // Renk değişimi
          if (count > 900) {
            charCount.classList.add("!text-red-500", "!font-semibold");
          } else if (count > 700) {
            charCount.classList.remove("!text-red-500");
            charCount.classList.add("!text-orange-500", "!font-semibold");
          } else {
            charCount.classList.remove("!text-red-500", "!text-orange-500", "!font-semibold");
          }
        };

        contentTextarea.addEventListener("input", updateCharCount);
        contentTextarea.addEventListener("keyup", updateCharCount);
      }

      // İlk input'a focus
      if (titleInput) {
        titleInput.focus();
      }
    },
    didClose: () => {
      // Body scroll'u geri aç
      const originalOverflow = (window as any).__swalOriginalOverflow;
      const originalPaddingRight = (window as any).__swalOriginalPaddingRight;
      
      document.body.style.overflow = originalOverflow || "";
      document.body.style.paddingRight = originalPaddingRight || "";
      
      // Cleanup
      delete (window as any).__swalOriginalOverflow;
      delete (window as any).__swalOriginalPaddingRight;
    },
    preConfirm: () => {
      const { title, content, titleInput, contentTextarea } = getInputValues();
      const error = validateInputs(title, content, titleInput, contentTextarea);

      if (error) {
        Swal.showValidationMessage(error);
        return false;
      }

      return {
        title,
        content,
        action: "send_and_goto" as const,
      };
    },
    preDeny: () => {
      const { title, content, titleInput, contentTextarea } = getInputValues();
      const error = validateInputs(title, content, titleInput, contentTextarea);

      if (error) {
        Swal.showValidationMessage(error);
        return false;
      }

      return {
        title,
        content,
        action: "send" as const,
      };
    },
  });

  return {
    isConfirmed: result.isConfirmed || result.isDenied || false,
    isDismissed: result.isDismissed || false,
    value: result.value || (result.isDenied ? result.value : undefined),
  };
}


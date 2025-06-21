import funcSweetAlert from "@/lib/functions/funcSweetAlert";

interface ShowModalOptions {
  html: string;
  onClose?: () => void;
  confirmButtonText?: string;
}

export function showNotificationDetailsModal({
  html,
  onClose,
  confirmButtonText = "Tamam",
}: ShowModalOptions): void {
  try {
    funcSweetAlert({
      html,
      icon: null,
      confirmButtonText,
      didClose: onClose,
    });
  } catch (error) {
    console.error("Modal gösterilirken hata oluştu:", error);
    // Fallback: Basit alert göster
    if (onClose) {
      alert(html);
      onClose();
    } else {
      alert(html);
    }
  }
}

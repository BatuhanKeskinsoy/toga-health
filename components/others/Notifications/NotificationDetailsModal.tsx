import funcSweetAlert from "@/lib/functions/funcSweetAlert";
import { useTranslations } from "next-intl";

interface ShowModalOptions {
  html: string;
  onClose?: () => void;
}

export function showNotificationDetailsModal({
  html,
  onClose,
}: ShowModalOptions) {
  const t = useTranslations();
  funcSweetAlert({
    html,
    icon: null,
    confirmButtonText: t("Tamam"),
    didClose: onClose,
  });
}

import Swal, {
  SweetAlertIcon,
  SweetAlertOptions,
  SweetAlertResult,
} from "sweetalert2";
import { useTranslations } from "next-intl";

type FuncSweetAlertProps = SweetAlertOptions & {
  title?: string;
  text?: string;
  icon?: SweetAlertIcon;
  confirmButtonText?: string;
};

const funcSweetAlert = ({
  title = "",
  text = "",
  icon = "success",
  confirmButtonText,
  ...rest
}: FuncSweetAlertProps): Promise<SweetAlertResult<any>> => {
  const t = useTranslations();
    return Swal.fire({
    title,
    text,
    icon,
    confirmButtonText: confirmButtonText || t("Tamam"),
    ...rest,
  });
};

export default funcSweetAlert;

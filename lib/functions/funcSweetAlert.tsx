import Swal, {
  SweetAlertIcon,
  SweetAlertOptions,
  SweetAlertResult,
} from "sweetalert2";

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
    return Swal.fire({
    title,
    text,
    icon,
    confirmButtonText: confirmButtonText || "Tamam",
    ...rest,
  });
};

export default funcSweetAlert;

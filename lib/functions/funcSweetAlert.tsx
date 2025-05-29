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
  confirmButtonText = "Tamam",
  ...rest
}: FuncSweetAlertProps): Promise<SweetAlertResult<any>> => {
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonText,
    ...rest,
  });
};

export default funcSweetAlert;

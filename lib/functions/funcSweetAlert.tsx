import Swal, { SweetAlertIcon, SweetAlertOptions } from "sweetalert2";


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
}: FuncSweetAlertProps): void => {
  Swal.fire({
    title,
    text,
    icon,
    confirmButtonText,
    ...rest,
  });
};

export default funcSweetAlert;

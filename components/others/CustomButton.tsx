import { CustomButtonProps } from "@/public/types/others/buttonTypes";
import Image from "next/image";

const CustomButton = ({
  id,
  title,
  containerStyles,
  handleClick,
  btnType,
  textStyles,
  rightIcon,
  leftIcon,
  iconStyles,
  iconAlt,
  isDisabled,
  onMouseEnter,
  onMouseLeave,
  iconWidth,
  iconHeight,
}: CustomButtonProps) => {
  return (
    <button
      id={id || title}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      type={btnType}
      disabled={isDisabled}
      onClick={handleClick}
      className={`cursor-pointer transition-all duration-300 ${containerStyles}`}
      aria-label={title || "button"}
      title={title}
    >
      {leftIcon &&
        (typeof leftIcon === "string" ? (
          <Image
            width={iconWidth ? iconWidth : "24"}
            height={iconHeight ? iconHeight : "24"}
            className={`${
              iconWidth
                ? `!min-w-[${iconWidth}] w-[${iconWidth}]`
                : "!min-w-[24px] w-[24px]"
            } ${iconStyles}`}
            src={`${leftIcon}`}
            alt={`${iconAlt}`}
          />
        ) : (
          leftIcon
        ))}
      <span className={textStyles ? textStyles : ""}>{title}</span>
      {rightIcon &&
        (typeof rightIcon === "string" ? (
          <Image
            width={iconWidth ? iconWidth : "24"}
            height={iconHeight ? iconHeight : "24"}
            className={`${
              iconWidth
                ? `!min-w-[${iconWidth}] w-[${iconWidth}]`
                : "!min-w-[24px] w-[24px]"
            } ${iconStyles}`}
            src={`${rightIcon}`}
            alt={`${iconAlt}`}
          />
        ) : (
          rightIcon
        ))}
    </button>
  );
};

export default CustomButton;

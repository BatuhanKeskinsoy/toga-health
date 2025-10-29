"use client";
import { CustomButtonProps } from "@/lib/types/others/buttonTypes";
import Image from "next/image";
import React, { useCallback } from "react";

const CustomButton = React.memo(({
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
  const handleClickCallback = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (handleClick && !isDisabled) {
      handleClick(e);
    }
  }, [handleClick, isDisabled]);

  const renderIcon = useCallback((icon: string | React.ReactNode, position: 'left' | 'right') => {
    if (!icon) return null;
    
    if (typeof icon === "string") {
      return (
        <Image
          width={iconWidth ? iconWidth : "24"}
          height={iconHeight ? iconHeight : "24"}
          className={`${
            iconWidth
              ? `!min-w-[${iconWidth}] w-[${iconWidth}]`
              : "!min-w-[24px] w-[24px]"
          } ${iconStyles}`}
          src={icon}
          alt={iconAlt || `${position} icon`}
        />
      );
    }
    
    return icon;
  }, [iconWidth, iconHeight, iconStyles, iconAlt]);

  return (
    <button
      id={id || title}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      type={btnType}
      disabled={isDisabled}
      onClick={handleClickCallback}
      className={`cursor-pointer transition-all duration-300 ${containerStyles}`}
      aria-label={title || "button"}
      title={title}
    >
      {renderIcon(leftIcon, 'left')}
      <span className={textStyles ? textStyles : ""}>{title}</span>
      {renderIcon(rightIcon, 'right')}
    </button>
  );
});

CustomButton.displayName = 'CustomButton';

export default CustomButton;

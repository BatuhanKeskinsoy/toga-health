import {MouseEventHandler} from 'react'

export type CustomButtonProps = {
    id?: string;
    title?: string;
    containerStyles?: string;
    handleClick?: MouseEventHandler<HTMLButtonElement>;
    btnType?: 'button' | 'submit';
    textStyles?: string;
    rightIcon?: string | React.ReactNode;
    leftIcon?: string | React.ReactNode;
    iconAlt?: string;
    isDisabled?: boolean;
    onMouseEnter?: MouseEventHandler<HTMLButtonElement>;
    onMouseLeave?: MouseEventHandler<HTMLButtonElement>;
    iconWidth?: number;
    iconHeight?: number;
    iconStyles?: string;
}
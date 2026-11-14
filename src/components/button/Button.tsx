import {
  colorOptions,
  fillOptions,
  sizeOptions,
} from "../../providers/theme/types";
import { variantClasses } from "../../providers/theme/variants";
import classNames from "classnames";
import {
  type ButtonHTMLAttributes,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
} from "react";

import "./Button.scss";

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: sizeOptions;
  disabled?: boolean;
  fill?: fillOptions;
  icon?: ReactNode;
  iconSide?: "start" | "end";
  fullWidth?: boolean;
  /** @default colorOptions.primary */
  colorMode?: colorOptions;
}

export const Button = forwardRef(
  (
    {
      size = sizeOptions.medium,
      disabled,
      colorMode = colorOptions.primary,
      fill = fillOptions.fill,
      fullWidth,
      icon,
      iconSide,
      children,
      className,
      ...others
    }: IButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    return (
      <button
        className={classNames(
          className,
          "button",
          disabled && "disabled",
          fullWidth && "button--full-width",
          variantClasses({ colorMode, fill, size }),
          Boolean(icon) &&
            `button-with-icon ${
              iconSide === "start"
                ? "button-with-icon-at-start"
                : "button-with-icon-at-end"
            }`,
        )}
        ref={ref}
        disabled={disabled}
        {...others}
      >
        {icon}
        {children}
      </button>
    );
  },
);

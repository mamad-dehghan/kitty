import { type ButtonHTMLAttributes } from "react";
import classNames from "classnames";
import { type Icon, type IconWeight } from "@phosphor-icons/react";
import { variantClasses } from "../../providers/Theme/variants";
import {
  type ColorMode,
  type Fill,
  type Size,
} from "../../providers/Theme/variants";
import "./IconButton.scss";

export interface IIconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: Size;
  disabled?: boolean;
  colorMode?: ColorMode;
  fill?: Fill;
  Icon: Icon;
  enable?: boolean;
  weight?: IconWeight;
  dataFocused?: boolean;
}

export const IconButton = ({
  fill,
  Icon,
  colorMode,
  disabled,
  size,
  dataFocused,
  enable,
  className,
  weight,
  ...others
}: IIconButtonProps) => {
  const classname = classNames(
    "icon-button",
    disabled && "disabled",
    enable && "element--enabled",
    variantClasses({ colorMode, fill, size }),
    dataFocused && "element--focused",
    className,
  );

  return (
    <button className={classname} disabled={disabled} {...others}>
      <Icon weight={weight ?? (enable ? "fill" : "regular")} />
    </button>
  );
};

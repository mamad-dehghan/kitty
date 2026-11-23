import { type Icon, type IconWeight } from "@phosphor-icons/react";
import classNames from "classnames";
import {
  type ButtonHTMLAttributes,
  type ForwardedRef,
  forwardRef,
} from "react";
import { colorOptions, sizeOptions } from "../../providers/Theme/types";
import {
  type ColorMode,
  type Size,
  variantClasses,
} from "../../providers/Theme/variants";
import "./FAB.scss";

export interface IFABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  Icon: Icon;
  /** Visible label. When present, the FAB becomes an extended FAB. */
  label?: string;
  /** @default colorOptions.primary */
  colorMode?: ColorMode;
  /** Size of icon-only FABs. Extended FABs are always 56px. @default sizeOptions.medium */
  size?: Size;
  weight?: IconWeight;
  /** Slides the FAB out of view and removes it from the tab order. */
  hidden?: boolean;
  /** Collapses an extended FAB back into a regular FAB. */
  condensed?: boolean;
}

export const FAB = forwardRef(
  (
    {
      Icon,
      label,
      colorMode = colorOptions.primary,
      size = sizeOptions.medium,
      weight,
      hidden = false,
      condensed = false,
      className,
      disabled,
      ...others
    }: IFABProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    const extended = Boolean(label);
    const isCondensed = extended && condensed;

    return (
      <button
        ref={ref}
        className={classNames(
          "fab",
          disabled && "disabled",
          extended && "fab--extended",
          isCondensed && "fab--condensed",
          hidden && "fab--hidden",
          variantClasses({ colorMode, size }),
          className,
        )}
        disabled={disabled}
        inert={hidden || undefined}
        {...others}
      >
        <span className="fab-icon" aria-hidden="true">
          <Icon weight={weight ?? "regular"} />
        </span>
        {extended ? <span className="fab-label">{label}</span> : null}
      </button>
    );
  },
);

FAB.displayName = "FAB";

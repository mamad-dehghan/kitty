import { type InputHTMLAttributes, type ReactNode } from "react";
import classNames from "classnames";
import { colorOptions, fillOptions } from "../../providers/Theme/types";
import { colorClass, fillClass } from "../../providers/Theme/variants";

export interface ISearchInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  disabled?: boolean;
  /** @default colorOptions.primary */
  colorMode?: colorOptions;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  /** @default fillOptions.outline */
  fill?: fillOptions.outline;
}

export const SearchInput = ({
  iconEnd,
  fill = fillOptions.outline,
  iconStart,
  disabled,
  colorMode = colorOptions.primary,
  ...others
}: ISearchInputProps) => {
  return (
    <div
      className={classNames("search-input--wrapper", {
        "search-input--wrapper--with-start-icon": iconStart,
        "search-input--wrapper--with-end-icon": iconEnd,
      })}
    >
      {iconStart}
      <input
        className={classNames(
          "search-input",
          colorClass(colorMode),
          fillClass(fill),
          disabled && "search-input--disabled",
          Boolean(iconStart) && "search-input--with-start-icon",
          Boolean(iconEnd) && "search-input--with-end-icon",
        )}
        type="search"
        {...others}
      />
      {iconEnd}
    </div>
  );
};

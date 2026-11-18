import { Check, type Icon } from "@phosphor-icons/react";
import classNames from "classnames";
import { type ButtonHTMLAttributes } from "react";
import { fillOptions } from "../../providers/Theme/types";
import { fillClass } from "../../providers/Theme/variants";
import "./Chip.scss";

type filterChip = ButtonHTMLAttributes<HTMLButtonElement> & {
  filter?: true;
  enable: boolean;
  fill: fillOptions.outline | fillOptions.elevated;
  Icon?: Icon;
};

export const FilterChip = ({
  filter,
  enable,
  children,
  className,
  fill,
  Icon = Check,
  ...others
}: filterChip) => {
  return (
    <button
      className={classNames(
        "chip",
        "filter-chip",
        "start-icon",
        others.disabled && "disabled",
        enable && "element--enabled with-icon",
        fillClass(fill),
        className,
      )}
      {...others}
    >
      <>
        {enable ? <Icon weight="bold" /> : undefined}
        {children}
      </>
    </button>
  );
};

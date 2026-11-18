import { type Icon } from "@phosphor-icons/react";
import classNames from "classnames";
import { type ButtonHTMLAttributes } from "react";
import { fillOptions } from "../../providers/Theme/types";
import { fillClass } from "../../providers/Theme/variants";
import "./Chip.scss";

type assistChip = ButtonHTMLAttributes<HTMLButtonElement> & {
  assist: true;
  Icon?: Icon;
  iconSide?: "start" | "end";
  fill: fillOptions.outline | fillOptions.elevated;
};

export const AssistChip = ({
  assist,
  Icon,
  iconSide = "start",
  children,
  className,
  fill,
  ...others
}: assistChip) => {
  return (
    <button
      className={classNames(
        "chip",
        "assist-chip",
        others.disabled && "disabled",
        Icon && "with-icon",
        iconSide === "start" ? "start-icon" : "end-icon",
        fillClass(fill),
        className,
      )}
      {...others}
    >
      <>
        {Icon ? <Icon weight="fill" /> : undefined}
        {children}
      </>
    </button>
  );
};

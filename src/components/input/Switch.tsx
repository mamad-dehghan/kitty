import { CheckIcon, XIcon } from "@phosphor-icons/react";
import { type InputHTMLAttributes } from "react";

import classNames from "classnames";
import { colorOptions } from "../../providers/theme/types";
import { colorClass } from "../../providers/theme/variants";
import "./Switch.scss";

export interface ISwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Color role when checked. @default colorOptions.primary */
  checkedColorMode?: colorOptions;
  /** Color role when unchecked. @default colorOptions.surface */
  uncheckedColorMode?: colorOptions;
  hasCheckedIcon?: boolean;
  hasUncheckedIcon?: boolean;
}
// TODO: always has icon but not show, color
export const Switch = ({
  checkedColorMode = colorOptions.primary,
  uncheckedColorMode = colorOptions.surface,
  hasCheckedIcon = true,
  hasUncheckedIcon = false,
  className,
  ...others
}: ISwitchProps) => {
  return (
    <button
      tabIndex={-1}
      className={classNames(
        "switch",
        others.checked && "checked",
        others.disabled && "disabled",
        colorClass(
          others.checked ? checkedColorMode : uncheckedColorMode,
        ),
        className,
      )}
      disabled={others.disabled}
    >
      <input {...others} type="checkbox" className="hidden-checkbox" />
      <div className="switch--thumb--wrapper">
        <div
          className={classNames({
            "switch--thumb": true,
            "checked-icon": hasCheckedIcon,
            "unchecked-icon": hasUncheckedIcon,
            checked: others.checked,
          })}
        >
          {others.checked ? (
            <CheckIcon weight={"regular"} />
          ) : (
            <XIcon weight={"regular"} />
          )}
        </div>
      </div>
    </button>
  );
};

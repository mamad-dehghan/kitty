import { CheckIcon, XIcon } from "@phosphor-icons/react";
import { type InputHTMLAttributes, useState } from "react";

import classNames from "classnames";
import { colorOptions } from "../../providers/Theme/types";
import { colorClass } from "../../providers/Theme/variants";
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
  checked,
  defaultChecked,
  onChange,
  checkedColorMode = colorOptions.primary,
  uncheckedColorMode = colorOptions.surface,
  hasCheckedIcon = true,
  hasUncheckedIcon = false,
  className,
  ...others
}: ISwitchProps) => {
  const [internalChecked, setInternalChecked] = useState(
    defaultChecked ?? false,
  );
  const isChecked = checked ?? internalChecked;

  return (
    <button
      tabIndex={-1}
      className={classNames(
        "switch",
        isChecked && "checked",
        others.disabled && "disabled",
        colorClass(isChecked ? checkedColorMode : uncheckedColorMode),
        className,
      )}
      disabled={others.disabled}
    >
      <input
        {...others}
        type="checkbox"
        className="hidden-checkbox"
        checked={isChecked}
        onChange={(event) => {
          if (checked === undefined) setInternalChecked(event.currentTarget.checked);
          onChange?.(event);
        }}
      />
      <div className="switch--thumb--wrapper">
        <div
          className={classNames({
            "switch--thumb": true,
            "checked-icon": hasCheckedIcon,
            "unchecked-icon": hasUncheckedIcon,
            checked: isChecked,
          })}
        >
          {isChecked ? (
            <CheckIcon weight={"regular"} />
          ) : (
            <XIcon weight={"regular"} />
          )}
        </div>
      </div>
    </button>
  );
};

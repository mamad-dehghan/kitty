import classNames from "classnames";
import { type ComponentPropsWithRef } from "react";
import { CircleIcon, RadioButtonIcon } from "@phosphor-icons/react";
import { colorOptions } from "../../providers/theme/types";
import "./RadioButton.scss";

export interface IRadioButtonProps
  extends Omit<ComponentPropsWithRef<"input">, "type"> {
  mode: colorOptions;
}

export const RadioButton = ({
  mode,
  disabled,
  className,
  onChange,
  readOnly,
  ref,
  ...others
}: IRadioButtonProps) => {
  const isControlled = others.checked !== undefined;

  return (
    <label
      className={classNames(
        "radio-button",
        disabled && "disabled",
        mode === colorOptions.primary && "element--primary",
        mode === colorOptions.secondary && "element--secondary",
        mode === colorOptions.tertiary && "element--tertiary",
        mode === colorOptions.error && "element--error",
        mode === colorOptions.warning && "element--warning",
        mode === colorOptions.success && "element--success",
        className,
      )}
    >
      <input
        {...others}
        ref={ref}
        type="radio"
        className="radio-button--input"
        disabled={disabled}
        readOnly={readOnly ?? (isControlled && !onChange)}
        onChange={onChange}
      />

      {/* Decorative icons; the native input above exposes the state to assistive tech. */}
      <span
        className="radio-button--icon radio-button--icon--unchecked"
        aria-hidden="true"
      >
        <CircleIcon weight="regular" />
      </span>
      <span
        className="radio-button--icon radio-button--icon--checked"
        aria-hidden="true"
      >
        <RadioButtonIcon weight="fill" />
      </span>
    </label>
  );
};

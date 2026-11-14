import classNames from "classnames";
import { type InputHTMLAttributes, type ReactNode, forwardRef } from "react";
import { colorOptions, fillOptions } from "../../providers/theme/types";
import { fillClass, variantClasses } from "../../providers/theme/variants";
import "./Input.scss";

export interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  supportText?: string;
  hasError?: boolean;
  iconEnd?: ReactNode;
  iconStart?: ReactNode;
  /** Color role. @default colorOptions.primary */
  colorMode?: colorOptions;
  fullWidth?: boolean;
  disabled?: boolean;
  fill?: fillOptions.fill | fillOptions.outline | fillOptions.elevated;
  label?: string;
}

//TODO: add elevated
export const Input = forwardRef<HTMLInputElement, IInputProps>(
  (
    {
      // disabled,
      supportText,
      colorMode = colorOptions.primary,
      hasError = false,
      label,
      iconStart,
      iconEnd,
      fullWidth,
      className,
      fill = fillOptions.fill,
      placeholder = "",
      ...others
    },
    ref,
  ) => {
    // <div
    //     className={classNames(
    //         'input--wrapper',
    //         fill === fillOptions.shadow && 'input--wrapper--shadow',
    //         fill === fillOptions.outline && 'input--wrapper--outline',
    //         colorMode === colorOptions.primary && 'element--primary',
    //         colorMode === colorOptions.danger && 'element--danger',
    //         colorMode === colorOptions.warning && 'element--warning',
    //         colorMode === colorOptions.success && 'element--success'
    //     )}
    // >

    return (
      <div
        className={classNames(
          "input--outer-wrapper",
          variantClasses({ colorMode, fill }),
          fullWidth && "full-width",
          others.disabled && "disabled",
          className,
        )}
        data-has-error={hasError ? "true" : "false"}
      >
        <span className="helper-text">{supportText}</span>
        <div
          className={classNames(
            "input--inner-wrapper",
            variantClasses({ colorMode, fill }),
            fullWidth && "full-width",
            others.disabled && "disabled",
          )}
          // data-support-text={supportText}
        >
          {iconStart ? (
            <span className="input-icon start-icon">{iconStart}</span>
          ) : undefined}
          <input
            ref={ref}
            className={classNames(
              "input",
              fillClass(fill),
              fullWidth && "full-width",
              Boolean(iconStart || iconEnd) && "with-icon",
              Boolean(iconStart) && "input--with-start-icon",
              Boolean(iconEnd) && "input--with-end-icon",
            )}
            placeholder={placeholder}
            {...others}
          />
          {iconEnd ? (
            <span className="input-icon end-icon">{iconEnd}</span>
          ) : undefined}
          {label ? (
            <label htmlFor={others.id} className="input--label">
              {label}
            </label>
          ) : undefined}
        </div>
      </div>
    );
  },
);

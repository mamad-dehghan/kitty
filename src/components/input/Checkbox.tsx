import classNames from "classnames";
import {
  type ComponentPropsWithRef,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  CheckSquareIcon,
  SquareIcon,
  SquareLogoIcon,
} from "@phosphor-icons/react";
import { colorOptions } from "../../providers/theme/types";
import { colorClass } from "../../providers/theme/variants";
import "./Checkbox.scss";

export interface ICheckBoxProps
  extends Omit<ComponentPropsWithRef<"input">, "type"> {
  /** @default colorOptions.primary */
  colorMode?: colorOptions;
  /** Renders the mixed state (the native `indeterminate` DOM property). */
  indeterminate?: boolean;
}

export const Checkbox = ({
  colorMode = colorOptions.primary,
  indeterminate,
  disabled,
  className,
  onChange,
  readOnly,
  "aria-checked": ariaChecked,
  ref,
  ...others
}: ICheckBoxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const isIndeterminate = Boolean(indeterminate);
  const isControlled = others.checked !== undefined;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;

      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  return (
    <label
      className={classNames(
        "checkbox",
        disabled && "disabled",
        colorClass(colorMode),
        className,
      )}
    >
      <input
        {...others}
        ref={setInputRef}
        type="checkbox"
        className="checkbox--input"
        disabled={disabled}
        readOnly={readOnly ?? (isControlled && !onChange)}
        aria-checked={isIndeterminate ? "mixed" : ariaChecked}
        onChange={onChange}
      />

      {/* Decorative icons; the native input above exposes the state to assistive tech. */}
      <span
        className="checkbox--icon checkbox--icon--unchecked"
        aria-hidden="true"
      >
        <SquareIcon weight="regular" />
      </span>
      <span
        className="checkbox--icon checkbox--icon--checked"
        aria-hidden="true"
      >
        <CheckSquareIcon weight="fill" />
      </span>
      <span
        className="checkbox--icon checkbox--icon--indeterminate"
        aria-hidden="true"
      >
        <SquareLogoIcon weight="fill" />
      </span>
    </label>
  );
};

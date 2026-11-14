import { CaretDownIcon, CheckIcon, type Icon } from "@phosphor-icons/react";
import classNames from "classnames";
import {
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AppLayer } from "../../providers/appLayer/appLayer";
import { colorOptions, fillOptions } from "../../providers/theme/types";
import { colorClass } from "../../providers/theme/variants";
import { Button } from "../button/Button";
import { type marginsT, type positionType } from "../PlaceFinder/finder";
import { PlaceFinder } from "../PlaceFinder/PlaceFinder";
import "./Select.scss";

export type SelectOption<T extends string | number = string> = {
  label: ReactNode;
  value: T;
  disabled?: boolean;
  icon?: Icon;
};

export interface ISelectProps<T extends string | number = string>
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "value" | "defaultValue" | "onChange" | "type"
  > {
  options: SelectOption<T>[];
  /** Controlled selected value. Omit to use `defaultValue`. */
  value?: T;
  /** Initial selected value for the uncontrolled mode. */
  defaultValue?: T;
  onChange?: (value: T) => void;
  /** Rendered when no option is selected. @default "Select" */
  placeholder?: ReactNode;
  /** Visible label, also used as the accessible name. */
  label?: ReactNode;
  /** @default colorOptions.primary */
  colorMode?: colorOptions;
  /** @default fillOptions.outline */
  fill?: fillOptions;
  fullWidth?: boolean;
  position?: positionType;
  margins?: marginsT;
  /** Renders a hidden input so the value is submitted with a form. */
  name?: string;
  required?: boolean;
}

const isMobile = () =>
  typeof window !== "undefined" && window.innerWidth <= 480;

const DEFAULT_POSITION: positionType = [
  { vertical: "bottom", horizontal: "left" },
  { vertical: "top", horizontal: "left" },
];

const DEFAULT_MARGINS: marginsT = {
  targetEl: { X: 0, Y: 4 },
  container: { X: 4, Y: 4 },
};

const TYPEAHEAD_RESET_MS = 500;

export const Select = <T extends string | number = string>({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Select",
  label,
  colorMode = colorOptions.primary,
  fill = fillOptions.outline,
  fullWidth,
  position = DEFAULT_POSITION,
  margins = DEFAULT_MARGINS,
  name,
  required,
  disabled,
  className,
  id: idProp,
  onClick,
  onKeyDown,
  onBlur,
  "aria-labelledby": ariaLabelledBy,
  ...others
}: ISelectProps<T>) => {
  const generatedId = useId();
  const id = idProp ?? `select${generatedId}`;
  const labelId = `${id}-label`;
  const listboxId = `${id}-listbox`;

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<T | undefined>(
    defaultValue,
  );
  const selectedValue = isControlled ? value : internalValue;

  const selectedIndex = useMemo(
    () => options.findIndex((option) => option.value === selectedValue),
    [options, selectedValue],
  );
  const selectedOption =
    selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const enabledIndices = useMemo(
    () =>
      options.reduce<number[]>(
        (indices, option, index) =>
          option.disabled ? indices : [...indices, index],
        [],
      ),
    [options],
  );
  const firstEnabled = enabledIndices[0] ?? -1;
  const lastEnabled = enabledIndices[enabledIndices.length - 1] ?? -1;

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [targetEl, setTargetEl] = useState<DOMRect>();
  const [triggerWidth, setTriggerWidth] = useState<number>();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const typeahead = useRef("");
  const typeaheadTimer = useRef<number | undefined>(undefined);

  const optionId = useCallback(
    (index: number) => `${id}-option-${index}`,
    [id],
  );

  const close = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
    setTargetEl(undefined);
  }, []);

  const closeAndFocus = useCallback(() => {
    close();
    triggerRef.current?.focus();
  }, [close]);

  const open = useCallback(
    (nextActiveIndex?: number) => {
      const trigger = triggerRef.current;
      if (!trigger || disabled) return;

      const rect = trigger.getBoundingClientRect();
      setTargetEl(rect);
      setTriggerWidth(rect.width);
      setActiveIndex(
        nextActiveIndex ?? (selectedIndex >= 0 ? selectedIndex : firstEnabled),
      );
      setIsOpen(true);
      trigger.focus();
    },
    [disabled, firstEnabled, selectedIndex],
  );

  const moveActive = useCallback(
    (direction: 1 | -1) => {
      if (!enabledIndices.length) return;

      const start =
        activeIndex >= 0 ? activeIndex : direction === 1 ? -1 : options.length;
      let next = start + direction;

      while (
        next >= 0 &&
        next < options.length &&
        options[next]?.disabled
      ) {
        next += direction;
      }

      if (next >= 0 && next < options.length) setActiveIndex(next);
    },
    [activeIndex, enabledIndices.length, options],
  );

  const choose = useCallback(
    (index: number) => {
      const option = options[index];
      if (!option || option.disabled) return;

      if (!isControlled) setInternalValue(option.value);
      onChange?.(option.value);
      closeAndFocus();
    },
    [closeAndFocus, isControlled, onChange, options],
  );

  const handleTypeahead = useCallback(
    (character: string) => {
      typeahead.current += character.toLowerCase();

      if (typeaheadTimer.current !== undefined)
        window.clearTimeout(typeaheadTimer.current);

      typeaheadTimer.current = window.setTimeout(() => {
        typeahead.current = "";
      }, TYPEAHEAD_RESET_MS);

      const query = typeahead.current;
      const start =
        activeIndex >= 0
          ? query.length > 1
            ? activeIndex
            : activeIndex + 1
          : 0;
      const ordered = [...options.slice(start), ...options.slice(0, start)];
      const match = ordered.find(
        (option) =>
          !option.disabled &&
          typeof option.label === "string" &&
          option.label.toLowerCase().startsWith(query),
      );

      if (!match) return;

      const index = options.indexOf(match);
      if (isOpen) setActiveIndex(index);
      else open(index);
    },
    [activeIndex, isOpen, open, options],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled) return;

    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        if (isOpen) {
          moveActive(event.key === "ArrowDown" ? 1 : -1);
        } else {
          const fallback =
            event.key === "ArrowDown" ? firstEnabled : lastEnabled;
          open(selectedIndex >= 0 ? selectedIndex : fallback);
        }
        break;
      }
      case "Home": {
        if (!isOpen) break;
        event.preventDefault();
        if (firstEnabled >= 0) setActiveIndex(firstEnabled);
        break;
      }
      case "End": {
        if (!isOpen) break;
        event.preventDefault();
        if (lastEnabled >= 0) setActiveIndex(lastEnabled);
        break;
      }
      case "Enter":
      case " ": {
        // Prevent the native button click from toggling the listbox twice.
        event.preventDefault();
        if (!isOpen) open();
        else if (activeIndex >= 0) choose(activeIndex);
        else closeAndFocus();
        break;
      }
      case "Escape": {
        if (!isOpen) break;
        event.preventDefault();
        // Keep a parent Modal/Drawer from closing at the same time.
        event.stopPropagation();
        closeAndFocus();
        break;
      }
      case "Tab": {
        if (isOpen) close();
        break;
      }
      default: {
        if (
          event.key.length === 1 &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.altKey
        ) {
          handleTypeahead(event.key);
        }
      }
    }
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || disabled) return;
    if (isOpen) close();
    else open();
  };

  const handleBlur = () => {
    if (isOpen) close();
  };

  // Keep the active option in view while navigating with the keyboard.
  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    document
      .getElementById(`${id}-option-${activeIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, id, isOpen]);

  // Clamp the active index if the options change while the listbox is open.
  useEffect(() => {
    if (isOpen && activeIndex >= options.length)
      setActiveIndex(firstEnabled);
  }, [activeIndex, firstEnabled, isOpen, options.length]);

  useEffect(
    () => () => {
      if (typeaheadTimer.current !== undefined)
        window.clearTimeout(typeaheadTimer.current);
    },
    [],
  );

  return (
    <div
      className={classNames(
        "select-field",
        fullWidth && "select-field--full-width",
      )}
    >
      {label ? (
        <label
          id={labelId}
          htmlFor={id}
          className={classNames(
            "select-label",
            disabled && "select-label--disabled",
          )}
        >
          {label}
        </label>
      ) : undefined}

      <Button
        {...others}
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        /**
         * The listbox is portalled into `#theme-provider`, so `aria-owns`
         * keeps it in the combobox accessibility tree and makes
         * `aria-activedescendant` valid.
         */
        aria-owns={isOpen ? listboxId : undefined}
        aria-activedescendant={
          isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined
        }
        aria-labelledby={ariaLabelledBy ?? (label ? labelId : undefined)}
        aria-required={required || undefined}
        colorMode={colorMode}
        fill={fill}
        fullWidth={fullWidth}
        className={classNames("select", className)}
        icon={<CaretDownIcon className="select--caret" aria-hidden="true" />}
        iconSide="end"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onBlur={(event) => {
          onBlur?.(event);
          handleBlur();
        }}
      >
        <span
          className={classNames(
            "select--value",
            !selectedOption && "select--placeholder",
          )}
          dir="auto"
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
      </Button>

      {name ? (
        <input
          type="hidden"
          name={name}
          value={String(selectedValue ?? "")}
          disabled={disabled}
        />
      ) : undefined}

      {isOpen && targetEl
        ? createPortal(
            <AppLayer
              className="select--layer"
              closeOnEscape
              onClose={close}
              onClick={close}
            >
              <PlaceFinder
                disablePositioning={isMobile()}
                targetEl={targetEl}
                position={position}
                margins={margins}
                className="select--popover"
              >
                <div
                  id={listboxId}
                  role="listbox"
                  aria-labelledby={label ? labelId : undefined}
                  className={classNames(
                    "menu select--listbox scroller fit-content",
                    colorClass(colorMode),
                  )}
                  style={{
                    minWidth: isMobile() ? undefined : triggerWidth,
                  }}
                  onClick={(event) => event.stopPropagation()}
                >
                  {options.length ? (
                    options.map((option, index) => {
                      const OptionIcon = option.icon;
                      const isSelected = index === selectedIndex;

                      return (
                        <div
                          key={`${String(option.value)}-${index}`}
                          id={optionId(index)}
                          role="option"
                          aria-selected={isSelected}
                          aria-disabled={option.disabled || undefined}
                          className={classNames(
                            "menu-item",
                            "select--option",
                            index === activeIndex && "element--focused",
                            option.disabled && "disabled",
                            isSelected && "select--option--selected",
                          )}
                          onMouseEnter={() => {
                            if (!option.disabled) setActiveIndex(index);
                          }}
                          // Keep focus on the combobox so aria-activedescendant
                          // keeps announcing the active option.
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={(event) => {
                            event.stopPropagation();
                            choose(index);
                          }}
                        >
                          {OptionIcon ? (
                            <span className="leading-icon">
                              <OptionIcon weight="regular" />
                            </span>
                          ) : (
                            <span className="leading-icon" />
                          )}
                          <span className="content">{option.label}</span>
                          <span className="trailing-icon" aria-hidden="true">
                            {isSelected ? <CheckIcon weight="bold" /> : undefined}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="select--empty">No options</div>
                  )}
                </div>
              </PlaceFinder>
            </AppLayer>,
            document.getElementById("theme-provider")!,
            id,
          )
        : undefined}
    </div>
  );
};

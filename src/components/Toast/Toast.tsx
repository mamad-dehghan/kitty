import classNames from "classnames";
import {
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { XIcon } from "@phosphor-icons/react";
import { fillOptions, sizeOptions } from "../../providers/Theme/types";
import type { ToastAction } from "../../providers/Toast/ToastContext";
import { Button } from "../Button/Button";
import { IconButton } from "../IconButton/IconButton";
import "./Toast.scss";

export type IToastProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "onClose"
> & {
  children: ReactNode;
  action?: ToastAction;
  /** Renders the dismiss button when provided. */
  onClose?: () => void;
  /** @default "Dismiss" */
  closeLabel?: string;
  /** Plays the exit animation. */
  isClosing?: boolean;
};

export const Toast = ({
  children,
  action,
  onClose,
  closeLabel = "Dismiss",
  isClosing = false,
  className,
  ...others
}: IToastProps) => {
  return (
    <div
      className={classNames(
        "toast",
        !action && !onClose && "toast--text-only",
        isClosing && "toast--closing",
        className,
      )}
      {...others}
    >
      <p className="toast__text">{children}</p>
      {action && (
        <Button
          className="toast__action"
          size={sizeOptions.small}
          fill={fillOptions.link}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
      {onClose && (
        <IconButton
          className="toast__close"
          Icon={XIcon}
          weight="regular"
          size={sizeOptions.large}
          fill={fillOptions.link}
          enable
          aria-label={closeLabel}
          onClick={onClose}
        />
      )}
    </div>
  );
};

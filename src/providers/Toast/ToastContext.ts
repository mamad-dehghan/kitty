import {
  type Context,
  createContext,
  type ReactNode,
  useContext,
} from "react";

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type ToastOptions = {
  /** Stable id. Reusing an id updates the toast and restarts its timer. */
  id?: string;
  /**
   * Auto-dismiss delay in ms. `0` keeps the toast open until dismissed.
   * @default 5000, or 10000 when an action is provided
   */
  duration?: number;
  /** Action button. Activating it also dismisses the toast. */
  action?: ToastAction;
  /** @default true */
  dismissible?: boolean;
  /** Accessible label for the dismiss button. @default "Dismiss" */
  closeLabel?: string;
};

export type ToastContextT = {
  closeToast: (id: string) => void;
  closeAllToasts: () => void;
  toast: (content: ReactNode, options?: ToastOptions) => string;
};

export const ToastContext: Context<ToastContextT> = createContext(
  {} as ToastContextT,
);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context.toast) {
    throw new Error("useToast must be used inside a ToastProvider.");
  }
  return context;
};

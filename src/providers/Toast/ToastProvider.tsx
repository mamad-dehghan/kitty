import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Toast } from "../../components/Toast/Toast";
import { AppLayer } from "../AppLayer/AppLayer";
import {
  type ToastAction,
  ToastContext,
  type ToastOptions,
} from "./ToastContext";
import "./ToastProvider.scss";

const EXIT_MS = 150;

type ToastRecord = {
  id: string;
  content: ReactNode;
  duration: number;
  action?: ToastAction;
  dismissible: boolean;
  closeLabel?: string;
  version: number;
  status: "open" | "closing";
};

type props = {
  children: ReactNode;
};

export const ToastProvider = ({ children }: props) => {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const idRef = useRef(0);

  const toast = useCallback((content: ReactNode, options: ToastOptions = {}) => {
    const id = options.id ?? `toast-${++idRef.current}`;

    setToasts((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      const existing = index === -1 ? undefined : prev[index];
      const record: ToastRecord = {
        id,
        content,
        duration: Math.max(
          0,
          options.duration ?? (options.action ? 10000 : 5000),
        ),
        action: options.action,
        dismissible: options.dismissible ?? true,
        closeLabel: options.closeLabel,
        version: (existing?.version ?? 0) + 1,
        status: "open",
      };

      if (index === -1) return [...prev, record];

      const next = [...prev];
      next[index] = record;
      return next;
    });

    return id;
  }, []);

  const closeToast = useCallback((id: string) => {
    setToasts((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index === -1) return prev;

      if (index > 0) return prev.filter((item) => item.id !== id);

      const visible = prev[0];
      if (!visible || visible.status === "closing") return prev;

      const next = [...prev];
      next[0] = { ...visible, status: "closing" };
      return next;
    });
  }, []);

  const closeAllToasts = useCallback(() => {
    setToasts((prev) => {
      const visible = prev[0];
      if (!visible) return prev;
      if (visible.status === "closing") {
        return prev.length === 1 ? prev : [visible];
      }
      return [{ ...visible, status: "closing" }];
    });
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => (prev[0]?.id === id ? prev.slice(1) : prev));
  }, []);

  const value = useMemo(
    () => ({ toast, closeToast, closeAllToasts }),
    [toast, closeToast, closeAllToasts],
  );

  const visible = toasts[0];

  return (
    <ToastContext.Provider value={value}>
      {children}
      <AppLayer
        className="toasts-layer"
        preventBlock
        aria-live="polite"
        aria-atomic="true"
      >
        {visible && (
          <ToastItem
            key={visible.id}
            toast={visible}
            onClose={closeToast}
            onRemove={removeToast}
          />
        )}
      </AppLayer>
    </ToastContext.Provider>
  );
};

type itemProps = {
  toast: ToastRecord;
  onClose: (id: string) => void;
  onRemove: (id: string) => void;
};

const ToastItem = ({ toast, onClose, onRemove }: itemProps) => {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const remainingRef = useRef(toast.duration);
  const paused = hovered || focused;
  const {
    id,
    version,
    duration,
    status,
    action,
    dismissible,
    closeLabel,
    content,
  } = toast;

  useEffect(() => {
    remainingRef.current = duration;
  }, [duration, version]);

  useEffect(() => {
    if (paused || status === "closing" || duration === 0) return;

    const startedAt = Date.now();
    const timeout = setTimeout(() => onClose(id), remainingRef.current);

    return () => {
      clearTimeout(timeout);
      remainingRef.current = Math.max(
        0,
        remainingRef.current - (Date.now() - startedAt),
      );
    };
  }, [duration, id, onClose, paused, status, version]);

  useEffect(() => {
    if (status !== "closing") return;

    const timeout = setTimeout(() => onRemove(id), EXIT_MS);
    return () => clearTimeout(timeout);
  }, [id, onRemove, status]);

  const toastAction = action
    ? {
        ...action,
        onClick: () => {
          onClose(id);
          action.onClick();
        },
      }
    : undefined;

  return (
    <Toast
      action={toastAction}
      onClose={dismissible ? () => onClose(id) : undefined}
      closeLabel={closeLabel}
      isClosing={status === "closing"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocused(false);
        }
      }}
    >
      {content}
    </Toast>
  );
};

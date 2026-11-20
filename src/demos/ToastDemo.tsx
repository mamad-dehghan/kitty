import { useContext } from "react";
import { Button } from "../components";
import {
  colorOptions,
  fillOptions,
} from "../providers/Theme/types";
import { ToastContext } from "../providers/Toast/ToastContext";
import {
  DemoNote,
  DemoPage,
  DemoRow,
  DemoSection,
} from "./DemoLayout";

const severities = [
  colorOptions.primary,
  colorOptions.secondary,
  colorOptions.success,
  colorOptions.warning,
  colorOptions.error,
];

export const ToastDemo = () => {
  const { toast, closeAllToasts } = useContext(ToastContext);

  return (
    <DemoPage
      title="Toast"
      description="Transient messages rendered by ToastProvider in an overlay layer."
    >
      <DemoSection title="Severities">
        <DemoRow>
          {severities.map((severity) => (
            <Button
              key={severity}
              fill={fillOptions.outline}
              colorMode={severity}
              onClick={() => {
                toast(
                  `demo-toast-${Date.now()}`,
                  `A ${severity} toast`,
                  severity,
                );
              }}
            >
              {severity}
            </Button>
          ))}
        </DemoRow>
        <DemoRow>
          <Button fill={fillOptions.tonal} onClick={closeAllToasts}>
            Dismiss all
          </Button>
        </DemoRow>
      </DemoSection>

      <DemoNote>
        Toasts auto-dismiss after 5 seconds. `ToastProvider` must wrap the
        application root.
      </DemoNote>
    </DemoPage>
  );
};

import { useState } from "react";
import { Button, Toast } from "../components";
import { fillOptions } from "../providers/Theme/types";
import { useToast } from "../providers";
import {
  DemoNote,
  DemoPage,
  DemoRow,
  DemoSection,
} from "./DemoLayout";

export const ToastDemo = () => {
  const { toast, closeAllToasts } = useToast();
  const [staticToastOpen, setStaticToastOpen] = useState(true);

  return (
    <DemoPage
      title="Toast"
      description="Material 3 snackbar rendered by ToastProvider in an overlay layer."
    >
      <DemoSection title="Notifications">
        <DemoRow>
          <Button
            fill={fillOptions.outline}
            onClick={() => toast("Changes saved.")}
          >
            Default
          </Button>
          <Button
            fill={fillOptions.outline}
            onClick={() =>
              toast("Message deleted.", {
                action: {
                  label: "Undo",
                  onClick: () => toast("Message restored."),
                },
              })
            }
          >
            With action
          </Button>
          <Button
            fill={fillOptions.outline}
            onClick={() =>
              toast("This toast stays until you close it.", { duration: 0 })
            }
          >
            Persistent
          </Button>
          <Button
            fill={fillOptions.outline}
            onClick={() => {
              toast("First toast.");
              toast("Second toast.");
              toast("Third toast.");
            }}
          >
            Queue three
          </Button>
          <Button
            fill={fillOptions.outline}
            onClick={() =>
              toast(
                "A longer message that wraps onto a second line instead of being truncated, so the snackbar grows to the Material two-line height.",
              )
            }
          >
            Long text
          </Button>
          <Button
            fill={fillOptions.outline}
            onClick={() => toast("Timer restarted.", { id: "same-toast" })}
          >
            Update same id
          </Button>
          <Button fill={fillOptions.tonal} onClick={closeAllToasts}>
            Dismiss all
          </Button>
        </DemoRow>
        <DemoNote>
          Only one toast is visible at a time; additional toasts wait in a
          queue. The timer pauses while the toast is hovered or focused.
        </DemoNote>
      </DemoSection>

      <DemoSection title="Static toast">
        <DemoRow>
          {staticToastOpen ? (
            <Toast
              action={{ label: "Undo", onClick: () => {} }}
              onClose={() => setStaticToastOpen(false)}
            >
              Static toast with an action
            </Toast>
          ) : (
            <Button
              fill={fillOptions.outline}
              onClick={() => setStaticToastOpen(true)}
            >
              Show static toast
            </Button>
          )}
        </DemoRow>
      </DemoSection>
    </DemoPage>
  );
};

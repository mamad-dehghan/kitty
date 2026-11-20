import { useState } from "react";
import { BottomSheet, Button, Divider } from "../components";
import { fillOptions } from "../providers/Theme/types";
import {
  DemoNote,
  DemoPage,
  DemoRow,
  DemoSection,
} from "./DemoLayout";

export const BottomSheetDemo = () => {
  const [open, setOpen] = useState(false);

  return (
    <DemoPage
      title="BottomSheet"
      description="Pull-down sheet anchored to the bottom edge of the viewport."
    >
      <DemoSection title="Basic sheet">
        <DemoRow>
          <Button onClick={() => setOpen(true)}>Open bottom sheet</Button>
        </DemoRow>

        <BottomSheet open={open} onClose={() => setOpen(false)}>
          <div style={{ padding: "1rem", minHeight: "18rem" }}>
            <h2>Bottom sheet</h2>
            <p>Drag or scroll the sheet back to the top edge to close it.</p>
            <Divider type="fullWidth" />
            <p>Sheet content can be any React node.</p>
            <Button
              fill={fillOptions.tonal}
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        </BottomSheet>

        <DemoNote>
          `open` controls visibility; `onClose` fires on Escape, backdrop click,
          or when the sheet is swiped down.
        </DemoNote>
      </DemoSection>
    </DemoPage>
  );
};

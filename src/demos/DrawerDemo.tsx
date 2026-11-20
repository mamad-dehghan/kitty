import { useState } from "react";
import { Button, Divider, Drawer } from "../components";
import { fillOptions } from "../providers/Theme/types";
import {
  DemoNote,
  DemoPage,
  DemoRow,
  DemoSection,
} from "./DemoLayout";

type direction = "left" | "right" | "top" | "bottom";
const directions: direction[] = ["left", "right", "top", "bottom"];

export const DrawerDemo = () => {
  const [open, setOpen] = useState<direction | undefined>(undefined);

  return (
    <DemoPage
      title="Drawer"
      description="Edge-anchored panel that blocks the rest of the interface."
    >
      <DemoSection title="Directions">
        <DemoRow>
          {directions.map((direction) => (
            <Button
              key={direction}
              fill={fillOptions.outline}
              onClick={() => setOpen(direction)}
            >
              {direction}
            </Button>
          ))}
        </DemoRow>

        <Drawer
          direction={open ?? "left"}
          isOpen={open !== undefined}
          onClose={() => setOpen(undefined)}
        >
          <div style={{ padding: "1.5rem", minWidth: "16rem" }}>
            <h2>Drawer</h2>
            <p>Opened from the {open} edge.</p>
            <Divider type="fullWidth" />
            <p>Drawers close on Escape, backdrop click or the button below.</p>
            <Button
              fill={fillOptions.tonal}
              onClick={() => setOpen(undefined)}
            >
              Close
            </Button>
          </div>
        </Drawer>

        <DemoNote>
          `direction` controls the edge; `isOpen` keeps the exit animation
          mounted.
        </DemoNote>
      </DemoSection>
    </DemoPage>
  );
};

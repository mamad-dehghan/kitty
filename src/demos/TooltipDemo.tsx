import { InfoIcon, PlusIcon } from "@phosphor-icons/react";
import { Button, Tooltip } from "../components";
import { fillOptions } from "../providers/Theme/types";
import { DemoNote, DemoPage, DemoRow, DemoSection } from "./DemoLayout";

export const TooltipDemo = () => {
  return (
    <DemoPage
      title="Tooltip"
      description="Clones a single child and shows text or rich content on hover."
    >
      <DemoSection title="Text">
        <DemoRow>
          <Tooltip title="Create a new item">
            <Button icon={<PlusIcon />} iconSide="start">
              Create
            </Button>
          </Tooltip>
          <Tooltip title="More information">
            <Button fill={fillOptions.outline}>Hover me</Button>
          </Tooltip>
        </DemoRow>
      </DemoSection>

      <DemoSection title="Rich content">
        <Tooltip
          title={
            <span
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                backgroundColor: "hsl(var(--on-background))",
              }}
            >
              <InfoIcon weight="fill" />
              Rich tooltips can contain any markup.
            </span>
          }
        >
          <Button fill={fillOptions.tonal}>Rich tooltip</Button>
        </Tooltip>
      </DemoSection>

      <DemoNote>
        The child must be a single element (not a Fragment) and
        `TooltipProvider` must be mounted at the app root.
      </DemoNote>
    </DemoPage>
  );
};

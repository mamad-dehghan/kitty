import { CaretDownIcon } from "@phosphor-icons/react";
import { Button, GroupButton, IconButton } from "../components";
import {
  colorOptions,
  fillOptions,
  sizeOptions,
} from "../providers/Theme/types";
import {
  DemoNote,
  DemoPage,
  DemoSection,
} from "./DemoLayout";

export const GroupButtonDemo = () => {
  return (
    <DemoPage
      title="GroupButton"
      description="Visually joins adjacent buttons and removes the inner corner radii."
    >
      <DemoSection title="Sizes">
        <GroupButton size={sizeOptions.small}>
          <Button fill={fillOptions.outline}>Small</Button>
          <Button fill={fillOptions.outline}>Group</Button>
          <Button fill={fillOptions.outline}>Buttons</Button>
        </GroupButton>
        <GroupButton size={sizeOptions.medium}>
          <Button fill={fillOptions.outline}>Medium</Button>
          <Button fill={fillOptions.outline}>Group</Button>
          <Button fill={fillOptions.outline}>Buttons</Button>
        </GroupButton>
        <GroupButton size={sizeOptions.large}>
          <Button fill={fillOptions.outline}>Large</Button>
          <Button fill={fillOptions.outline}>Group</Button>
          <Button fill={fillOptions.outline}>Buttons</Button>
        </GroupButton>
      </DemoSection>

      <DemoSection title="Mixed content">
        <GroupButton>
          <Button colorMode={colorOptions.primary}>Save</Button>
          <Button colorMode={colorOptions.primary} fill={fillOptions.tonal}>
            Save as draft
          </Button>
          <IconButton
            Icon={CaretDownIcon}
            colorMode={colorOptions.primary}
            fill={fillOptions.tonal}
            size={sizeOptions.medium}
          />
        </GroupButton>
      </DemoSection>

      <DemoNote>
        `GroupButton` only provides layout. Each child keeps its own colorMode,
        fill and disabled state.
      </DemoNote>
    </DemoPage>
  );
};

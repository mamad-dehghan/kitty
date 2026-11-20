import {
  HeartIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { IconButton } from "../components";
import {
  colorOptions,
  fillOptions,
  sizeOptions,
} from "../providers/Theme/types";
import {
  DemoPage,
  DemoRow,
  DemoSection,
} from "./DemoLayout";

const fills = [
  fillOptions.fill,
  fillOptions.tonal,
  fillOptions.outline,
  fillOptions.elevated,
  fillOptions.link,
];

export const IconButtonDemo = () => {
  return (
    <DemoPage
      title="IconButton"
      description="Compact icon-only action with the same colorMode, fill and size variants as Button."
    >
      <DemoSection
        title="Fills"
        description="The `enable` flag switches between the muted and active icon treatment."
      >
        <DemoRow>
          {fills.map((fill) => (
            <IconButton
              key={`${fill}-off`}
              Icon={HeartIcon}
              fill={fill}
              colorMode={colorOptions.primary}
            />
          ))}
        </DemoRow>
        <DemoRow>
          {fills.map((fill) => (
            <IconButton
              key={`${fill}-on`}
              Icon={HeartIcon}
              fill={fill}
              colorMode={colorOptions.error}
              enable
            />
          ))}
        </DemoRow>
      </DemoSection>

      <DemoSection title="Sizes">
        <DemoRow>
          {[sizeOptions.small, sizeOptions.medium, sizeOptions.large].map(
            (size) => (
              <IconButton
                key={size}
                Icon={PencilSimpleIcon}
                size={size}
                fill={fillOptions.tonal}
                colorMode={colorOptions.secondary}
              />
            ),
          )}
        </DemoRow>
      </DemoSection>

      <DemoSection title="Colors and states">
        <DemoRow>
          <IconButton
            Icon={PencilSimpleIcon}
            fill={fillOptions.fill}
            colorMode={colorOptions.primary}
          />
          <IconButton
            Icon={TrashIcon}
            fill={fillOptions.fill}
            colorMode={colorOptions.error}
            enable
          />
          <IconButton
            Icon={HeartIcon}
            fill={fillOptions.outline}
            colorMode={colorOptions.warning}
            dataFocused
          />
          <IconButton
            Icon={HeartIcon}
            fill={fillOptions.fill}
            colorMode={colorOptions.primary}
            disabled
          />
        </DemoRow>
      </DemoSection>
    </DemoPage>
  );
};

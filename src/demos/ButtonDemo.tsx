import {
  ArrowRightIcon,
  HeartIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import { Button } from "../components";
import {
  colorOptions,
  fillOptions,
  sizeOptions,
} from "../providers/Theme/types";
import {
  DemoNote,
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

const colors = [
  colorOptions.primary,
  colorOptions.secondary,
  colorOptions.tertiary,
  colorOptions.error,
  colorOptions.warning,
  colorOptions.success,
  colorOptions.surface,
];

const sizes = [
  sizeOptions.small,
  sizeOptions.medium,
  sizeOptions.large,
];

export const ButtonDemo = () => {
  return (
    <DemoPage
      title="Button"
      description="Shared action component with colorMode, fill and size variants."
    >
      <DemoSection title="Fills">
        <DemoRow>
          {fills.map((fill) => (
            <Button key={fill} fill={fill}>
              {fill}
            </Button>
          ))}
        </DemoRow>
      </DemoSection>

      <DemoSection title="Colors">
        <DemoRow>
          {colors.map((colorMode) => (
            <Button key={colorMode} colorMode={colorMode}>
              {colorMode}
            </Button>
          ))}
        </DemoRow>
        <DemoRow>
          {colors.map((colorMode) => (
            <Button
              key={colorMode}
              colorMode={colorMode}
              fill={fillOptions.outline}
            >
              {colorMode}
            </Button>
          ))}
        </DemoRow>
      </DemoSection>

      <DemoSection title="Sizes">
        <DemoRow>
          {sizes.map((size) => (
            <Button key={size} size={size}>
              {size}
            </Button>
          ))}
        </DemoRow>
      </DemoSection>

      <DemoSection title="Icons and states">
        <DemoRow>
          <Button icon={<PlusIcon />} iconSide="start">
            Create
          </Button>
          <Button icon={<ArrowRightIcon />} iconSide="end" fill={fillOptions.tonal}>
            Continue
          </Button>
          <Button icon={<HeartIcon weight="fill" />} fill={fillOptions.outline}>
            Favorite
          </Button>
          <Button disabled>Disabled</Button>
        </DemoRow>
        <DemoNote>
          `fullWidth` stretches the button to the available width; `disabled`
          is forwarded to the native button element.
        </DemoNote>
        <Button fullWidth>Full width</Button>
      </DemoSection>
    </DemoPage>
  );
};

import { useState } from "react";
import { Badge, Button } from "../components";
import { colorOptions, fillOptions } from "../providers/Theme/types";
import {
  DemoPage,
  DemoRow,
  DemoSection,
} from "./DemoLayout";

const colors = [
  colorOptions.primary,
  colorOptions.secondary,
  colorOptions.tertiary,
  colorOptions.success,
  colorOptions.warning,
  colorOptions.error,
];

const Target = ({ label }: { label: string }) => {
  const [count, setCount] = useState(0);
  return (
    <Button fill={fillOptions.outline} onClick={() => setCount((c) => c + 1)}>
      {label} {count > 0 ? `(${count})` : ""}
    </Button>
  );
};

export const BadgeDemo = () => {
  return (
    <DemoPage
      title="Badge"
      description="Anchors a small indicator to a single child element."
    >
      <DemoSection title="Values">
        <DemoRow>
          <Badge value={3}>
            <Button fill={fillOptions.outline}>Inbox</Button>
          </Badge>
          <Badge value={47}>
            <Button fill={fillOptions.outline}>Updates</Button>
          </Badge>
          <Badge value={1000} maxValue={99}>
            <Button fill={fillOptions.outline}>Overflow</Button>
          </Badge>
          <Badge value="">
            <Button fill={fillOptions.outline}>Dot</Button>
          </Badge>
        </DemoRow>
      </DemoSection>

      <DemoSection title="Colors">
        <DemoRow>
          {colors.map((colorMode) => (
            <Badge key={colorMode} colorMode={colorMode} value={1}>
              <Button fill={fillOptions.outline}>{colorMode}</Button>
            </Badge>
          ))}
        </DemoRow>
      </DemoSection>

      <DemoSection title="Visibility and interaction">
        <DemoRow>
          <Badge value={5} show={false}>
            <Button fill={fillOptions.outline}>Hidden badge</Button>
          </Badge>
          <Badge value={0}>
            <Target label="Click me" />
          </Badge>
        </DemoRow>
      </DemoSection>
    </DemoPage>
  );
};

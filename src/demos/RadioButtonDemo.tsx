import { useState } from "react";
import { RadioButton } from "../components";
import { colorOptions } from "../providers/Theme/types";
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

export const RadioButtonDemo = () => {
  const [value, setValue] = useState("medium");

  return (
    <DemoPage
      title="RadioButton"
      description="Native radio input with decorative icons; group options with a shared name."
    >
      <DemoSection title="Controlled group">
        <DemoRow>
          {["small", "medium", "large"].map((option) => (
            <RadioButton
              key={option}
              name="demo-size"
              value={option}
              checked={value === option}
              onChange={() => setValue(option)}
            />
          ))}
          <code>{value}</code>
        </DemoRow>
      </DemoSection>

      <DemoSection title="Colors">
        <DemoRow>
          {colors.map((colorMode) => (
            <RadioButton
              key={colorMode}
              name={`demo-color-${colorMode}`}
              colorMode={colorMode}
              defaultChecked
            />
          ))}
        </DemoRow>
      </DemoSection>

      <DemoSection title="Disabled">
        <DemoRow>
          <RadioButton name="demo-disabled" disabled defaultChecked />
          <RadioButton name="demo-disabled" disabled />
        </DemoRow>
      </DemoSection>
    </DemoPage>
  );
};

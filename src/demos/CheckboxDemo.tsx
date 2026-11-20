import { useState } from "react";
import { Checkbox } from "../components";
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

export const CheckboxDemo = () => {
  const [checked, setChecked] = useState(true);

  return (
    <DemoPage
      title="Checkbox"
      description="Native checkbox input with decorative icons; supports the mixed/indeterminate state."
    >
      <DemoSection title="Controlled">
        <DemoRow>
          <Checkbox
            checked={checked}
            onChange={(event) => setChecked(event.currentTarget.checked)}
          />
          <Checkbox
            checked={!checked}
            onChange={(event) => setChecked(!event.currentTarget.checked)}
          />
          <code>{checked ? "checked" : "unchecked"}</code>
        </DemoRow>
      </DemoSection>

      <DemoSection title="States">
        <DemoRow>
          <Checkbox defaultChecked />
          <Checkbox />
          <Checkbox indeterminate />
          <Checkbox disabled defaultChecked />
          <Checkbox disabled />
        </DemoRow>
      </DemoSection>

      <DemoSection title="Colors">
        <DemoRow>
          {colors.map((colorMode) => (
            <Checkbox key={colorMode} colorMode={colorMode} defaultChecked />
          ))}
        </DemoRow>
      </DemoSection>
    </DemoPage>
  );
};

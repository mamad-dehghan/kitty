import { useState } from "react";
import { Switch } from "../components";
import { colorOptions } from "../providers/Theme/types";
import {
  DemoPage,
  DemoRow,
  DemoSection,
} from "./DemoLayout";

export const SwitchDemo = () => {
  const [enabled, setEnabled] = useState(true);
  const [icons, setIcons] = useState(false);

  return (
    <DemoPage
      title="Switch"
      description="Checkbox-backed toggle with separate colors for checked and unchecked states."
    >
      <DemoSection title="Controlled">
        <DemoRow>
          <Switch
            checked={enabled}
            onChange={(event) => setEnabled(event.currentTarget.checked)}
          />
          <code>{enabled ? "on" : "off"}</code>
        </DemoRow>
      </DemoSection>

      <DemoSection title="Colors">
        <DemoRow>
          {[
            colorOptions.primary,
            colorOptions.secondary,
            colorOptions.tertiary,
            colorOptions.success,
            colorOptions.warning,
            colorOptions.error,
          ].map((colorMode) => (
            <Switch
              key={colorMode}
              defaultChecked
              checkedColorMode={colorMode}
            />
          ))}
        </DemoRow>
        <DemoRow>
          <Switch
            defaultChecked
            checkedColorMode={colorOptions.success}
            uncheckedColorMode={colorOptions.error}
          />
          <Switch
            checked={icons}
            onChange={(event) => setIcons(event.currentTarget.checked)}
            hasCheckedIcon
            hasUncheckedIcon
          />
          <code>icons: {icons ? "on" : "off"}</code>
        </DemoRow>
      </DemoSection>

      <DemoSection title="Disabled">
        <DemoRow>
          <Switch disabled defaultChecked />
          <Switch disabled />
        </DemoRow>
      </DemoSection>
    </DemoPage>
  );
};

import { EnvelopeIcon, EyeIcon, PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Button, IconButton, Input } from "../components";
import {
  colorOptions,
  fillOptions,
  sizeOptions,
} from "../providers/Theme/types";
import { DemoPage, DemoRow, DemoSection } from "./DemoLayout";

export const InputDemo = () => {
  const [name, setName] = useState("Ada Lovelace");
  const [email, setEmail] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);

  return (
    <DemoPage
      title="Input"
      description="Text field with floating label, helper text, error state and icons."
    >
      <DemoSection title="Controlled">
        <DemoRow>
          <Input
            id="demo-name"
            label="Name"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
            supportText="Visible on your profile"
          />
          <Input
            id="demo-email"
            label="Email"
            value={email}
            onChange={(event) => {
              const next = event.currentTarget.value;
              setEmail(next);
              setInvalidEmail(next.length > 0 && !next.includes("@"));
            }}
            supportText={
              invalidEmail ? "Enter a valid email address" : "We never share it"
            }
            hasError={invalidEmail}
          />
        </DemoRow>
      </DemoSection>

      <DemoSection title="Fills">
        <DemoRow>
          <Input
            id="demo-fill"
            label="Fill"
            fill={fillOptions.fill}
            defaultValue="Fill"
          />
          <Input
            id="demo-outline"
            label="Outline"
            fill={fillOptions.outline}
            defaultValue="Outline"
          />
          <Input
            id="demo-elevated"
            label="Elevated"
            fill={fillOptions.elevated}
            defaultValue="Elevated"
          />
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
            <Input
              key={colorMode}
              id={`demo-color-${colorMode}`}
              label={colorMode}
              colorMode={colorMode}
              fill={fillOptions.fill}
              defaultValue={colorMode}
            />
          ))}
        </DemoRow>
      </DemoSection>

      <DemoSection title="Icons and states">
        <DemoRow>
          <Input
            id="demo-icon-start"
            label="Icon at start"
            iconStart={<EnvelopeIcon fontSize={20} />}
            placeholder="you@example.com"
          />
          <Input
            id="demo-icon-end"
            label="Icon at end"
            iconEnd={<EyeIcon fontSize={20} />}
            defaultValue="secret"
            type="password"
          />
          <Input
            id="demo-button-start"
            label="Button at start"
            iconStart={
              <Button colorMode={colorOptions.primary}>
                <PlusIcon />
              </Button>
            }
            placeholder="you@example.com"
          />
          <Input
            id="demo-disabled"
            label="Disabled"
            defaultValue="Read only"
            disabled
          />
        </DemoRow>
        <Input
          id="demo-full-width"
          label="Full width"
          placeholder="Stretch to the container"
          fullWidth
        />
      </DemoSection>
    </DemoPage>
  );
};

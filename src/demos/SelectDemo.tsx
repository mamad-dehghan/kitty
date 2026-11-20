import {
  ArchiveIcon,
  FireIcon,
  FlagIcon,
  LeafIcon,
} from "@phosphor-icons/react";
import { useId, useState } from "react";
import { Button, Select } from "../components";
import { type SelectOption } from "../components";
import {
  colorOptions,
  fillOptions,
} from "../providers/Theme/types";
import {
  DemoNote,
  DemoPage,
  DemoRow,
  DemoSection,
} from "./DemoLayout";

type Priority = "low" | "medium" | "high" | "archived";

const priorities: SelectOption<Priority>[] = [
  { label: "Low", value: "low", icon: LeafIcon },
  { label: "Medium", value: "medium", icon: FlagIcon },
  { label: "High", value: "high", icon: FireIcon },
  { label: "Archived", value: "archived", icon: ArchiveIcon, disabled: true },
];

const frameworks: SelectOption<string>[] = [
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Svelte", value: "svelte" },
  { label: "Solid", value: "solid" },
  { label: "Angular", value: "angular" },
];

export const SelectDemo = () => {
  const hintId = useId();
  const [priority, setPriority] = useState<Priority>("medium");
  const [framework, setFramework] = useState("react");
  const [submitted, setSubmitted] = useState<string>();

  return (
    <DemoPage
      title="Select"
      description="Select-only combobox with a portalled listbox, keyboard navigation and type-ahead."
    >
      <DemoSection title="Controlled">
        <Select
          label="Priority"
          options={priorities}
          value={priority}
          onChange={setPriority}
          aria-describedby={hintId}
        />
        <p id={hintId} className="demo-note">
          Arrow keys move, Home/End jump, Enter/Space select, Escape closes,
          and typing a letter jumps to a matching option.
        </p>
      </DemoSection>

      <DemoSection title="Variants">
        <DemoRow>
          <Select
            label="Default"
            options={frameworks}
            defaultValue="react"
          />
          <Select
            label="Tonal"
            options={frameworks}
            defaultValue="vue"
            fill={fillOptions.tonal}
          />
          <Select
            label="Error"
            options={frameworks}
            defaultValue="angular"
            colorMode={colorOptions.error}
            fill={fillOptions.outline}
          />
          <Select
            label="Disabled"
            options={frameworks}
            defaultValue="solid"
            disabled
          />
        </DemoRow>
        <Select
          label="Full width"
          options={frameworks}
          defaultValue="svelte"
          fullWidth
        />
      </DemoSection>

      <DemoSection title="Form value">
        <form
          style={{ display: "flex", alignItems: "flex-end", gap: "1rem" }}
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(
              String(new FormData(event.currentTarget).get("framework")),
            );
          }}
        >
          <Select
            label="Framework"
            name="framework"
            options={frameworks}
            value={framework}
            onChange={setFramework}
          />
          <Button type="submit">Submit</Button>
        </form>
        {submitted ? <code>submitted: {submitted}</code> : undefined}
        <DemoNote>
          `name` renders a hidden input so the selected value participates in
          normal form submission.
        </DemoNote>
      </DemoSection>
    </DemoPage>
  );
};

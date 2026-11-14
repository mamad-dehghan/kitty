import {
  ArchiveIcon,
  FireIcon,
  FlagIcon,
  LeafIcon,
} from "@phosphor-icons/react";
import { useId, useState } from "react";
import {
  type SelectOption,
  Button,
  Select,
} from "../components";
import { colorOptions, fillOptions } from "../providers/theme/types";

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

const sectionStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "0.5rem",
} as const;

export const SelectDemo = () => {
  const hintId = useId();
  const [priority, setPriority] = useState<Priority>("medium");
  const [framework, setFramework] = useState<string>("react");
  const [submitted, setSubmitted] = useState<string>();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "2rem",
        padding: "1.5rem",
        maxWidth: "40rem",
      }}
    >
      <header style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h1 style={{ margin: 0 }}>Select</h1>
        <p id={hintId} style={{ margin: 0, opacity: 0.7 }}>
          A select-only combobox. Keyboard: <kbd>ArrowDown</kbd>/
          <kbd>ArrowUp</kbd> to open and move, <kbd>Home</kbd>/<kbd>End</kbd>,
          <kbd>Enter</kbd>/<kbd>Space</kbd> to select, <kbd>Escape</kbd> to
          close and type-ahead to jump to an option.
        </p>
      </header>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Controlled</h2>
        <Select
          label="Priority"
          options={priorities}
          value={priority}
          onChange={setPriority}
          aria-describedby={hintId}
        />
        <code>value: {priority}</code>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Uncontrolled (defaultValue)</h2>
        <Select
          label="Framework"
          options={frameworks}
          defaultValue="svelte"
          onChange={(value) => setFramework(value)}
        />
        <code>onChange: {framework}</code>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Fill and mode</h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Select
            aria-label="Primary tonal"
            options={frameworks}
            defaultValue="react"
            fill={fillOptions.tonal}
          />
          <Select
            aria-label="Warning fill"
            options={frameworks}
            defaultValue="vue"
            mode={colorOptions.warning}
            fill={fillOptions.fill}
          />
          <Select
            aria-label="Error outline"
            options={frameworks}
            defaultValue="angular"
            mode={colorOptions.error}
          />
          <Select
            aria-label="Surface elevated"
            options={frameworks}
            defaultValue="solid"
            mode={colorOptions.surface}
            fill={fillOptions.elevated}
          />
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Disabled</h2>
        <Select
          label="Disabled select"
          options={frameworks}
          defaultValue="react"
          disabled
        />
      </section>

      <section style={{ ...sectionStyle, width: "100%" }}>
        <h2 style={{ margin: 0 }}>Full width</h2>
        <Select
          label="Full width select"
          options={frameworks}
          defaultValue="react"
          fullWidth
        />
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Form value</h2>
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
            defaultValue="react"
          />
          <Button type="submit">Submit</Button>
        </form>
        {submitted ? <code>submitted: {submitted}</code> : undefined}
      </section>
    </div>
  );
};

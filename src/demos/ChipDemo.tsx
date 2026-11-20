import {
  CheckIcon,
  PlusIcon,
  TagIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { AssistChip, FilterChip } from "../components";
import { fillOptions } from "../providers/Theme/types";
import {
  DemoPage,
  DemoRow,
  DemoSection,
} from "./DemoLayout";

const filters = ["react", "typescript", "scss", "a11y"];

export const ChipDemo = () => {
  const [enabled, setEnabled] = useState<string[]>(["react"]);

  const toggle = (filter: string) => {
    setEnabled((current) =>
      current.includes(filter)
        ? current.filter((item) => item !== filter)
        : [...current, filter],
    );
  };

  return (
    <DemoPage
      title="Chip"
      description="Assist and filter chips share the Chip stylesheet and fill variants."
    >
      <DemoSection title="Assist chips">
        <DemoRow>
          <AssistChip assist fill={fillOptions.outline} Icon={PlusIcon}>
            Add item
          </AssistChip>
          <AssistChip assist fill={fillOptions.elevated} Icon={TagIcon}>
            Tagged
          </AssistChip>
          <AssistChip
            assist
            fill={fillOptions.outline}
            Icon={XIcon}
            iconSide="end"
          >
            Dismiss
          </AssistChip>
          <AssistChip assist fill={fillOptions.outline} disabled>
            Disabled
          </AssistChip>
        </DemoRow>
      </DemoSection>

      <DemoSection
        title="Filter chips"
        description="`enable` controls the selected state and the check icon."
      >
        <DemoRow>
          {filters.map((filter) => {
            const isEnabled = enabled.includes(filter);
            return (
              <FilterChip
                key={filter}
                enable={isEnabled}
                fill={fillOptions.outline}
                Icon={isEnabled ? CheckIcon : TagIcon}
                onClick={() => toggle(filter)}
              >
                {filter}
              </FilterChip>
            );
          })}
        </DemoRow>
        <DemoRow>
          <FilterChip enable fill={fillOptions.elevated} Icon={TagIcon}>
            Elevated
          </FilterChip>
          <FilterChip enable={false} fill={fillOptions.elevated}>
            Off
          </FilterChip>
          <FilterChip enable fill={fillOptions.outline} disabled>
            Disabled
          </FilterChip>
        </DemoRow>
      </DemoSection>
    </DemoPage>
  );
};

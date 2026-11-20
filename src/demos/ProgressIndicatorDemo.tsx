import { ProgressIndicator } from "../components";
import { sizeOptions } from "../providers/Theme/types";
import {
  DemoPage,
  DemoSection,
} from "./DemoLayout";

const values = [15, 45, 75, 100];

export const ProgressIndicatorDemo = () => {
  return (
    <DemoPage
      title="ProgressIndicator"
      description="Linear progress bar with small, medium and large track sizes."
    >
      <DemoSection title="Values">
        {values.map((value) => (
          <ProgressIndicator
            key={value}
            type="linear"
            value={value}
            max={100}
          />
        ))}
      </DemoSection>

      <DemoSection title="Sizes">
        <ProgressIndicator
          type="linear"
          value={60}
          max={100}
          size={sizeOptions.small}
        />
        <ProgressIndicator
          type="linear"
          value={60}
          max={100}
          size={sizeOptions.medium}
        />
        <ProgressIndicator
          type="linear"
          value={60}
          max={100}
          size={sizeOptions.large}
        />
      </DemoSection>
    </DemoPage>
  );
};

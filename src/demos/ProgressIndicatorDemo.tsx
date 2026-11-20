import { useState } from "react";
import { ProgressIndicator } from "../components";
import { colorOptions, sizeOptions } from "../providers/Theme/types";
import {
  DemoField,
  DemoNote,
  DemoPage,
  DemoRow,
  DemoSection,
} from "./DemoLayout";
import "./ProgressIndicatorDemo.scss";

const values = [0, 25, 50, 75, 100];
const sizes = [sizeOptions.small, sizeOptions.medium, sizeOptions.large];
const colors = [
  colorOptions.primary,
  colorOptions.secondary,
  colorOptions.tertiary,
  colorOptions.success,
  colorOptions.warning,
  colorOptions.error,
];

const variants = [
  { label: "Linear", type: "linear", wave: false },
  { label: "Linear wave", type: "linear", wave: true },
  { label: "Circular", type: "circular", wave: false },
  { label: "Circular wave", type: "circular", wave: true },
] as const;

export const ProgressIndicatorDemo = () => {
  const [value, setValue] = useState(40);

  return (
    <DemoPage
      title="ProgressIndicator"
      description="Determinate Material 3 progress indicators. Flat linear uses clip-path; circular and wavy shapes use inline SVG."
    >
      <DemoSection
        title="Interactive"
        description="Drag the slider to preview all four variants."
      >
        <DemoField label={`Value: ${value}%`}>
          <input
            className="progress-demo__range"
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={(event) => setValue(Number(event.currentTarget.value))}
          />
        </DemoField>

        <div className="progress-demo__grid">
          {variants.map((variant) => (
            <div
              className={`progress-demo__item${
                variant.type === "circular"
                  ? " progress-demo__item--compact"
                  : ""
              }`}
              key={variant.label}
            >
              <span className="progress-demo__label">{variant.label}</span>
              <ProgressIndicator
                type={variant.type}
                wave={variant.wave}
                value={value}
                max={100}
              />
            </div>
          ))}
        </div>
      </DemoSection>

      <DemoSection title="Values">
        <div className="progress-demo__grid">
          {values.map((itemValue) => (
            <div className="progress-demo__item" key={itemValue}>
              <span className="progress-demo__label">{itemValue}%</span>
              <ProgressIndicator type="linear" value={itemValue} max={100} />
              <ProgressIndicator
                type="linear"
                wave
                value={itemValue}
                max={100}
              />
              <ProgressIndicator type="circular" value={itemValue} max={100} />
              <ProgressIndicator
                type="circular"
                wave
                value={itemValue}
                max={100}
              />
            </div>
          ))}
        </div>
        <DemoNote>
          The default <code>max</code> is <code>1</code>, so{" "}
          <code>value={"{0.4}"}</code> is 40%. The examples above use{" "}
          <code>max={"{100}"}</code>.
        </DemoNote>
      </DemoSection>

      <DemoSection title="Sizes">
        <div className="progress-demo__grid">
          <div className="progress-demo__item">
            <span className="progress-demo__label">Linear</span>
            {sizes.map((size) => (
              <ProgressIndicator
                key={size}
                type="linear"
                value={60}
                max={100}
                size={size}
              />
            ))}
          </div>

          <div className="progress-demo__item">
            <span className="progress-demo__label">Linear wave</span>
            {sizes.map((size) => (
              <ProgressIndicator
                key={size}
                type="linear"
                wave
                value={60}
                max={100}
                size={size}
              />
            ))}
          </div>

          <div className="progress-demo__item progress-demo__item--compact">
            <span className="progress-demo__label">Circular</span>
            {sizes.map((size) => (
              <ProgressIndicator
                key={size}
                type="circular"
                value={60}
                max={100}
                size={size}
              />
            ))}
          </div>

          <div className="progress-demo__item progress-demo__item--compact">
            <span className="progress-demo__label">Circular wave</span>
            {sizes.map((size) => (
              <ProgressIndicator
                key={size}
                type="circular"
                wave
                value={60}
                max={100}
                size={size}
              />
            ))}
          </div>
        </div>
      </DemoSection>

      <DemoSection title="Colors">
        <div className="progress-demo__grid">
          {colors.map((colorMode) => (
            <div className="progress-demo__item" key={colorMode}>
              <span className="progress-demo__label">{colorMode}</span>
              <ProgressIndicator
                type="linear"
                value={65}
                max={100}
                colorMode={colorMode}
              />
              <ProgressIndicator
                type="circular"
                value={65}
                max={100}
                colorMode={colorMode}
              />
            </div>
          ))}
        </div>
      </DemoSection>

      <DemoSection title="Normalized values">
        <DemoRow>
          <ProgressIndicator value={0.4} />
          <ProgressIndicator value={40} max={100} />
          <ProgressIndicator type="circular" value={0.4} />
          <ProgressIndicator type="circular" wave value={0.4} />
        </DemoRow>
        <DemoNote>
          Active indicators use <code>--color</code>, tracks use{" "}
          <code>--container</code>. The stop indicator is part of the track
          layer and only appears on the linear variants.
        </DemoNote>
      </DemoSection>
    </DemoPage>
  );
};

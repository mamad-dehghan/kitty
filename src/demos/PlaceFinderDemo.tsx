import { CrosshairIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Button, PlaceFinder } from "../components";
import { fillOptions, sizeOptions } from "../providers/Theme/types";
import { type positionType } from "../components/PlaceFinder/finder";
import {
  DemoNote,
  DemoPage,
  DemoRow,
  DemoSection,
} from "./DemoLayout";

type placement = "bottom-start" | "top-start" | "right-start";

const positions: Record<placement, positionType> = {
  "bottom-start": [
    { vertical: "bottom", horizontal: "left" },
    { vertical: "top", horizontal: "left" },
  ],
  "top-start": [
    { vertical: "top", horizontal: "left" },
    { vertical: "bottom", horizontal: "left" },
  ],
  "right-start": [
    { vertical: "center", horizontal: "right" },
    { vertical: "center", horizontal: "left" },
  ],
};

export const PlaceFinderDemo = () => {
  const [targetEl, setTargetEl] = useState<DOMRect>();
  const [placement, setPlacement] = useState<placement>("bottom-start");

  return (
    <DemoPage
      title="PlaceFinder"
      description="Collision-aware positioning primitive used by Menu, Select and Tooltip."
    >
      <DemoSection title="Anchored card">
        <DemoRow>
          <Button
            icon={<CrosshairIcon />}
            iconSide="start"
            onClick={(event) =>
              setTargetEl(event.currentTarget.getBoundingClientRect())
            }
          >
            Anchor here
          </Button>
          {(
            Object.keys(positions) as placement[]
          ).map((option) => (
            <Button
              key={option}
              fill={
                option === placement
                  ? fillOptions.tonal
                  : fillOptions.outline
              }
              onClick={() => setPlacement(option)}
            >
              {option}
            </Button>
          ))}
        </DemoRow>

        {targetEl ? (
          <PlaceFinder
            targetEl={targetEl}
            position={positions[placement]}
            margins={{
              targetEl: { X: 0, Y: 8 },
              container: { X: 8, Y: 8 },
            }}
            className="demo-placefinder"
          >
            <strong>PlaceFinder</strong>
            <p>Position: {placement}</p>
            <Button
              size={sizeOptions.small}
              fill={fillOptions.link}
              onClick={() => setTargetEl(undefined)}
            >
              Close
            </Button>
          </PlaceFinder>
        ) : undefined}

        <DemoNote>
          The finder flips to the next candidate when the preferred side has no
          room. It returns absolute offsets; add `position: fixed` or
          `absolute` in your own class.
        </DemoNote>
      </DemoSection>
    </DemoPage>
  );
};

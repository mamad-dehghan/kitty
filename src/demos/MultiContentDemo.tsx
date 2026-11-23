import { isValidElement, type ReactNode, useState } from "react";
import {
  Button,
  MultiContent,
  type MultiContentTransitionTo,
} from "../components";
import { fillOptions } from "../providers/Theme/types";
import {
  DemoNote,
  DemoPage,
  DemoRow,
  DemoSection,
} from "./DemoLayout";

const transitions = ["left", "right", "top", "bottom", "auto"] as const;
type transition = (typeof transitions)[number];

const slides = [
  { label: "One", background: "hsl(var(--primary-container))" },
  { label: "Two", background: "hsl(var(--secondary-container))" },
  { label: "Three", background: "hsl(var(--tertiary-container))" },
];

const getSlideIndex = (node: ReactNode) => {
  if (isValidElement(node) && node.key !== null) {
    const index = Number(node.key);
    if (!Number.isNaN(index)) return index;
  }

  return 0;
};

const resolveDirection: MultiContentTransitionTo = (previous, next) => {
  const previousIndex = getSlideIndex(previous);
  const nextIndex = getSlideIndex(next);
  const forward =
    (nextIndex - previousIndex + slides.length) % slides.length;

  return forward === 0 || forward <= slides.length / 2 ? "left" : "right";
};

export const MultiContentDemo = () => {
  const [index, setIndex] = useState(0);
  const [transitionTo, setTransitionTo] = useState<transition>("left");

  const next = () => setIndex((current) => (current + 1) % slides.length);
  const previous = () =>
    setIndex((current) => (current - 1 + slides.length) % slides.length);
  const slide = slides[index]!;

  return (
    <DemoPage
      title="MultiContent"
      description="Cross-fades and slides the current child when it changes."
    >
      <DemoSection title="Transition direction">
        <DemoRow>
          {transitions.map((transition) => (
            <Button
              key={transition}
              fill={
                transition === transitionTo
                  ? fillOptions.tonal
                  : fillOptions.outline
              }
              onClick={() => setTransitionTo(transition)}
            >
              {transition}
            </Button>
          ))}
          <Button onClick={previous}>Previous slide</Button>
          <Button onClick={next}>Next slide</Button>
        </DemoRow>

        <MultiContent
          transitionTo={
            transitionTo === "auto" ? resolveDirection : transitionTo
          }
          width="100%"
          height="12rem"
          wrapperProps={{ style: { borderRadius: "var(--radius-large)" } }}
        >
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              background: slide.background,
              color: "hsl(var(--on-surface))",
              fontSize: "2rem",
            }}
          >
            {slide.label}
          </div>
        </MultiContent>

        <DemoNote>
          `transitionTo` sets the direction the old content leaves and the new
          content enters from. The `auto` mode uses the previous and next child
          keys; keep the child keyed so re-renders without a content change do
          not animate.
        </DemoNote>
      </DemoSection>
    </DemoPage>
  );
};

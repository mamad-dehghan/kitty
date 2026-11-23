import {
  ArrowUpIcon,
  PencilSimpleIcon,
  PlusIcon,
  UserIcon,
  UserPlusIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import { type ReactNode, type RefObject, useRef, useState } from "react";
import { Button, FAB, FABMenu } from "../components";
import { useScrollBehavior } from "../hooks/useScrollBehavior";
import {
  colorOptions,
  fillOptions,
  sizeOptions,
} from "../providers/Theme/types";
import { DemoNote, DemoPage, DemoRow, DemoSection } from "./DemoLayout";
import "./FABDemo.scss";

const colors = [
  colorOptions.primary,
  colorOptions.secondary,
  colorOptions.tertiary,
  colorOptions.surface,
  colorOptions.error,
  colorOptions.warning,
  colorOptions.success,
];

const sizes = [sizeOptions.small, sizeOptions.medium, sizeOptions.large];

type ScrollMode = "direction" | "distance";

export const FABDemo = () => {
  const [mode, setMode] = useState<ScrollMode>("direction");
  const [lastAction, setLastAction] = useState("");
  const [condensed, setCondensed] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = useScrollBehavior({
    target: scrollerRef,
    hideWhen: mode === "direction" ? "down" : "distance",
    hideAfter: 48,
    condenseWhen: false,
  });

  // The scroll-to-top FAB is the inverse of the hook's hide state: it appears
  // after scrolling down and disappears at the top or while scrolling up.
  const toTopVisible = scroll.hidden;

  const scrollToTop = () => {
    scrollerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <DemoPage
      title="FAB"
      description="Material 3 floating action button with an optional extended label and a FAB menu."
    >
      <DemoSection title="Sizes">
        <DemoRow>
          {sizes.map((size) => (
            <FAB
              key={size}
              Icon={PlusIcon}
              size={size}
              colorMode={colorOptions.primary}
              aria-label={`Add (${size})`}
            />
          ))}
        </DemoRow>
        <DemoNote>
          Small is 40px, medium is 56px, large is 96px. Extended FABs always use
          the 56px medium size.
        </DemoNote>
      </DemoSection>

      <DemoSection title="Colors">
        <DemoRow>
          {colors.map((colorMode) => (
            <FAB
              key={colorMode}
              Icon={PlusIcon}
              colorMode={colorMode}
              aria-label={`Add (${colorMode})`}
            />
          ))}
        </DemoRow>
        <DemoNote>
          `surface` uses the M3 surface FAB treatment; the other values map to
          their matching container roles.
        </DemoNote>
      </DemoSection>

      <DemoSection title="Extended and states">
        <DemoRow>
          <FAB
            Icon={PencilSimpleIcon}
            label="Compose"
            colorMode={colorOptions.primary}
          />
          <FAB
            Icon={PencilSimpleIcon}
            label="Compose"
            colorMode={colorOptions.secondary}
          />
          <FAB
            Icon={PencilSimpleIcon}
            label="Compose"
            colorMode={colorOptions.tertiary}
          />
          <FAB
            Icon={PencilSimpleIcon}
            label="Compose"
            colorMode={colorOptions.surface}
          />
          <FAB Icon={PencilSimpleIcon} label="Disabled" disabled />
        </DemoRow>

        <DemoRow>
          <Button
            fill={fillOptions.tonal}
            onClick={() => setCondensed((value) => !value)}
          >
            {condensed ? "Expand" : "Condense"}
          </Button>
        </DemoRow>

        <div className="fab-demo-stage">
          <FAB
            Icon={PencilSimpleIcon}
            label="Compose"
            colorMode={colorOptions.primary}
            condensed={condensed}
          />
        </div>

        <DemoNote>
          `condensed` collapses the label and settles at 56px. The FAB stays
          visible and interactive inside the stage; use the button to expand or
          condense it.
        </DemoNote>
      </DemoSection>

      <DemoSection
        title="Scroll behavior"
        description="A scroll-to-top FAB that is revealed by direction or distance."
      >
        <DemoRow>
          <Button
            fill={mode === "direction" ? fillOptions.fill : fillOptions.outline}
            onClick={() => setMode("direction")}
          >
            Direction mode
          </Button>
          <Button
            fill={mode === "distance" ? fillOptions.fill : fillOptions.outline}
            onClick={() => setMode("distance")}
          >
            Distance mode
          </Button>
        </DemoRow>

        <DemoScrollStage stageRef={scrollerRef}>
          <FAB
            Icon={ArrowUpIcon}
            colorMode={colorOptions.primary}
            hidden={!toTopVisible}
            onClick={scrollToTop}
            aria-label="Scroll to top"
            title="Scroll to top"
          />
        </DemoScrollStage>

        <DemoRow>
          <span>
            Direction: {scroll.direction} · scroll-to-top visible:{" "}
            {String(toTopVisible)}
          </span>
        </DemoRow>

        <DemoNote>
          Direction mode shows the button while scrolling down past 48px and
          hides it while scrolling up. Distance mode shows it whenever the stage
          is scrolled past 48px and hides it again at the top.
        </DemoNote>
        <DemoNote>
          CSS-only options: {`scroll-state(scrolled: block-end)`} can reveal the
          button while scrolling down in Chromium 144+, and scroll-driven
          animations (`animation-timeline: scroll()`) can reveal it after a
          fixed distance in current browsers. The hook above is the
          cross-browser alternative.
        </DemoNote>
      </DemoSection>

      <DemoSection
        title="FAB menu"
        description="The menu is portaled to #theme-provider and fixed to the viewport bottom-end."
      >
        <FABMenu
          Icon={PencilSimpleIcon}
          colorMode={colorOptions.tertiary}
          triggerLabel="Open create menu"
          items={[
            {
              label: "New chat",
              Icon: UserIcon,
              onClick: () => setLastAction("New chat"),
            },
            {
              label: "New group",
              Icon: UsersThreeIcon,
              onClick: () => setLastAction("New group"),
            },
            {
              label: "New contact",
              Icon: UserPlusIcon,
              onClick: () => setLastAction("New contact"),
            },
          ]}
        />
        <DemoNote>
          {lastAction
            ? `Last action: ${lastAction}`
            : "Open the menu from the bottom-end corner, choose an action, then try Escape, the backdrop, or browser Back."}
        </DemoNote>
      </DemoSection>
    </DemoPage>
  );
};

type ScrollStageProps = {
  stageRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
};

const DemoScrollStage = ({ stageRef, children }: ScrollStageProps) => (
  <div className="fab-demo-scroll" ref={stageRef}>
    <div className="fab-demo-scroll__content">
      {Array.from({ length: 16 }, (_, index) => (
        <p key={index}>Scroll item {index + 1}</p>
      ))}
    </div>
    <div className="fab-demo-scroll__anchor">{children}</div>
  </div>
);

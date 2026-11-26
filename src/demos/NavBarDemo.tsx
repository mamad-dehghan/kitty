import {
  GearIcon,
  HouseIcon,
  PencilSimpleIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { NavBar } from "../components";
import { breakPoints, type breakPointType } from "../providers/Theme/types";
import { DemoFrame, DemoPage, DemoNote, DemoSection } from "./DemoLayout";

export const NavBarDemo = () => {
  return (
    <DemoPage
      title="NavBar"
      description="Responsive navigation shell with collapsible items and active content."
    >
      <DemoSection
        title="Viewport default"
        description="Without a media prop the layout follows the current viewport. The sidebar collapses with the button."
      >
        <NavBarDemoSample ariaLabel="Default demo navigation" />
      </DemoSection>

      <DemoSection
        title="Small screens"
        description="media={breakPoints.md} applies the compact bottom bar at every breakpoint."
      >
        <NavBarDemoSample
          media={breakPoints.md}
          ariaLabel="Small screen demo navigation"
        />
      </DemoSection>

      <DemoSection
        title="Medium screens"
        description="media={breakPoints.lg} applies the inline bottom bar at every breakpoint."
      >
        <NavBarDemoSample
          media={breakPoints.lg}
          ariaLabel="Medium screen demo navigation"
        />
      </DemoSection>

      <DemoSection
        title="Large screens"
        description="media={breakPoints.xl} keeps the collapsible sidebar at every breakpoint. The primary action condenses to an icon while collapsed and extends when expanded."
      >
        <NavBarDemoSample
          media={breakPoints.xl}
          ariaLabel="Large screen demo navigation"
        />
      </DemoSection>

      <DemoNote>
        `media` maps a layout to every breakpoint, so each preview renders the
        same layout regardless of the viewport. `initialActiveItem` selects the
        first visible item. The optional `action` is rendered only in the rail
        layout; use `NavBar.PrimaryAction` so it follows the collapsed/expanded
        state.
      </DemoNote>
    </DemoPage>
  );
};

const NavBarDemoSample = ({
  media,
  ariaLabel,
}: {
  media?: breakPointType;
  ariaLabel: string;
}) => {
  return (
    <DemoFrame height="420px">
      <NavBar
        initialActiveItem="Home"
        media={media}
        ariaLabel={ariaLabel}
        action={<NavBar.PrimaryAction Icon={PencilSimpleIcon} label="New" />}
        items={[
          {
            title: "Home",
            Icon: HouseIcon,
            content: <div className="demo-content">Home content</div>,
          },
          {
            title: "Profile",
            Icon: UserIcon,
            content: <div className="demo-content">Profile content</div>,
          },
          {
            title: "Settings",
            Icon: GearIcon,
            content: <div className="demo-content">Settings content</div>,
          },
        ]}
      />
    </DemoFrame>
  );
};

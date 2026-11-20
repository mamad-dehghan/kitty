import { GearIcon, HouseIcon, UserIcon } from "@phosphor-icons/react";
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
        <NavBarDemoSample />
      </DemoSection>

      <DemoSection
        title="Small screens"
        description="media={breakPoints.md} applies the compact bottom bar at every breakpoint."
      >
        <NavBarDemoSample media={breakPoints.md} />
      </DemoSection>

      <DemoSection
        title="Medium screens"
        description="media={breakPoints.lg} applies the inline bottom bar at every breakpoint."
      >
        <NavBarDemoSample media={breakPoints.lg} />
      </DemoSection>

      <DemoSection
        title="Large screens"
        description="media={breakPoints.xl} keeps the collapsible sidebar at every breakpoint."
      >
        <NavBarDemoSample media={breakPoints.xl} />
      </DemoSection>

      <DemoNote>
        `media` maps a layout to every breakpoint, so each preview renders the
        same layout regardless of the viewport. `initialActiveItem` selects the
        first visible item.
      </DemoNote>
    </DemoPage>
  );
};

const NavBarDemoSample = ({ media }: { media?: breakPointType }) => {
  return (
    <DemoFrame height="420px">
      <NavBar
        initialActiveItem="Home"
        media={media}
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

import {
  ArrowLeftIcon,
  BellIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  type Icon,
} from "@phosphor-icons/react";
import { AppBar, IconButton } from "../components";
import {
  colorOptions,
  fillOptions,
  sizeOptions,
} from "../providers/Theme/types";
import {
  DemoPage,
  DemoSection,
} from "./DemoLayout";

const iconButton = (icon: Icon, label: string) => (
  <IconButton
    key={label}
    Icon={icon}
    size={sizeOptions.small}
    fill={fillOptions.link}
    colorMode={colorOptions.primary}
    aria-label={label}
  />
);

export const AppBarDemo = () => {
  return (
    <DemoPage
      title="AppBar"
      description="Sticky top bar with start/end actions and a heading block."
    >
      <DemoSection title="Start aligned heading">
        <AppBar
          left={[iconButton(ArrowLeftIcon, "Back")]}
          center={{
            type: sizeOptions.medium,
            heading: "Inbox",
            subtitle: "3 unread messages",
          }}
          right={[iconButton(PlusIcon, "New")]}
        />
      </DemoSection>

      <DemoSection title="Centered large heading">
        <AppBar
          left={[iconButton(ArrowLeftIcon, "Back")]}
          center={{
            type: sizeOptions.large,
            align: "center",
            heading: "Project",
            subtitle: "Design system",
          }}
          right={[iconButton(MagnifyingGlassIcon, "Search")]}
        />
      </DemoSection>

      <DemoSection title="Search mode">
        <AppBar
          left={[iconButton(ArrowLeftIcon, "Back")]}
          center={{ type: "search" }}
          right={[iconButton(BellIcon, "Notifications")]}
        />
      </DemoSection>
    </DemoPage>
  );
};

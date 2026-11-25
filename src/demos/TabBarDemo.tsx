import {
  ChatCircleIcon,
  FilesIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import { TabBar } from "../components";
import {
  DemoFrame,
  DemoNote,
  DemoPage,
  DemoSection,
} from "./DemoLayout";

const Page = ({ title }: { title: string }) => (
  <div className="demo-content">{title} content</div>
);

export const TabBarDemo = () => {
  return (
    <DemoPage
      title="TabBar"
      description="Accessible, swipeable, icon-capable tabs with a shared page area."
    >
      <DemoSection title="With icons">
        <DemoFrame height="320px">
          <TabBar
            aria-label="Chat sections"
            initialActiveTab="Chats"
            tabs={[
              {
                title: "Chats",
                Icon: ChatCircleIcon,
                PageContent: () => <Page title="Chats" />,
              },
              {
                title: "Files",
                Icon: FilesIcon,
                PageContent: () => <Page title="Files" />,
              },
              {
                title: "People",
                Icon: UsersIcon,
                PageContent: () => <Page title="People" />,
              },
            ]}
          />
        </DemoFrame>
        <DemoNote>
          Use the arrow keys or Home/End to move between tabs. With the default
          mode, a swipe mounts the adjacent page after a small distance so both
          pages are visible while scrolling; tab jumps never mount intermediate
          pages.
        </DemoNote>
      </DemoSection>

      <DemoSection title="Lazy swipe">
        <DemoFrame height="320px">
          <TabBar
            aria-label="Lazy sections"
            scrollable="lazy"
            initialActiveTab="Chats"
            tabs={[
              {
                title: "Chats",
                Icon: ChatCircleIcon,
                PageContent: () => <Page title="Chats" />,
              },
              {
                title: "Files",
                Icon: FilesIcon,
                PageContent: () => <Page title="Files" />,
              },
              {
                title: "People",
                Icon: UsersIcon,
                PageContent: () => <Page title="People" />,
              },
            ]}
          />
        </DemoFrame>
        <DemoNote>
          Swipe horizontally to switch pages. Only the current page is mounted;
          the target page mounts after a deliberate swipe passes the distance
          and time thresholds.
        </DemoNote>
      </DemoSection>

      <DemoSection title="Text only">
        <DemoFrame height="260px">
          <TabBar
            aria-label="Overview sections"
            scrollable="settle"
            tabs={[
              {
                title: "Overview",
                PageContent: () => <Page title="Overview" />,
              },
              {
                title: "Activity",
                PageContent: () => <Page title="Activity" />,
              },
            ]}
          />
        </DemoFrame>
        <DemoNote>
          `scrollable="settle"` keeps the neighbor unmounted during the swipe
          and mounts it when the scroll settles.
        </DemoNote>
      </DemoSection>

      <DemoSection title="Without horizontal scrolling">
        <DemoFrame height="260px">
          <TabBar
            aria-label="Settings sections"
            scrollable={false}
            initialActiveTab="Account"
            tabs={[
              {
                title: "Account",
                PageContent: () => <Page title="Account" />,
              },
              {
                title: "Privacy",
                PageContent: () => <Page title="Privacy" />,
              },
              {
                title: "Notifications",
                PageContent: () => <Page title="Notifications" />,
              },
            ]}
          />
        </DemoFrame>
        <DemoNote>
          With `scrollable=&#123;false&#125;` tabs use `MultiContent` and slide
          only the active page.
        </DemoNote>
      </DemoSection>
    </DemoPage>
  );
};

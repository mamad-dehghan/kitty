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
      description="Swipeable, icon-capable tabs with a shared page area."
    >
      <DemoSection title="With icons">
        <DemoFrame height="320px">
          <TabBar
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
      </DemoSection>

      <DemoSection title="Text only">
        <DemoFrame height="260px">
          <TabBar
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
        <DemoNote>Tabs scroll horizontally and activate on scroll.</DemoNote>
      </DemoSection>
    </DemoPage>
  );
};

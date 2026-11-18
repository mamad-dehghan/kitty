// import { NavBar } from "./components/NavBar/NavBar";
import {
  DiamondIcon,
  DotsNineIcon,
  FilesIcon,
  FlyingSaucerIcon,
  FootballHelmetIcon,
  HandFistIcon,
  ListDashesIcon,
  MagnetStraightIcon,
  NumberFiveIcon,
  PaperPlaneIcon,
  SelectionBackgroundIcon,
  // MagnetStraightIcon,
  SquareSplitHorizontalIcon,
  StackOverflowLogoIcon,
} from "@phosphor-icons/react";
import { TabBar } from "./components/TabBar/TabBar";
import { DrawerDemo } from "./demos/DrawerDemo";
import { MenuDemo } from "./demos/MenuDemo";
import { MultiContentDemo } from "./demos/MultiContentDemo";
import { SplitButtonDemo } from "./demos/SplitButtonDemo";
import { SplitterDemo } from "./demos/SplitterDemo";
import { SwitchDemo } from "./demos/SwitchDemo";
import { SelectDemo } from "./demos/SelectDemo";
import { ModalDemo } from "./demos/ModalDemo";

import { NavBar } from "./components/NavBar/NavBar";
import { BottomSheetDemo } from "./demos/BottomSheetDemo";
import { LoadingDemo } from "./demos/LoadingDemo";
import { breakPoints } from "./providers/Theme/types";
import { AppBarDemo } from "./demos/AppBarDemo";

const overlaySection = [
  {
    title: "Menu",
    Icon: FlyingSaucerIcon,
    PageContent: MenuDemo,
  },
  {
    title: "Drawer",
    Icon: MagnetStraightIcon,
    PageContent: DrawerDemo,
  },
  {
    title: "Split View",
    Icon: SquareSplitHorizontalIcon,
    PageContent: SplitterDemo,
  },
  {
    title: "Modal",
    Icon: FilesIcon,
    PageContent: ModalDemo,
  },
  {
    title: "App Bar",
    Icon: FootballHelmetIcon,
    PageContent: AppBarDemo,
  },
  {
    title: "Sheet",
    Icon: PaperPlaneIcon,
    PageContent: BottomSheetDemo,
  },
];
const otherSection = [
  {
    title: "Multi item",
    Icon: NumberFiveIcon,
    PageContent: MultiContentDemo,
  },
  {
    title: "Switch",
    Icon: DiamondIcon,
    PageContent: SwitchDemo,
  },
  {
    title: "Select",
    Icon: ListDashesIcon,
    PageContent: SelectDemo,
  },
  {
    title: "Group Button",
    Icon: HandFistIcon,
    PageContent: SplitButtonDemo,
  },
  {
    title: "Loading",
    Icon: DotsNineIcon,
    PageContent: LoadingDemo,
  },
];
const sections = [
  {
    title: "Overlay",
    Icon: SelectionBackgroundIcon,
    content: <TabBar key={"overlaySection"} tabs={overlaySection} />,
  },
  {
    title: "Others",
    Icon: StackOverflowLogoIcon,
    content: <TabBar key={"otherSection"} tabs={otherSection} />,
  },
];

function App() {
  return (
    <main
      key="light"
      // className="light-theme"
      style={{
        // display: "flex",
        // padding: "8px",
        // gap: "8px",
        // alignItems: "center",
        // justifyContent: "flex-end",
        // flexWrap: "wrap",
        height: "100%",
        width: "100%",
        // marginRight: "12rem",
      }}
    >
      <NavBar
        items={sections}
        initialActiveItem="Overlay"
        media={{ md: breakPoints.lg }}
      />
    </main>
  );
}

export default App;

// import { NavBar } from "./components/appBar/NavBar";
import {
  DiamondIcon,
  DotsNineIcon,
  FilesIcon,
  FlyingSaucerIcon,
  FootballHelmetIcon,
  HandFistIcon,
  MagnetStraightIcon,
  NumberFiveIcon,
  PaperPlaneIcon,
  SelectionBackgroundIcon,
  // MagnetStraightIcon,
  SquareSplitHorizontalIcon,
  StackOverflowLogoIcon,
} from "@phosphor-icons/react";
import { TabBar } from "./components/appBar/TabBar";
import { DrawerDemoPage } from "./z_demos/Drawer-Demo";
import { MenuDemoPage } from "./z_demos/Menu-Demo";
import { MultiContentDemo } from "./z_demos/MultiContnet-Demo";
import { MultiButtonDemo } from "./z_demos/SplitButton-Demo";
import { SplitterDemoPage } from "./z_demos/Splitter-Demo";
import { SwitchDemo } from "./z_demos/Switch-Demo";
import { ModalDemoPage } from "./z_demos/TrModal-Demo";
// import { NavBarDemoPage } from "./z_demos/Appbar-Demo";
import { NavBar } from "./components/appBar/NavBar";
import { BottomSheetDemoPage } from "./z_demos/BottomSheet-Demo";
import { LoadingDemoPage } from "./z_demos/Loading-Demo";
import { breakPoints } from "./providers/theme/types";
import { AppbarDemoPage } from "./z_demos/Appbar-Demo";

const overlaySection = [
  {
    title: "Menu",
    Icon: FlyingSaucerIcon,
    PageContent: MenuDemoPage,
  },
  {
    title: "Drawer",
    Icon: MagnetStraightIcon,
    PageContent: DrawerDemoPage,
  },
  {
    title: "Split View",
    Icon: SquareSplitHorizontalIcon,
    PageContent: SplitterDemoPage,
  },
  {
    title: "Modal",
    Icon: FilesIcon,
    PageContent: ModalDemoPage,
  },
  {
    title: "App Bar",
    Icon: FootballHelmetIcon,
    PageContent: AppbarDemoPage,
  },
  {
    title: "Sheet",
    Icon: PaperPlaneIcon,
    PageContent: BottomSheetDemoPage,
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
    title: "Group Button",
    Icon: HandFistIcon,
    PageContent: MultiButtonDemo,
  },
  {
    title: "Loading",
    Icon: DotsNineIcon,
    PageContent: LoadingDemoPage,
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

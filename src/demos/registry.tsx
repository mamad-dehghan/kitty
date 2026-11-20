import {
  AppWindowIcon,
  ArrowLineUpIcon,
  ArrowsLeftRightIcon,
  BellIcon,
  ChartBarIcon,
  ChatTeardropTextIcon,
  CheckSquareIcon,
  ColumnsIcon,
  CompassIcon,
  CrosshairIcon,
  CursorClickIcon,
  DotsNineIcon,
  EyeIcon,
  ListDashesIcon,
  ListIcon,
  MinusIcon,
  RadioButtonIcon,
  SealIcon,
  SidebarIcon,
  SidebarSimpleIcon,
  SpinnerGapIcon,
  SquaresFourIcon,
  StackIcon,
  TabsIcon,
  TagIcon,
  TextAaIcon,
  TextTIcon,
  ToggleRightIcon,
  WrenchIcon,
  type Icon,
} from "@phosphor-icons/react";
import { type ReactElement } from "react";
import { AppBarDemo } from "./AppBarDemo";
import { BadgeDemo } from "./BadgeDemo";
import { BottomSheetDemo } from "./BottomSheetDemo";
import { ButtonDemo } from "./ButtonDemo";
import { CheckboxDemo } from "./CheckboxDemo";
import { ChipDemo } from "./ChipDemo";
import { DividerDemo } from "./DividerDemo";
import { DrawerDemo } from "./DrawerDemo";
import { GroupButtonDemo } from "./GroupButtonDemo";
import { IconButtonDemo } from "./IconButtonDemo";
import { InputDemo } from "./InputDemo";
import { LoadingIndicatorDemo } from "./LoadingIndicatorDemo";
import { MenuDemo } from "./MenuDemo";
import { ModalDemo } from "./ModalDemo";
import { MultiContentDemo } from "./MultiContentDemo";
import { MultiItemInputDemo } from "./MultiItemInputDemo";
import { NavBarDemo } from "./NavBarDemo";
import { PlaceFinderDemo } from "./PlaceFinderDemo";
import { ProgressIndicatorDemo } from "./ProgressIndicatorDemo";
import { RadioButtonDemo } from "./RadioButtonDemo";
import { SearchInputDemo } from "./SearchInputDemo";
import { SelectDemo } from "./SelectDemo";
import { SplitterDemo } from "./SplitterDemo";
import { SwitchDemo } from "./SwitchDemo";
import { TabBarDemo } from "./TabBarDemo";
import { ToastDemo } from "./ToastDemo";
import { TooltipDemo } from "./TooltipDemo";

export type DemoEntry = {
  title: string;
  Icon: Icon;
  path: string;
  PageContent: () => ReactElement;
};

export type DemoCategory = {
  title: string;
  Icon: Icon;
  demos: DemoEntry[];
};

export const demoCategories: DemoCategory[] = [
  {
    title: "Actions",
    Icon: CursorClickIcon,
    demos: [
      { title: "Button", Icon: CursorClickIcon, path: "button", PageContent: ButtonDemo },
      { title: "Icon Button", Icon: DotsNineIcon, path: "icon-button", PageContent: IconButtonDemo },
      { title: "Chip", Icon: TagIcon, path: "chip", PageContent: ChipDemo },
      { title: "Group Button", Icon: SquaresFourIcon, path: "group-button", PageContent: GroupButtonDemo },
    ],
  },
  {
    title: "Inputs",
    Icon: TextAaIcon,
    demos: [
      { title: "Input", Icon: TextTIcon, path: "input", PageContent: InputDemo },
      { title: "Search Input", Icon: TagIcon, path: "search-input", PageContent: SearchInputDemo },
      { title: "Multi Item Input", Icon: ListDashesIcon, path: "multi-item-input", PageContent: MultiItemInputDemo },
      { title: "Checkbox", Icon: CheckSquareIcon, path: "checkbox", PageContent: CheckboxDemo },
      { title: "Radio Button", Icon: RadioButtonIcon, path: "radio-button", PageContent: RadioButtonDemo },
      { title: "Switch", Icon: ToggleRightIcon, path: "switch", PageContent: SwitchDemo },
      { title: "Select", Icon: ListDashesIcon, path: "select", PageContent: SelectDemo },
    ],
  },
  {
    title: "Display",
    Icon: EyeIcon,
    demos: [
      { title: "Badge", Icon: SealIcon, path: "badge", PageContent: BadgeDemo },
      { title: "Divider", Icon: MinusIcon, path: "divider", PageContent: DividerDemo },
      { title: "Toast", Icon: BellIcon, path: "toast", PageContent: ToastDemo },
      { title: "Loading", Icon: SpinnerGapIcon, path: "loading-indicator", PageContent: LoadingIndicatorDemo },
      { title: "Progress", Icon: ChartBarIcon, path: "progress-indicator", PageContent: ProgressIndicatorDemo },
      { title: "Tooltip", Icon: ChatTeardropTextIcon, path: "tooltip", PageContent: TooltipDemo },
    ],
  },
  {
    title: "Navigation",
    Icon: CompassIcon,
    demos: [
      { title: "App Bar", Icon: AppWindowIcon, path: "app-bar", PageContent: AppBarDemo },
      { title: "Nav Bar", Icon: SidebarSimpleIcon, path: "nav-bar", PageContent: NavBarDemo },
      { title: "Tab Bar", Icon: TabsIcon, path: "tab-bar", PageContent: TabBarDemo },
      { title: "Splitter", Icon: ColumnsIcon, path: "splitter", PageContent: SplitterDemo },
    ],
  },
  {
    title: "Overlays",
    Icon: StackIcon,
    demos: [
      { title: "Modal", Icon: AppWindowIcon, path: "modal", PageContent: ModalDemo },
      { title: "Drawer", Icon: SidebarIcon, path: "drawer", PageContent: DrawerDemo },
      { title: "Menu", Icon: ListIcon, path: "menu", PageContent: MenuDemo },
      { title: "Bottom Sheet", Icon: ArrowLineUpIcon, path: "bottom-sheet", PageContent: BottomSheetDemo },
    ],
  },
  {
    title: "Helpers",
    Icon: WrenchIcon,
    demos: [
      { title: "Place Finder", Icon: CrosshairIcon, path: "place-finder", PageContent: PlaceFinderDemo },
      { title: "Multi Content", Icon: ArrowsLeftRightIcon, path: "multi-content", PageContent: MultiContentDemo },
    ],
  },
];

export const demoRoutes = demoCategories.flatMap((category) => category.demos);

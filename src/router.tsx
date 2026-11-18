import { Route, Switch, Router as Wouter } from "wouter";
import App from "./App";
import { useHistoryLockAbility } from "./hooks/useHistoryLock";
import { AppBarDemo } from "./demos/AppBarDemo";
import { BottomSheetDemo } from "./demos/BottomSheetDemo";
import { DrawerDemo } from "./demos/DrawerDemo";
import { LoadingDemo } from "./demos/LoadingDemo";
import { MenuDemo } from "./demos/MenuDemo";
import { MultiContentDemo } from "./demos/MultiContentDemo";
import { SplitButtonDemo } from "./demos/SplitButtonDemo";
import { SelectDemo } from "./demos/SelectDemo";
import { SplitterDemo } from "./demos/SplitterDemo";
import { SwitchDemo } from "./demos/SwitchDemo";
import { ModalDemo } from "./demos/ModalDemo";

export const Router = () => {
  useHistoryLockAbility();

  return (
    <Wouter
    // hook={useWouter}
    // aroundNav={(navigate, to, options) => {
    //   navigate(to, options);
    // }}
    >
      <Switch>
        <Route path="/demo" component={App} />
        <Route path="/demo/menu" component={MenuDemo} />
        <Route path="/demo/drawer" component={DrawerDemo} />
        <Route path="/demo/splitter" component={SplitterDemo} />
        <Route path="/demo/multi-content" component={MultiContentDemo} />
        <Route path="/demo/switch" component={SwitchDemo} />
        <Route path="/demo/select" component={SelectDemo} />
        <Route path="/demo/multi-button" component={SplitButtonDemo} />
        <Route path="/demo/modal" component={ModalDemo} />
        <Route path="/demo/loading" component={LoadingDemo} />
        <Route path="/demo/bottom-sheet" component={BottomSheetDemo} />
        <Route path="/demo/app-bar" component={AppBarDemo} />

        <Route>404: No such page!</Route>
      </Switch>
    </Wouter>
  );
};

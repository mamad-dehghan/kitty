import { Route, Switch, Router as Wouter } from "wouter";
import App from "./App";
import { useHistoryLockAbility } from "./hooks/useHistoryLock";
import { AppbarDemoPage } from "./z_demos/Appbar-Demo";
import { BottomSheetDemoPage } from "./z_demos/BottomSheet-Demo";
import { DrawerDemoPage } from "./z_demos/Drawer-Demo";
import { LoadingDemoPage } from "./z_demos/Loading-Demo";
import { MenuDemoPage } from "./z_demos/Menu-Demo";
import { MultiContentDemo } from "./z_demos/MultiContnet-Demo";
import { MultiButtonDemo } from "./z_demos/SplitButton-Demo";
import { SplitterDemoPage } from "./z_demos/Splitter-Demo";
import { SwitchDemo } from "./z_demos/Switch-Demo";
import { ModalDemoPage } from "./z_demos/TrModal-Demo";

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
        <Route path="/demo/menu" component={MenuDemoPage} />
        <Route path="/demo/drawer" component={DrawerDemoPage} />
        <Route path="/demo/splitter" component={SplitterDemoPage} />
        <Route path="/demo/multi-content" component={MultiContentDemo} />
        <Route path="/demo/switch" component={SwitchDemo} />
        <Route path="/demo/multi-button" component={MultiButtonDemo} />
        <Route path="/demo/modal" component={ModalDemoPage} />
        <Route path="/demo/loading" component={LoadingDemoPage} />
        <Route path="/demo/bottom-sheet" component={BottomSheetDemoPage} />
        <Route path="/demo/app-bar" component={AppbarDemoPage} />

        <Route>404: No such page!</Route>
      </Switch>
    </Wouter>
  );
};

import { Route, Switch, Router as Wouter } from "wouter";
import App from "./App";
import { demoRoutes } from "./demos/registry";
import { useHistoryLockAbility } from "./hooks/useHistoryLock";

export const Router = () => {
  useHistoryLockAbility();

  return (
    <Wouter>
      <Switch>
        <Route path="/" component={App} />
        {demoRoutes.map(({ path, PageContent }) => (
          <Route
            key={path}
            path={`/${path}`}
            component={PageContent}
          />
        ))}
        <Route>404: No such page!</Route>
      </Switch>
    </Wouter>
  );
};

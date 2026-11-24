import { Link, Route, Switch, Router as Wouter } from "wouter";
import App from "./App";
import { DemoShell } from "./DemoShell";
import { demoRoutes } from "./demos/registry";
import { useHistoryLockAbility } from "./hooks/useHistoryLock";

export const Router = () => {
  useHistoryLockAbility();

  return (
    <Wouter>
      <DemoShell>
        <Switch>
          <Route path="/" component={App} />
          {demoRoutes.map(({ path, PageContent }) => (
            <Route
              key={path}
              path={`/${path}`}
              component={PageContent}
            />
          ))}
          <Route>
            <div className="demo-app__not-found">
              <h1>404: No such page!</h1>
              <p>The demo you are looking for does not exist.</p>
              <Link href="/">Back to all demos</Link>
            </div>
          </Route>
        </Switch>
      </DemoShell>
    </Wouter>
  );
};

import { type ReactNode } from "react";
import { Link } from "wouter";
import "./DemoShell.scss";

export const DemoShell = ({ children }: { children: ReactNode }) => {
  return (
    <main className="demo-app">
      <header className="demo-app__header">
        <Link
          href="/"
          className="demo-app__brand"
          aria-label="Kitty Design System — back to all demos"
        >
          <img
            className="demo-app__logo"
            src="/kitty-logo.svg"
            alt=""
            width={40}
            height={40}
          />
          <span className="demo-app__title">Kitty Design System</span>
        </Link>
      </header>
      {children}
    </main>
  );
};

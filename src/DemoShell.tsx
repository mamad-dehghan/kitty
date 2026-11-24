import classNames from "classnames";
import { type ReactNode, useContext } from "react";
import { MoonStarsIcon, SunIcon } from "@phosphor-icons/react";
import { Link } from "wouter";
import { MultiContent } from "./components";
import "./components/IconButton/IconButton.scss";
import {
  colorOptions,
  fillOptions,
  sizeOptions,
} from "./providers/Theme/types";
import { variantClasses } from "./providers/Theme/variants";
import { themeContext } from "./providers/Theme/ThemeProvider";
import "./DemoShell.scss";

const ThemeToggle = () => {
  const { darkMode, setDarkMode } = useContext(themeContext);
  const label = darkMode ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      className={classNames(
        "icon-button",
        variantClasses({
          colorMode: colorOptions.primary,
          fill: fillOptions.link,
          size: sizeOptions.medium,
        }),
      )}
      aria-label={label}
      title={label}
      onClick={() => setDarkMode(!darkMode)}
    >
      <MultiContent transitionTo="top" width="1.5rem" height="1.5rem">
        {darkMode ? (
          <SunIcon key="sun" weight="regular" />
        ) : (
          <MoonStarsIcon key="moon" weight="regular" />
        )}
      </MultiContent>
    </button>
  );
};

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
        <div className="demo-app__header-actions">
          <ThemeToggle />
        </div>
      </header>
      {children}
    </main>
  );
};

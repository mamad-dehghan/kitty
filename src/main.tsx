// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./providers/theme/theme_provider";
import { ToastProvider } from "./providers/toast/toast_provider";
import { TooltipProvider } from "./providers/tooltip/TooltipProvider";
import { Router } from "./router";
import "./styles/globals.css";
import "./styles/package.scss";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <ThemeProvider>
    <TooltipProvider>
      <ToastProvider>
        <Router />
      </ToastProvider>
    </TooltipProvider>
  </ThemeProvider>,
  // </StrictMode>
);

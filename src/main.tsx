// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./providers/Theme/ThemeProvider";
import { ToastProvider } from "./providers/Toast/ToastProvider";
import { TooltipProvider } from "./providers/Tooltip/TooltipProvider";
import { Router } from "./router";
import "./styles/globals.css";

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

import React from "react";
import { createRoot } from "react-dom/client";

import "@fontsource/manrope/200.css";
import "@fontsource/manrope/300.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@shared/styles/global.css";
import "./management.css";
import { ManagementApp } from "./ManagementApp";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ManagementApp />
  </React.StrictMode>,
);

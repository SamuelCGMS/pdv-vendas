import React from "react";
import { createRoot } from "react-dom/client";

import "@shared/styles/global.css";
import "./styles/shell.css";
import "./styles/checkout.css";
import "./styles/opening.css";
import "./styles/payment.css";
import "./styles/closing.css";
import "./styles/modal.css";
import { SalesApp } from "./SalesApp";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SalesApp />
  </React.StrictMode>,
);

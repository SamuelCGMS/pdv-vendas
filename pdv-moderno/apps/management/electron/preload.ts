import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("gravityApp", {
  app: "management",
  runtime: "electron",
});

import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("gravityApp", {
  app: "sales",
  runtime: "electron",
});

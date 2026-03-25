import { app } from 'electron';
import type {
  DesktopRuntimeInfo,
  IpcResult,
} from '@shared/electron-api';
import { handleIpc } from './typed-ipc';

function buildRuntimeInfo(): DesktopRuntimeInfo {
  return {
    appName: app.getName(),
    environment: app.isPackaged ? 'production' : 'development',
    isPackaged: app.isPackaged,
    platform: process.platform,
    version: app.getVersion(),
  };
}

function ok<TData>(data: TData): IpcResult<TData> {
  return { ok: true, data };
}

export function registerAppIpcHandlers(): void {
  handleIpc('app:get-runtime-info', async () => ok(buildRuntimeInfo()));
}

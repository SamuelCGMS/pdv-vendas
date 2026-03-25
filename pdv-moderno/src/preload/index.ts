import { contextBridge, ipcRenderer } from 'electron';
import type {
  DesktopInvokeChannels,
  ElectronApi,
  IpcArgs,
  IpcReturn,
} from '@shared/electron-api';

function invoke<TChannel extends keyof DesktopInvokeChannels>(
  channel: TChannel,
  ...args: IpcArgs<DesktopInvokeChannels, TChannel>
): Promise<IpcReturn<DesktopInvokeChannels, TChannel>> {
  return ipcRenderer.invoke(channel, ...args);
}

const electronApi: ElectronApi = {
  getRuntimeInfo: () => invoke('app:get-runtime-info'),
};

contextBridge.exposeInMainWorld('electronAPI', electronApi);

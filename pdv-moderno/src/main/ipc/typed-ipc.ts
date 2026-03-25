import { ipcMain } from 'electron';
import type {
  DesktopInvokeChannels,
  IpcArgs,
  IpcReturn,
} from '@shared/electron-api';

type InvokeChannel = keyof DesktopInvokeChannels;

type InvokeHandler<TChannel extends InvokeChannel> = (
  ...args: IpcArgs<DesktopInvokeChannels, TChannel>
) =>
  | Promise<IpcReturn<DesktopInvokeChannels, TChannel>>
  | IpcReturn<DesktopInvokeChannels, TChannel>;

export function handleIpc<TChannel extends InvokeChannel>(
  channel: TChannel,
  handler: InvokeHandler<TChannel>,
): void {
  ipcMain.handle(channel, (_event, ...args) =>
    handler(...(args as IpcArgs<DesktopInvokeChannels, TChannel>)),
  );
}

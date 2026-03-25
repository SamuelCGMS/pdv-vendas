export type RuntimeEnvironment = 'development' | 'production';

export interface DesktopRuntimeInfo {
  appName: string;
  environment: RuntimeEnvironment;
  isPackaged: boolean;
  platform: string;
  version: string;
}

export type IpcResult<TData> =
  | { ok: true; data: TData }
  | { ok: false; error: string };

export type IpcChannelSchema = Record<string, { args: unknown[]; return: unknown }>;

export type IpcArgs<
  TChannels extends IpcChannelSchema,
  TChannel extends keyof TChannels,
> = TChannels[TChannel] extends { args: infer TArgs extends unknown[] }
  ? TArgs
  : never;

export type IpcReturn<
  TChannels extends IpcChannelSchema,
  TChannel extends keyof TChannels,
> = TChannels[TChannel] extends { return: infer TReturn }
  ? TReturn
  : never;

export type DesktopInvokeChannels = {
  'app:get-runtime-info': {
    args: [];
    return: IpcResult<DesktopRuntimeInfo>;
  };
};

export interface ElectronApi {
  getRuntimeInfo: () => Promise<
    IpcReturn<DesktopInvokeChannels, 'app:get-runtime-info'>
  >;
}

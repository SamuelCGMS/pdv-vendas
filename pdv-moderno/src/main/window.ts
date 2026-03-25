import {
  BrowserWindow,
  shell,
  type BrowserWindowConstructorOptions,
} from 'electron';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rendererDevUrl = process.env.ELECTRON_RENDERER_URL;

function isAppUrl(targetUrl: string): boolean {
  if (rendererDevUrl) {
    return targetUrl.startsWith(rendererDevUrl);
  }

  return targetUrl.startsWith('file://');
}

function openExternalUrl(targetUrl: string): void {
  if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
    void shell.openExternal(targetUrl);
  }
}

function createWindowOptions(): BrowserWindowConstructorOptions {
  return {
    width: 1440,
    height: 900,
    minWidth: 1280,
    minHeight: 720,
    title: 'Gravity PDV',
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#f4f4f4',
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      spellcheck: false,
    },
  };
}

function wireWindowSecurity(mainWindow: BrowserWindow): void {
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    openExternalUrl(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (isAppUrl(url)) {
      return;
    }

    event.preventDefault();
    openExternalUrl(url);
  });
}

async function loadRenderer(mainWindow: BrowserWindow): Promise<void> {
  if (rendererDevUrl) {
    await mainWindow.loadURL(rendererDevUrl);
    return;
  }

  await mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
}

export function createMainWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow(createWindowOptions());

  wireWindowSecurity(mainWindow);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  void loadRenderer(mainWindow);

  return mainWindow;
}

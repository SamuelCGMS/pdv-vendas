import { app, BrowserWindow } from 'electron';
import { registerIpcHandlers } from './ipc/register';
import { createMainWindow } from './window';

app.setName('Gravity PDV');

void app.whenReady().then(() => {
  registerIpcHandlers();
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

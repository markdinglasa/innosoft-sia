import { electronApp, is, optimizer } from '@electron-toolkit/utils';
import { BrowserWindow, app, ipcMain, shell } from 'electron';
import electronStore from 'electron-store';
import path, { join } from 'path';
import './controllers';
electronStore.initRenderer();

const createWindow = (url: string): BrowserWindow => {
  const window = new BrowserWindow({
    width: 900,
    height: 670,
    icon: path.join(__dirname, '../../favicon.ico'),
    show: false,
    autoHideMenuBar: true,
    center: true,
    frame: false,
    vibrancy: 'under-window',
    title: 'Note-Mark',
    visualEffectState: 'active',
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 15, y: 10 },
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true
    }
  });

  window.webContents.openDevTools();

  window.on('ready-to-show', () => {
    window.show();
  });

  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // Load the URL
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    window.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    window.loadFile(join(__dirname, url));
  }

  return window;
};

app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.innosoft');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // Handle the close-app message from the renderer process
  ipcMain.on('close-app', () => {
    app.quit();
  });

  // Determine which window to open based on database connection and licensing
  const isConnected = false; //await getConnectedStatus();
  const hasLicenseKey = await getLicenseKey();

  let url = '../renderer/index.html';
  if (!isConnected) {
    url = '../renderer/connection.html';
  } else if (!hasLicenseKey) {
    url = '../renderer/licensing.html';
  }

  createWindow(url);

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow('../renderer/index.html');
  });
});

// Error-handling functions remain unchanged
/*
async function getConnectedStatus(): Promise<boolean> {
  try {
    // Check the connection status
    const connection = await Connection()
    return connection.isConnected;
  } catch (error) {
    console.error('Error checking connection status:', error);
    return false;
  }
}*/

async function getLicenseKey(): Promise<boolean> {
  try {
    const store = new electronStore()
    const key = store.get('6B6579')
    return !!key; // Convert to boolean
  } catch (error) {
    console.error('Error getting license key:', error);
    return false;
  }
}

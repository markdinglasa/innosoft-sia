import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { BrowserWindow, app, screen, shell } from 'electron'
import installer, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer'
import electronStore from 'electron-store'
import path, { join } from 'path'
import './controllers'
import './ipcMain'

electronStore.initRenderer()
require('electron-debug')()
/*
const installExtensions = async () => {
  const installer = require('electron-devtools-installer')
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS']

  try {
    await installer.default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    console.log('Installed default extensions:', extensions)
  } catch (err) {
    console.log('Failed to install default extensions:', err)
  }
}*/

const createWindow = (url: string): BrowserWindow => {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.size

  const window = new BrowserWindow({
    width: width - 100,
    height: height - 100,
    icon: path.join(__dirname, '../shared/assetsfavicon.ico'),
    //show: false,
    //autoHideMenuBar: true,
    center: true,
    //frame: false,
    resizable: false,
    //fullscreenable: true,
    //fullscreen: false,
    //vibrancy: 'under-window',
    title: 'Innsoft SIA',
    //visualEffectState: 'active',
    //titleBarStyle: 'hidden',
    //trafficLightPosition: { x: 15, y: 10 },
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: true,
      devTools: true
    }
  })

  window.on('ready-to-show', () => {
    window.show()
  })

  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Load the URL
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    window.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    window.loadFile(join(__dirname, url))
  }

  return window
}

app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.innosoft')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  await installer(REDUX_DEVTOOLS)
  await installer(REACT_DEVELOPER_TOOLS)

  let url = '../renderer/index.html'

  createWindow(url)

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow('../renderer/index.html')
  })
})

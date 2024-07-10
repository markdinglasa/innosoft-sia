import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import AutoLaunch from 'auto-launch'
import { app, BrowserWindow, dialog, ipcMain, Menu, nativeImage, OpenDialogOptions, shell, Tray } from 'electron'
import installer, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer'
import electronStore from 'electron-store'
import path, { join } from 'path'
import './controllers'
import './ipcMain'
electronStore.initRenderer()
require('electron-debug')()

export let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
export let isQuitting = false

const createWindow = (url: string): BrowserWindow => {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 715,
    icon: path.join(__dirname, '../shared/assets/favicon.ico'),
    show: false,
    autoHideMenuBar: true,
    center: true,
    frame: false,
    resizable: false,
    fullscreenable: false,
    fullscreen: false,
    vibrancy: 'under-window',
    title: 'Innsoft SIA',
    visualEffectState: 'active',
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 15, y: 10 },
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: true,
      devTools: false
    }
  })

  ipcMain.handle('show-open-dialog', async (_event, options: OpenDialogOptions) => {
    const result = await dialog.showOpenDialog(options)
    return result
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  
  
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, url))
  }

  return mainWindow
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.innosoft')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  await installer(REDUX_DEVTOOLS)
  await installer(REACT_DEVELOPER_TOOLS)

  const url = '../renderer/index.html'
  mainWindow = createWindow(url)
  tray = new Tray(nativeImage.createFromPath(path.join(__dirname, '../../resources/favicon.ico')))

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App', click: function () {
        mainWindow?.show()
      }
    },
    {
      label: 'Quit', click: function () {
        isQuitting = true
        app.quit()
      }
    }
  ])

  tray.setToolTip('Innosoft SIA')
  tray.setContextMenu(contextMenu)

  tray.on('click', function () {
    if (mainWindow?.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow?.show()
    }
  })

  app.on('activate', function () {
    if (mainWindow === null) createWindow('../renderer/index.html')
  })

  // Auto-launch configuration
  const autoLaunch = new AutoLaunch({
    name: 'Innosoft SIA',
    path: app.getPath('exe'),
  })

  autoLaunch.isEnabled().then((isEnabled) => {
    if (!isEnabled) autoLaunch.enable()
  })
})

app.on('before-quit', () => {
  isQuitting = true
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
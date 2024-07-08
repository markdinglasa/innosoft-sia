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

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let isQuitting = false

const createWindow = (url: string): BrowserWindow => {
  //const primaryDisplay = screen.getPrimaryDisplay()
  //const { width, height } = primaryDisplay.size

  mainWindow = new BrowserWindow({
    width: 400,
    height: 715,
    icon: path.join(__dirname, '../shared/assets/favicon.ico'),
    show: false,
    autoHideMenuBar: true,
    center: true,
    //frame: false,
    resizable: false,
    fullscreenable: true,
    fullscreen: false,
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

  mainWindow.on('minimize', (event) => {
    event.preventDefault()
    mainWindow?.hide()
  })

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault()
      mainWindow?.hide()
    }
  })

  // Load the URL
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, url))
  }

  return mainWindow
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

  tray.setToolTip('My Electron App')
  tray.setContextMenu(contextMenu)

  tray.on('click', function () {
    if (mainWindow?.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow?.show()
    }
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow('../renderer/index.html')
  })

  // Auto-launch configuration
  const autoLaunch = new AutoLaunch({
    name: 'Innsoft SIA',
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

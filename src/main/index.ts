import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { APP_VERSION } from '@shared/constants'
import AutoLaunch from 'auto-launch'
import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  nativeImage,
  OpenDialogOptions,
  screen,
  shell,
  Tray
} from 'electron'
import installer, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer'
import electronStore from 'electron-store'
import fs from 'fs'
import path, { join } from 'path'
import 'reflect-metadata'
import { NODE_ENV } from './constants'
import './controllers'
import './ipcMain'
import { initializeDatabase } from './typeORM/configurations'
import { initializeLocalDatabase } from './typeORM/local-configurations'
import connectivityService from './services/connectivity.service'
import { ConnectivityChannel } from '@shared/constants'
import syncQueueService from './services/sync-queue.service'
import syncEngine from './services/sync-engine.service'
import syncDownService from './services/sync-down.service'
import './updater'

electronStore.initRenderer()
require('electron-debug')()

export let mainWindow: BrowserWindow | null = null
export let tray: Tray | null = null
export let isQuitting = false
export const isDev: boolean = NODE_ENV === 'development'

const createWindow = (url: string): BrowserWindow => {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { height, width } = primaryDisplay.size

  mainWindow = new BrowserWindow({
    width: isDev ? width : 410,
    height: isDev ? height - 100 : 700,
    icon: path.join(__dirname, '../shared/assets/favicon.ico'),
    show: isDev ? true : false,
    autoHideMenuBar: isDev ? false : true,
    center: true,
    frame: true,
    resizable: isDev ? true : false,
    fullscreenable: isDev ? true : false,
    fullscreen: false,
    //vibrancy: isDev ? 'titlebar' : 'under-window',
    title: 'Innosoft Sales Insights & Analytics',
    //visualEffectState: isDev ? 'inactive' : 'active',
    //titleBarStyle: isDev ? 'default' : 'hidden',
    //trafficLightPosition: { x: 15, y: 10 },
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: true,
      devTools: isDev ? true : false
    }
  })

  ipcMain.handle('open-folder', async (_event, folderPath) => {
    const result = await shell.openPath(folderPath)
    return result
  })

  ipcMain.handle('save-file', (_event, { base64Data, filename, path }) => {
    const buffer = Buffer.from(base64Data, 'base64')
    const savePath = path.join(path, filename)

    console.log('Selected Path:', savePath)
    fs.writeFile(savePath, new Uint8Array(buffer), (err) => {
      if (err) {
        console.error('Failed to save PDF:', err)
      } else {
        console.log('PDF saved successfully to:', savePath)
      }
    })
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

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (_event, _commandLine, _workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
  app.setAppUserModelId('innosoft SIA ' + APP_VERSION)
  app.whenReady().then(async () => {
    electronApp.setAppUserModelId('com.innosoft')
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    // Initialize local SQLite DB first (always available, even offline)
    try {
      await initializeLocalDatabase()
    } catch (error) {
      console.error('Failed to initialize local database:', error)
    }

    try {
      await initializeDatabase()
    } catch (error) {
      console.error('Failed to initialize database:', error)
      // Optionally handle initialization failure (e.g. show a dialog)
    }

    // Start connectivity monitor (polls MSSQL, broadcasts status to renderer)
    connectivityService.start()

    // Register sync engine to auto-flush queue when connectivity is restored
    syncEngine.register()

    // Start background sync-down for master data mirroring
    syncDownService.startPeriodicSync()

    // Allow renderer to query current connectivity status on load
    ipcMain.handle(ConnectivityChannel.getStatus, () => ({
      online: connectivityService.isOnline()
    }))

    ipcMain.handle(ConnectivityChannel.getPendingByTable, async (_, tableName: string) => {
      return await syncQueueService.getByTable(tableName)
    })

    ipcMain.handle(ConnectivityChannel.resetFailed, async () => {
      await syncQueueService.resetFailed()
      return { success: true }
    })

    try {
      if (isDev) await installer(REDUX_DEVTOOLS)
      if (isDev) await installer(REACT_DEVELOPER_TOOLS)
    } catch (error) {
      console.error('Failed to install extensions:', error)
    }

    mainWindow = createWindow('../renderer/index.html')
    tray = new Tray(nativeImage.createFromPath(path.join(__dirname, '../../resources/favicon.ico')))

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show App',
        click: function () {
          mainWindow?.show()
        }
      },
      {
        label: 'Quit',
        click: function () {
          isQuitting = true
          app.quit()
        }
      }
    ])

    tray.setToolTip('iSIA')
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
      name: 'iSIA',
      path: app.getPath('exe')
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
}

import { BrowserWindow, WebContents, globalShortcut, shell } from 'electron'

import { GenericVoidFunction } from '@shared/types'
import path from 'path'
import MenuBuilder from './MenuBuilder'
import WindowManager from './WindowManager'

type OnEventType = 'closed' | 'ready-to-show'

class MainWindow {
  private static instance: BrowserWindow | null = null
  //private static splashWindow: BrowserWindow | null = null

  public static async createWindow(): Promise<void> {
    // Create the splash window
    /*
    MainWindow.splashWindow = new BrowserWindow({
      width: 400,
      height: 300,
      frame: false,
      transparent: false,
      alwaysOnTop: true,
      webPreferences: {
        nodeIntegration: true,
        devTools: false
      }
    })

    MainWindow.splashWindow.center()
    */
    // Create the main window
    MainWindow.set(
      new BrowserWindow({
        width: 1100,
        height: 800,
        icon: '@shared/assets/favicon.co',
        show: false,
        center: true,
        frame: false,
        resizable: false,
        fullscreenable: true,
        fullscreen: false,
        title: 'Innosoft SIA',
        visualEffectState: 'active',
        //titleBarStyle: 'hidden',
        //trafficLightPosition: { x: 15, y: 10 },
        webPreferences: {
          preload: path.join(__dirname, '../../preload', 'index.js'),
          sandbox: false,
          nodeIntegration: true,
          contextIsolation: true,
          devTools: true
        }
      })
    )

    MainWindow.loadFile(path.join(__dirname, '../renderer', 'index.html'))

    MainWindow.on('ready-to-show', () => {
      if (!MainWindow.exists()) {
        throw new Error('"MainWindow" is not defined')
      }
      if (process.env.START_MINIMIZED) {
        MainWindow.minimize()
      } else {
        MainWindow.show()
      }
    })

    MainWindow.on('closed', () => {
      MainWindow.set(null)
    })

    const windowManager = new WindowManager(MainWindow.instance!)
    globalShortcut.register('Alt+Enter', () => {
      const isFullScreen = windowManager.isFullScreen()
      windowManager.setFullScreen(!isFullScreen)
    })

    const menuBuilder = new MenuBuilder(MainWindow.instance!)
    menuBuilder.buildMenu()

    // Open urls in the user's browser
    MainWindow.getWebContents()?.setWindowOpenHandler((eventData) => {
      shell.openExternal(eventData.url)
      return { action: 'deny' }
    })
  }

  public static exists(): boolean {
    return !!MainWindow.instance
  }

  public static getWebContents(): WebContents | null {
    return MainWindow.instance?.webContents || null
  }

  public static loadURL(url: string): void {
    MainWindow.instance?.loadURL(url)
  }

  public static loadFile(url: string): void {
    MainWindow.instance?.loadFile(url)
  }

  public static minimize(): void {
    MainWindow.instance?.minimize()
  }

  public static on(event: OnEventType, listener: GenericVoidFunction): void {
    MainWindow.instance?.on(event as any, listener)
  }

  public static set(window: BrowserWindow | null): void {
    MainWindow.instance = window
  }

  public static show(): void {
    MainWindow.instance?.show()
  }
}

export default MainWindow

import { BrowserWindow } from 'electron'

export default class WindowManager {
  mainWindow: BrowserWindow
  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow
  }

  setFullScreen(isFullScreen: any) {
    this.mainWindow.setFullScreen(isFullScreen)
  }

  isFullScreen() {
    return this.mainWindow.isFullScreen()
  }
}

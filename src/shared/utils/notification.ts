export const windowNotification = (title: string, body: string, path?: string) => {
  const notification = new window.Notification(title, { body: body })

  notification.onclick = async () => {
    if (path) await window.electron.dialog.openFolder(path)
  }
}

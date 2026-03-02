import { exec } from 'child_process'
import { platform } from 'os'

export const getStorageSerialNumber = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const command =
      platform() === 'darwin'
        ? "diskutil info / | awk '/Volume UUID/ {print $3}'"
        : 'wmic diskdrive get serialnumber'

    exec(command, (error, stdout) => {
      if (error) {
        reject(error)
        return
      }
      const lines = stdout.trim().split('\n')
      const storageSerialNumber = platform() === 'darwin' ? lines[0].trim() : lines[1]?.trim()
      resolve(storageSerialNumber)
    })
  })
}

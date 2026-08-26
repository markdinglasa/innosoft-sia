import { exec } from 'child_process'
import { platform } from 'os'

export const getStorageSerialNumber = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const command =
      platform() === 'darwin'
        ? "diskutil info / | awk '/Volume UUID/ {print $3}'"
        : 'powershell -NoProfile -Command "Get-CimInstance -ClassName Win32_DiskDrive | Select-Object -First 1 -ExpandProperty SerialNumber"'

    exec(command, (error, stdout) => {
      if (error) {
        reject(error)
        return
      }
      const lines = stdout.trim().split('\n')
      const storageSerialNumber = lines[0].trim()
      resolve(storageSerialNumber)
    })
  })
}

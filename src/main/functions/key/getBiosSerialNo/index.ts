import { exec } from 'child_process'
import { platform } from 'os'

export const getBiosSerialNumber = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const command =
      platform() === 'darwin'
        ? "system_profiler SPHardwareDataType | awk '/Serial Number \\(system\\)/ {print $4}'"
        : 'wmic bios get serialnumber'

    exec(command, (error, stdout) => {
      if (error) {
        reject(error)
        return
      }
      const lines = stdout.trim().split('\n')
      const biosSerialNumber = platform() === 'darwin' ? lines[0].trim() : lines[1]?.trim()
      resolve(biosSerialNumber)
    })
  })
}

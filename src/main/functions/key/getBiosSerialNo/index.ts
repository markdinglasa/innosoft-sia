import { exec } from 'child_process'
import { platform } from 'os'

export const getBiosSerialNumber = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const command =
      platform() === 'darwin'
        ? "system_profiler SPHardwareDataType | awk '/Serial Number \\(system\\)/ {print $4}'"
        : 'powershell -NoProfile -Command "Get-CimInstance -ClassName Win32_BIOS | Select-Object -ExpandProperty SerialNumber"'

    exec(command, (error, stdout) => {
      if (error) {
        reject(error)
        return
      }
      const lines = stdout.trim().split('\n')
      const biosSerialNumber = lines[0].trim()
      resolve(biosSerialNumber)
    })
  })
}

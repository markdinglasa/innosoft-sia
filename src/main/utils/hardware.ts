import { networkInterfaces, hostname, platform, arch } from 'os'
import { createHash } from 'crypto'

/**
 * Generates a unique fingerprint for the current machine based on hardware identifiers.
 * This should be consistent across app restarts.
 */
export function getMachineFingerprint(): string {
  const interfaces = networkInterfaces()
  const macAddresses: string[] = []

  for (const interfaceName in interfaces) {
    const addresses = interfaces[interfaceName]
    if (addresses) {
      for (const address of addresses) {
        if (!address.internal && address.mac !== '00:00:00:00:00:00') {
          macAddresses.push(address.mac)
        }
      }
    }
  }

  // Combine MAC addresses, hostname, platform, and arch to create a stable identifier
  const rawId = [
    ...macAddresses.sort(),
    hostname(),
    platform(),
    arch()
  ].join('|')

  return createHash('sha256').update(rawId).digest('hex')
}

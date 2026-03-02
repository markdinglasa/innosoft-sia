import { SFC, Theme } from '@shared/types'
import { CopyClip } from '../../Inputs/CopyClip'

export interface KeyProps {
  theme: Theme
  encryptedKey: string
}

export const Key: SFC<KeyProps> = ({ className, theme, encryptedKey }) => {
  return <CopyClip Value={encryptedKey} className={className} Label="Encrypted Key" Theme={theme} />
}

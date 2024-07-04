import { mdiClipboardCheckMultipleOutline, mdiContentCopy } from '@mdi/js'
import { ButtonColor, ButtonType, SFC } from '@shared/types'
import { useEffect, useState } from 'react'
import * as S from './Styles'

export interface GeneratedLicenseProps {
    license: string;
}

export const GeneratedLicense: SFC<GeneratedLicenseProps> = ({ className, license }) => {
  const [genLicense, setGenLicense] = useState('')
  useEffect(() => {
    const fetchLicense = async () => {
      try {
        if (license === null) {
          setGenLicense('none')
        } else {
          setGenLicense(license)
        }
      } catch (error) {
        setGenLicense('Internal Server Error')
      }
    }
    fetchLicense()
  }, [license])

  const [copyStatus, setCopyStatus] = useState('Copy')
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(genLicense)
      .then(() => {
        setCopyStatus('Copied')
        setTimeout(() => setCopyStatus('Copy'), 4000)
      })
      .catch((error) => console.error('Error copying to clipboard:', error))
  }
  return (
    <S.Container className={className}>
      <S.ButtonCon>
        <S.Label>License</S.Label>
        <S.Button
          onClick={copyToClipboard}
          iconLeft={copyStatus === 'Copy' ? mdiContentCopy : mdiClipboardCheckMultipleOutline}
          color={ButtonColor.blue}
          type={ButtonType.button}
          text={copyStatus}
        />
      </S.ButtonCon>
      <S.Input type="text" value={genLicense} readOnly />
    </S.Container>
  )
}

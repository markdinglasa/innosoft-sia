import { Windows } from '@renderer/windows/registry'
import { Splash } from '@shared/components'
import { getActiveLicense } from '@shared/selectors'
import { SFC } from '@shared/types'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { SelectorForm } from '../..'

export const SelectorWindow: SFC = ({ className }) => {
  const activeWindow = useSelector(getActiveLicense)
  const [isWindowActive, setIsWindowActive] = useState<boolean | null>(null)

  useEffect(() => {
    if (!activeWindow || activeWindow === null) {
      setIsWindowActive(false)
    } else {
      setIsWindowActive(true)
    }
  }, [activeWindow])

  const renderContent = () => {
    if (isWindowActive === null) return <Splash message="Please wait..." />
    return isWindowActive ? <SelectorForm /> : <Windows />
  }

  return <div className={className}>{renderContent()}</div>
}

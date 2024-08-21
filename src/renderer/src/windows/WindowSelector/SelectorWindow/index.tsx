import { Splash } from '@shared/components'
import { getActiveLicense } from '@shared/selectors'
import { SFC } from '@shared/types'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Windows } from '../../registry'

export const SelectorWindow: SFC = ({ className }) => {
  const activeWindow = useSelector(getActiveLicense)
  const [isWindowActive, setIsWindowActive] = useState<boolean | null>(null)
  console.log(isWindowActive)
  useEffect(() => {
    if (!activeWindow || activeWindow === null) {
      setIsWindowActive(false)
    } else {
      setIsWindowActive(true)
    }
  }, [activeWindow])    

  const renderContent = () => {
    if (isWindowActive === null) return <Splash message="Please wait..." />
    return <Windows />
  }

  return <div className={className}>{renderContent()}</div>
}

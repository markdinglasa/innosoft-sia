import { useEffect, useState } from 'react'

export const useIsTouchDevice = () => {
  const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.maxTouchPoints > 0
  }
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch(isTouchDevice())
  }, [])

  return isTouch
}
/**
 * USAGE
    const isTouchDevice = useIsTouchDevice();
    const handleClick = () => {
        if (isTouchDevice) alert('TouchScreen')
    }
 */

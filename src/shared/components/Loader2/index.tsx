import { SFC } from '@shared/types'
import { useEffect } from 'react'
import * as S from './Styles'
import './loader2.css'

export const Loader2: SFC = () => {
  useEffect(() => {
    const loadingBar = document.getElementById('loading-bar') as HTMLElement
    const loadingCircle = document.getElementById('loading-circle') as HTMLElement

    function updateLoadingBar() {
      let width = 0
      const interval = setInterval(() => {
        if (width >= 100) {
          clearInterval(interval)
        } else {
          width += 1
          loadingBar.style.width = width + '%'
          loadingCircle.style.left = `calc(${width + 12}% - 10px)` // Adjust circle position
        }
      }, 100) // 10 seconds divided by 100 increments (100ms per increment)
    }

    updateLoadingBar()
  }, [])
  return (
    <>
      <S.Container>
        <div id="loading-container">
          <div id="loading-text">Please wait...</div>
          <div id="loading-bar-container">
            <div id="loading-bar">
              <div id="loading-circle"></div>
            </div>
          </div>
        </div>
      </S.Container>
    </>
  )
}

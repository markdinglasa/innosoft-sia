import { FC, ReactNode, createContext, useContext, useEffect, useRef } from 'react'

interface ScannerContextType {
  // We can expose methods to manually trigger or configure if needed
}

const ScannerContext = createContext<ScannerContextType | undefined>(undefined)

export const ScannerProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const buffer = useRef<string>('')
  const lastKeyTime = useRef<number>(0)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore keys when focused on an input unless specifically allowed
      const target = event.target as HTMLElement
      const isInputFocused = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable

      // Some scanners send 'Enter' at the end
      if (event.key === 'Enter') {
        if (buffer.current.length > 2) {
          console.log('Barcode Scanned:', buffer.current)
          // Dispatch a custom event or call a callback
          window.dispatchEvent(new CustomEvent('barcode-scan', { detail: buffer.current }))
          buffer.current = ''
        }
        return
      }

      // Ignore single modifier keys
      if (['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) return

      const currentTime = Date.now()
      const timeDiff = currentTime - lastKeyTime.current

      // Scanners are fast. Typically < 30ms between characters.
      // If it's slow, it's likely a human typing, so clear the buffer unless we are in a focused field.
      if (timeDiff > 50 && buffer.current.length > 0) {
        buffer.current = ''
      }

      // Add alphanumeric characters to buffer
      if (event.key.length === 1) {
        buffer.current += event.key
        lastKeyTime.current = currentTime
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <ScannerContext.Provider value={{}}>
      {children}
    </ScannerContext.Provider>
  )
}

export const useScanner = () => {
  const context = useContext(ScannerContext)
  if (!context) throw new Error('useScanner must be used within ScannerProvider')
  return context
}

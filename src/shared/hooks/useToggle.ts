import { useReducer } from 'react'

const toggleReducer = (currentValue: boolean, newValue: boolean | undefined) => {
  return typeof newValue === 'boolean' ? newValue : !currentValue
}

export const useToggle = (
  initialValue: boolean
): [state: boolean, dispatch: (value?: any) => void] => {
  return useReducer(toggleReducer, initialValue)
}

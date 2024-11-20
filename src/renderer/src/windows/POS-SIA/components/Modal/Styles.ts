import styled, { keyframes } from 'styled-components'

import { Icon as UIcon } from '@shared/components/Icon'
import { colors } from '@shared/styles'
import { Theme } from '@shared/types'

const addOverlay = keyframes`
  from {
    background: rgba(0, 0, 0, 0);
  }
  to {
    background: rgba(0, 0, 0, 0.75);
  }
`

export const Content = styled.div<{ theme: Theme }>`
  padding: 16px;
`

export const Header = styled.div`
  align-items: center;
  border-bottom: 1px solid
    ${({ theme }) => {
      if (theme === Theme.dark) {
        return colors.palette.gray['100']
      }
      if (theme === Theme.light) {
        return colors.primary
      }
      return colors.primary
    }};
  color: ${({ theme }) => {
    if (theme === Theme.dark) {
      return colors.palette.gray['100']
    }
    return colors.primary
  }};
  display: flex;
  font-size: 16px;
  font-weight: bold;
  justify-content: space-between;
  padding: 8px 16px;
  position: relative;
`

export const Icon = styled(UIcon)`
  color: ${({ theme }) => {
    if (theme === Theme.dark) {
      return colors.palette.gray['100']
    }
    if (theme === Theme.light) {
      return colors.primary
    }
    return colors.primary
  }};

  &:hover {
    background: ${colors.pink};
    color: ${colors.primary};
  }
`

export const Modal = styled.div<{ theme: Theme }>`
  background-color: ${({ theme }) => {
    if (theme === Theme.dark) {
      return colors.primary
    }
    return colors.palette.gray['100']
  }};
  color: ${({ theme }) => {
    if (theme === Theme.dark) {
      return colors.palette.gray['100']
    }
    return colors.primary
  }};
  border: 1px solid
    ${({ theme }) => {
      if (theme === Theme.dark) {
        return colors.palette.gray['100']
      }
      return colors.primary
    }};
  border-radius: 8px;
  left: 50%;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
`

export const Overlay = styled.div`
  animation: ${addOverlay} 0.3s forwards;
  height: 100vh;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
`

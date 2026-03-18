import styled, { keyframes } from 'styled-components'

import { Icon as UIcon } from '@shared/components'
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
  padding: 1.6rem;
`

export const Header = styled.div`
  align-items: center;
  color: ${({ theme }) => {
    if (theme === Theme.dark) {
      return colors.palette.gray['100']
    }
    return colors.primary
  }};
  display: flex;
  font-size: 1.6rem;
  font-weight: bold;
  justify-content: space-between;
  padding: 0.8rem 1.6rem;
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
  border-radius: 0.8rem;
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

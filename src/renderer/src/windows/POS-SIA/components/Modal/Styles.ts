import styled, { keyframes } from 'styled-components'

import { Icon as UIcon } from '@shared/components/Icon'
import { colors } from '@shared/styles'

const addOverlay = keyframes`
  from {
    background: rgba(0, 0, 0, 0);
  }
  to {
    background: rgba(0, 0, 0, 0.75);
  }
`

export const Content = styled.div`
  padding: 16px;
`

export const Header = styled.div`
  align-items: center;
  border-bottom: 1px solid ${colors.palette.gray[100]};
  color: ${colors.primary};
  display: flex;
  font-size: 16px;
  font-weight: bold;
  justify-content: space-between;
  padding: 8px 16px;
  position: relative;
`

export const Icon = styled(UIcon)`
  color: ${colors.palette.gray[100]};

  &:hover {
    background: ${colors.pink};
    color: ${colors.primary};
  }
`

export const Modal = styled.div`
  background: ${colors.white};
  border: 1px solid ${colors.palette.gray[100]};
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

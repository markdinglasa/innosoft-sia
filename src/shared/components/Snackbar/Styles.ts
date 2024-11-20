import { mdiAlert, mdiAlertCircleOutline, mdiCheckCircle } from '@mdi/js'
import { colors } from '@shared/styles'
import { ToastType } from '@shared/types'
import styled, { keyframes } from 'styled-components'
import { Icon } from '..'
const fadeIn = keyframes`
  from {
    background: rgba(0, 0, 0, 0);
  }
  to {
    background: rgba(44, 57, 103, 0.3);
  }
`
const fadeOut = keyframes`
  from {
    background: rgba(44, 57, 103, 0.3);
  }
  to {
    background: rgba(0, 0, 0, 0);
  }
`
export const Container = styled.div<{ visible: boolean }>`
  height: 100vh;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${({ visible }) => (visible ? fadeIn : fadeOut)} 0.3s forwards;
`
export const Card = styled.div<{ type: ToastType; visible: boolean }>`
  width: 70%;
  padding: 20px 20px;
  background-color: ${({ type }) => {
    if (type === ToastType.success) return colors.palette.green['300']
    if (type === ToastType.warning) return colors.palette.orange['300']
    return colors.palette.red['300']
  }};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: start;
`
const iconProps = `
    color: #fff;
    margin-right: 12px;
`
export const AlertCircleOutlineIcon = styled(Icon).attrs(() => ({ icon: mdiAlertCircleOutline }))`
  ${iconProps}
`
export const WarningIcon = styled(Icon).attrs(() => ({ icon: mdiAlert }))`
  ${iconProps}
`
export const CheckCircleIcon = styled(Icon).attrs(() => ({ icon: mdiCheckCircle }))`
  ${iconProps}
`
export const Span = styled.span`
  padding: 10px 10px;
  color: ${colors.white};
  text-align: left;
`

import { colors } from '@shared/styles/colors'
import styled from 'styled-components'

export const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 40;
  background-color: rgba(0, 0, 0, 0.5);
  transition-property: opacity;
  transition-duration: 300ms;
  ${(p) => (p.$isOpen ? 'opacity: 1; pointer-events: auto;' : 'opacity: 0; pointer-events: none;')}
`

export const Panel = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  right: 0;
  top: 0;
  z-index: 50;
  display: flex;
  height: 100%;
  width: 600px;
  max-width: 100vw;
  flex-direction: column;
  background-color: ${colors.primary};
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  transition-property: transform;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  ${(p) => (p.$isOpen ? 'transform: translateX(0);' : 'transform: translateX(100%);')}
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #efefef;
  padding: 1rem;
`

export const Title = styled.h2`
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
  color: #ffffff;
`

export const HeaderActions = styled.div`
  display: flex;
  gap: 0.5rem;
`

export const ActionButton = styled.button`
  border-radius: 0.25rem;
  background-color: ${colors.secondary};
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: ${colors.primary};
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-duration: 150ms;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: ${colors.pink};
    transition: 0.3s ease-in-out;
  }
`

export const CloseButton = styled.button`
  border-radius: 9999px;
  padding: 0.375rem;
  color: ${colors.white};
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-duration: 150ms;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${colors.pink};
    color: ${colors.primary};
    transition: 0.3s ease-in-out;
  }
`

export const Body = styled.div`
  flex: 1 1 0%;
  overflow-y: auto;
  padding: 1rem;
`

export const LogList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const LogItem = styled.div<{ $level: string }>`
  border-radius: 0.375rem;
  border: 1px solid;
  padding: 0.75rem;
  ${(p) =>
    p.$level === 'error'
      ? 'border-color: rgba(127, 29, 29, 0.5); background-color: rgba(69, 10, 10, 0.2);'
      : p.$level === 'warn'
        ? 'border-color: rgba(113, 63, 18, 0.5); background-color: rgba(66, 32, 6, 0.2);'
        : 'border-color: #262626; background-color: rgba(10, 10, 10, 0.5);'}
`

export const LogHeader = styled.div`
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const LogMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  line-height: 1rem;
`

export const LogLevelBadge = styled.span<{ $level: string }>`
  border-radius: 0.25rem;
  padding: 0.125rem 0.375rem;
  font-weight: 700;
  text-transform: uppercase;
  ${(p) =>
    p.$level === 'error'
      ? 'background-color: rgba(127, 29, 29, 0.5); color: #f87171;'
      : p.$level === 'warn'
        ? 'background-color: rgba(113, 63, 18, 0.5); color: #facc15;'
        : 'background-color: rgba(30, 58, 138, 0.5); color: #60a5fa;'}
`

export const LogSource = styled.span`
  font-weight: 500;
  color: #a3a3a3;
`

export const LogTime = styled.span`
  color: #737373;
`

export const LogMessage = styled.div`
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #e5e5e5;
`

export const LogDetails = styled.pre`
  margin-top: 0.5rem;
  overflow-x: auto;
  border-radius: 0.25rem;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 0.5rem;
  font-size: 0.75rem;
  line-height: 1rem;
  color: #a3a3a3;
`

export const EmptyState = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: #737373;
`

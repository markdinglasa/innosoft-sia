import styled from 'styled-components'
import { colors } from '@shared/styles'

export const Container = styled.div<{ online: boolean; syncing: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  background: ${(({ online, syncing }) => {
    if (syncing) return colors.palette.blue[500]
    return online ? colors.palette.green[500] : colors.palette.red[500]
  })};
  
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`

export const IconWrapper = styled.div<{ spinning?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  animation: ${props => props.spinning ? 'spin 2s linear infinite' : 'none'};
`

export const Text = styled.span`
  white-space: nowrap;
`

export const ProgressInfo = styled.div`
  font-size: 11px;
  opacity: 0.9;
  font-weight: 400;
`

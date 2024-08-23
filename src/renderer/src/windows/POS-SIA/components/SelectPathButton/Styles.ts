import UIcon from '@mdi/react'
import { Button } from '@shared/components'
import { colors } from '@shared/styles'
import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const UButton = styled(Button)`
  cursor: pointer;
  width: 100%;
`

export const PathDisplay = styled.div`
  width: 100%;
  margin-top: 10px;
  font-size: 14px;
  color: ${colors.palette.neutral['400']};
  word-break: break-all;
  overflow:hidden;
  display:flex;
  justify-content: start;
`
export const Span = styled.span`
  color: ${colors.palette.neutral['400']};
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: start;
  margin-left: 10px;
 `
 export const Text = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: start;
  margin-bottom: 10px;
 `
 export const Icon = styled(UIcon)`
 color: ${colors.palette.neutral['400']};
 `
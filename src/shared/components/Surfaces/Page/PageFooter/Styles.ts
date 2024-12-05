import { colors } from '@shared/styles'
import styled from 'styled-components'
export const Container = styled.div`
  width: 100%;
  min-height: 30px;
  padding: 0px 0px;
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`
export const Span = styled.span`
  color: ${colors.palette.neutral['400']};
  font-size: 13px;
`

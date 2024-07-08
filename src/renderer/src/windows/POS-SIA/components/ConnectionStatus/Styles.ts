import { colors } from '@shared/styles'
import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  color: ${colors.primary};
  background: ${colors.palette.green[300]};
  font-weight: 500;
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 5px 5px;
  margin-bottom: 10px;
  border-radius: 8px;
`

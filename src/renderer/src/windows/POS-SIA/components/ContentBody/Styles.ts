import { colors } from '@shared/styles'
import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  height: calc(100% - 120px);
  background: ${colors.white};
  border-radius: 6px;
  margin-bottom: 10px;
  align-items: center;
  display: flex;
  justify-content: center;
`

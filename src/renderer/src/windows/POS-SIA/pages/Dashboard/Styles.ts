import { colors } from '@shared/styles'
import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-center;
  background: ${colors.palette.gray[100]};
  padding: 10px 10px;
`

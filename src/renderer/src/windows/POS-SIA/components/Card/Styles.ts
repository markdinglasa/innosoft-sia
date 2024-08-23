import { colors } from '@shared/styles'
import styled from 'styled-components'
export const Container = styled.div`
  background: ${colors.primary};
  width: 100%;
  border-radius: 8px;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 10px 14px;
`
export const Content = styled.div`
  margin-top: 10px;
`
export const Heading = styled.div`
  color: ${colors.white} ;
  font-size: 13px;
  font-weight: bolder;
`

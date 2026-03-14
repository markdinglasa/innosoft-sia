import { colors } from '@shared/styles'
import styled from 'styled-components'
export const Container = styled.div`
  background: ${colors.secondary};
  width: 100%;
  border-radius: 0.8rem;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 1rem 1.4rem;
`
export const Content = styled.div`
  margin-top: 1.2rem;
`
export const Heading = styled.div`
  color: ${colors.primary};
  font-size: 1.3rem;
  font-weight: bolder;
`

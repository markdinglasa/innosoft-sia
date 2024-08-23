import { colors } from '@shared/styles'
import styled from 'styled-components'

export const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  background: ${colors.palette.neutral['075']};
  flex-direction: column;
  overflow:hidden;
`
export const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
`
export const Header = styled.div`
  height: 2rem;
  width: 100%;
  background: red;
`
export const Body = styled.div`
  width: 100%;
  padding: 10px 10px;
`
export const Footer = styled.div`
  height: 70px;
`
export const Card = styled.div`
  padding: 10px 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0px;
  }
`
export const Title = styled.div`
  height: 50px;
  border-radius: 8px;
  align-items: center;
  display: flex;
  justify-content: center;
`
export const H2 = styled.h2`
  color: ${colors.primary};
`
export const Filler = styled.div`
  height: 2rem !important;
  width:100%;
`
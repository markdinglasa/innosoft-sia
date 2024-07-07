import { colors } from '@shared/styles'
import styled from 'styled-components'

export const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  background: #0e2036;
  flex-direction: column;
`
export const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
`
export const Header = styled.div`
  height: 40px;
  width: 100%;
  background: red;
`
export const Body = styled.div`
  width: 100%;
  height: 790px;
  padding: 10px 10px;
`

export const Footer = styled.div`
  height: 70px;
  background: orange;
`

export const Configuration = styled.div`
  height: 130px;
  padding: 10px 10px;
  background: ${colors.palette.gray[500]};
  border-radius: 10px;
  margin-bottom: 10px;
`
export const Title = styled.div`
  height: 50px;
  border-radius: 8px;
  align-items: center;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`
export const H2 = styled.h2`
  color: ${colors.palette.gray[300]};
`

import { colors } from '@shared/styles'
import styled from 'styled-components'
export const Container = styled.div`
  height: 80px;
  width: 100%;
  background: #566272;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`
export const LogoContainer = styled.div`
  width: 20%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`
export const TextContainer = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  padding: 10px 5px;
`
export const Image = styled.img`
  height: 75px;
  width: 75px;
`
export const Span = styled.span`
  color: ${colors.palette.gray[200]};
`

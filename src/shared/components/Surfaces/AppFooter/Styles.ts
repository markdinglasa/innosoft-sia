import { colors } from '@shared/styles'
import styled from 'styled-components'
export const Container = styled.div`
  height: 60px;
  width: 100%;
  background: #566272;
  padding: 5px 10px;
  display: flex;
  flex-direction: row;
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
  justify-content: center;
`
export const Image = styled.img`
  height: 75px;
  width: 75px;
`
export const Span = styled.span`
  font-size: 12px;
  color: ${colors.palette.gray[200]};
`

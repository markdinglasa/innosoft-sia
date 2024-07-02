import { Button as UButton } from '@shared/components'
import styled from 'styled-components'
import { colors } from '../../styles'

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.palette.neutral['050']};
`

export const H1 = styled.h1`
  font-size: 50px;
  color: ${colors.primary};
  align-items: center;
  display: flex;
  justify-content: end;
  width: 100%;
`
export const SpanH1 = styled.span`
  color: ${colors.red};
`
export const SpanSub = styled.span`
  font-size: 25px;
  align-items: center;
  display: flex;
  justify-content: end;
  width: 100%;
  padding: 0;
  text-align: right;
`

export const Left = styled.div`
  padding: 10px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  width: 35%;
`

export const Right = styled.div`
  padding: 10px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40%;
`

export const LoginCon = styled.div`
  background: #fff;
  box-shadow: 0 4px 12px rgb(0 0 0 / 13%);
  width: 400px;
  height: 370px;
  border-radius: 10px;
  padding: 20px 20px;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const LoginConTitle = styled.div``

export const LoginConBody = styled.div`
  padding-bottom: 30px;
  border-bottom: 1px solid gray;
  width: 100%;
`

export const LoginConFooter = styled.div`
  padding: 10px 10px;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`

export const Button = styled(UButton)`
  width: 100%;
`

export const Span = styled.span``

import styled from 'styled-components'

export const Container = styled.div`
  background: #fff;
  width: 280px;
  height: 100%;
  padding: 10px;
  flex-direction: column;
  display: flex;
  item-align: start;
  justify-content: center;
`
export const Div = styled.div`
  flex-direction: column;
  display: flex;
  item-align: start;
  justify-content: center;
  text-align: center;
`
export const TextNormal = styled.span`
  font-size: 11px;
  color: #000;
  width: 100%;
`
export const TextSmall = styled.span`
  font-size: 9px;
  color: #000;
`
export const DivBorderTop = styled.div`
  border-top: 1px solid #000;
  flex-direction: column;
  display: flex;
  item-align: start;
  justify-content: center;
  text-align: center;
  padding: 5px 5px;
`
export const DivBetween = styled.div`
  flex-direction: row;
  display: flex;
  item-align: start;
  justify-content: between;
  text-align: end;
  width: 100%;
`

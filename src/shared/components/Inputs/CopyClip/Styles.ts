import { colors } from '@shared/styles'
import { Theme } from '@shared/types'
import styled from 'styled-components'
import { Button as btn } from '../Button'
export const Container = styled.div`
  align-items: left;
  display: flex;
  justify-content: start;
  hieght: 60px;
  flex-direction: column;
`

export const ButtonCon = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 5px;
`

export const Input = styled.input<{ theme: Theme }>`
  width: 100%;
  heigth: 55px;
  background-color: ${({ theme }) => {
    if (theme === Theme.dark) {
      return colors.palette.neutral['100']
    }
    return colors.palette.black['300']
  }};
  border-radius: 4px;
  color: ${({ theme }) => {
    if (theme === Theme.dark) {
      return colors.palette.gray['75']
    }
    return colors.primary
  }};
  outline: none;
  border: none;
  padding: 10px 10px;
  margin-bottom: 20px;
  &:focus {
    outline: none;
  }
`

export const Label = styled.div<{ theme: Theme }>`
  color: ${({ theme }) => {
    if (theme === Theme.dark) {
      return colors.palette.gray['100']
    }
    return colors.primary
  }};
  font-size: 12px;
  font-weight: 700;
`

export const Button = styled(btn)<{ theme: Theme }>`
  heigth: 30px !important;
  align-items: center;
  display: flex;
  justify-content: center;
  text-align: center;
  color: ${colors.palette.neutral['100']};
  transition: all 0.3s;
  background: none;
  &:hover &:active &:focus {
    background: ${colors.pink};
  }
`

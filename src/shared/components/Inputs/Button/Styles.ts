import UIcon from '@mdi/react'
import styled, { css } from 'styled-components'

import { colors } from '@shared/styles'
import { ButtonColor } from '@shared/types'

const BUTTON_HEIGHT = 3.6

const blueMixin = css`
  background-color: ${colors.secondary};
  color: ${colors.primary};
  &:hover {
    background: ${colors.pink};
  }
`

const grayMixin = css`
  background-color: ${colors.palette.blue['200']};
  color: ${colors.primary};

  &:hover {
    background: ${colors.palette.blue['300']};
  }
`

const redMixin = css`
  background-color: ${colors.palette.red['200']};
  &:hover {
    background: ${colors.palette.red['300']};
  }
`
const greenMixin = css`
  background-color: ${colors.palette.green['300']};
  &:hover {
    background: ${colors.palette.green['400']};
  }
`
const disabledMixin = css`
  background: ${colors.palette.black['200']};
  color: #fff;
  cursor: not-allowed;
  opacity: 0.65;
  transition: 0.3s ease-in-out;
  &:hover {
    background: ${colors.palette.black['100']};
  }
`

const hasIconMixin = css`
  align-items: center;
  border-radius: 0.6rem;
  display: flex;
  width: auto;
`

export const Button = styled.button<{ $color?: ButtonColor; hasIcon: boolean }>`
  background: ${colors.palette.blue['200']};
  border-radius: ${`${BUTTON_HEIGHT / 2}rem`};
  border: 0.1rem solid transparent;
  color: ${colors.primary};
  cursor: pointer;
  display: block;
  height: ${`${BUTTON_HEIGHT}rem`};
  padding: 0 1.2rem;
  transition: 0.3s ease-in-out;

  &:hover {
    background: ${colors.palette.blue['300']};
  }

  ${({ $color }) => {
    if ($color === ButtonColor.blue) return blueMixin
    if ($color === ButtonColor.gray) return grayMixin
    if ($color === ButtonColor.red) return redMixin
    if ($color === ButtonColor.green) return greenMixin
    return ''
  }}

  ${({ disabled }) => disabled && disabledMixin}

  ${({ hasIcon }) => hasIcon && hasIconMixin}
`

export const IconLeft = styled(UIcon)`
  margin-right: 0.6rem;
`

export const IconRight = styled(UIcon)`
  margin-left: 0.6rem;
`

import { Loader } from '@shared/components'
import { ButtonColor, ButtonType, SFC } from '@shared/types'
import React from 'react'
import * as S from './Styles'

export interface ButtonProps {
  color?: ButtonColor
  dirty?: boolean
  disabled?: boolean
  iconLeft?: string
  iconRight?: string
  isSubmitting?: boolean
  isValid?: boolean
  onClick?(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void
  text: string
  type?: ButtonType
}

export const Button: SFC<ButtonProps> = ({
  color,
  className,
  iconLeft,
  iconRight,
  isSubmitting = false,
  onClick,
  text,
  type = ButtonType.button
}) => {
  const renderButtonContent = () => (
    <>
      {iconLeft ? <S.IconLeft path={iconLeft} size="20px" /> : null}
      {text}
      {iconRight ? <S.IconRight path={iconRight} size="18px" /> : null}
    </>
  )

  return (
    <S.Button
      $color={color}
      className={className}
      //disabled={buttonIsDisabled}
      hasIcon={!!iconLeft || !!iconRight}
      onClick={onClick}
      type={type}
    >
      {type === ButtonType.submit && isSubmitting ? <Loader size={12} /> : renderButtonContent()}
    </S.Button>
  )
}

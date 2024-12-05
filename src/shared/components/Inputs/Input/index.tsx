import { SFC, Theme } from '@shared/types'
import * as S from './Styles'

export interface InputProps {
  errors: { [field: string]: string }
  label: string
  name: string
  touched: { [field: string]: boolean }
  type?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  theme?: Theme
}

export const Input: SFC<InputProps> = ({
  theme,
  className,
  errors,
  label,
  name,
  touched,
  type = 'text',
  value,
  onChange
}) => {
  return (
    <>
      <S.Label theme={theme}> {label}</S.Label>
      <S.Field
        $error={errors[name] && touched[name]}
        className={className}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        theme={theme}
      />
      <S.SecondaryContainer>
        {errors[name] && touched[name] ? <S.ErrorMessage>{errors[name]}</S.ErrorMessage> : null}
      </S.SecondaryContainer>
    </>
  )
}

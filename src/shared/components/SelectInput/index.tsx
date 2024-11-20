import { SFC } from '@shared/types'
import * as S from './Styles'

export interface SelectInputProps {
  errors: { [field: string]: string }
  label: string
  name: string
  touched: { [field: string]: boolean }
  options: Array<{ value: string; label: string }>
}

export const SelectInput: SFC<SelectInputProps> = ({
  className,
  errors,
  label,
  name,
  touched,
  options
}) => {
  return (
    <>
      <S.Label htmlFor={name}>{label}</S.Label>
      <S.Field name={name} className={className}>
        {({ field }: any) => (
          <>
            <S.Field {...field} as="select" $error={errors[name] && touched[name]}>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </S.Field>
            <S.SecondaryContainer>
              {errors[name] && touched[name] ? (
                <S.ErrorMessage>{errors[name]}</S.ErrorMessage>
              ) : null}
            </S.SecondaryContainer>
          </>
        )}
      </S.Field>
    </>
  )
}

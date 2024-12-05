import { GenericFunction, SFC } from '@shared/types'
import * as S from './Styles'

export interface SelectInputProps {
  errors?: { [field: string]: string }
  label: string
  name: string
  touched?: { [field: string]: boolean }
  options: Array<{ value: string; label: string }>
  onChange?: GenericFunction
  value?: any
  disabled?: boolean
}

export const SelectInput: SFC<SelectInputProps> = ({
  className,
  errors,
  label,
  name,
  touched,
  options,
  disabled
}) => {
  return (
    <>
      <S.Label htmlFor={name}>{label}</S.Label>
      <S.Field name={name} className={className}>
        {({ field }: any) => (
          <>
            <S.Field
              {...field}
              as="select"
              $error={errors && touched && errors[name] && touched[name]}
              disabled={disabled}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </S.Field>
            <S.SecondaryContainer>
              {errors && touched && errors[name] && touched[name] ? (
                <S.ErrorMessage>{errors[name]}</S.ErrorMessage>
              ) : null}
            </S.SecondaryContainer>
          </>
        )}
      </S.Field>
    </>
  )
}

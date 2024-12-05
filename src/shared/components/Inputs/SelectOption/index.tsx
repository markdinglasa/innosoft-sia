import { SFC } from '@shared/types'
import { SelectInputProps } from '../SelectInput'
import * as S from './Styles'

export const SelectOption: SFC<SelectInputProps> = ({
  className,
  label,
  name,
  options,
  value,
  disabled,
  onChange
}) => {
  return (
    <>
      <S.Label htmlFor={name}>{label}</S.Label>
      <S.Field
        name={name}
        className={className}
        onChange={onChange}
        value={value}
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </S.Field>
    </>
  )
}

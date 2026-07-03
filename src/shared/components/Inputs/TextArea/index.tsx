import styled from 'styled-components'
import { colors } from '../../../styles'
import { GenericFunction, SFC } from '../../../types'

interface TextAreaProps {
  placeholder?: string
  onChange?: GenericFunction
  onBlur?: GenericFunction
  name: string
  style?: string
  disabled?: boolean
  label?: string
  value?: string
  touched?: { [field: string]: boolean }
  errors?: { [field: string]: string }
}

export const STextArea = styled.textarea`
  display: block;
  padding: 1rem 1.4rem;
  margin-top: 0.4rem;
  width: 100%;
  height: 13rem;
  resize: none;
  border-radius: 0.4rem;
  outline: none;
  transition: all 0.3s;
  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    border-bottom: 0.15rem solid ${colors.primary};
  }
`

export const TextArea: SFC<TextAreaProps> = ({
  className,
  placeholder,
  onChange,
  onBlur,
  name,
  disabled,
  style,
  label,
  value,
  touched,
  errors
}) => {
  // console.log("errors", errors && errors[name]);
  return (
    <>
      <div className={className}>
        {label && <label style={{ paddingBottom: '0.8rem', fontSize: '1.1rem' }}>{label}</label>}
        <STextArea
          className={style}
          placeholder={placeholder}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          value={value}
        />

        {errors && touched && errors[name] && touched[name] ? (
          <div className="px-2">
            <span className="text-[1.2rem] text-red-500">{errors[name]}</span>
          </div>
        ) : null}
      </div>
    </>
  )
}
export default TextArea

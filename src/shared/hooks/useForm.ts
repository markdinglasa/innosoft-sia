import { useState } from 'react'

export const useForm = (initialValues: any, validate: (values: any) => any) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues({
      ...values,
      [name]: value
    })
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target
    setTouched({
      ...touched,
      [name]: true
    })
    const validationErrors = validate(values)
    setErrors(validationErrors)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, callback: () => void) => {
    e.preventDefault()
    const validationErrors = validate(values)
    setErrors(validationErrors)
    setTouched(
      Object.keys(values).reduce((acc, key) => {
        acc[key] = true
        return acc
      }, {} as any)
    )
    if (Object.keys(validationErrors).length === 0) {
      callback()
    }
  }

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit
  }
}

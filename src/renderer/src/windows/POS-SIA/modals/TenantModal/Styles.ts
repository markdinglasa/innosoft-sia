import { Button as UButton, Pager as UPager } from '@shared/components'
import { Form as F } from 'formik'
import styled from 'styled-components'
export const UModal = styled(UPager)`
  display: flex;
  flex-direction: column;
`
export const Button = styled(UButton)`
  width: 100%;
  margin-bottom: 10px;
`
export const Form = styled(F)`
  height:500px;
  overflow: auto;
  padding:20px;
`
export const FormControl = styled.div`
  display:flex;
  align-items: center;
  width:100%;
  padding: 0px;
  gap:10px;
`
export const FormInput = styled.div`
  width:100%;
  padding: 0px;
`
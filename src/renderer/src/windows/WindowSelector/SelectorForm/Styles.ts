import { Button as btn } from '@shared/components'
import styled from 'styled-components'

export const Container = styled.div`
    width:400px;
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap:10px;
`
export const Button = styled(btn)`
    width: 100%;
    font-weight: 600;
`
export const FormInput = styled.div`
    width:100%;
`
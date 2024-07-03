import { SFC } from '@shared/types'
import * as S from './Styles'

export const Header: SFC = ({className}) =>{
    return (<>
        <S.Container className={className}>
            Header
        </S.Container>
    </>)
}
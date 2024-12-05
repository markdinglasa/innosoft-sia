import { SFC } from '@shared/types'
import { ReactNode } from 'react'
import * as S from './Styles'
interface PageBodyProps{
    children: ReactNode
}
export const PageBody: SFC<PageBodyProps> = ({className, children}) => {
    return(
        <>
            <S.Container className={className}>
               {children}
            </S.Container>
        </>
    )
}
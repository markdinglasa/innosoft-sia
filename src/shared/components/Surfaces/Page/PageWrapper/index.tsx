import { SFC } from '@shared/types'
import { ReactNode } from 'react'
import * as S from './Styles'
interface PageWrapperProps {
    children: ReactNode
}
export const PageWrapper: SFC<PageWrapperProps>= ({className, children}) => {
    return(
        <>
            <S.Container className={className}>
                {children}
            </S.Container>
        </>
    )
}
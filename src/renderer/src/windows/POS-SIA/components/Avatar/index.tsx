
import defaultAvatar from '@shared/assets/default-avatar.png'
import { SFC } from '@shared/types'
import * as S from './Styles'
export const Avatar : SFC = () => {
    return (
        <>
            <S.Container>
                <S.Image src= {defaultAvatar} />
            </S.Container>
        </>
    )
}
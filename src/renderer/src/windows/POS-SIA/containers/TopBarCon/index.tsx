import { Logo, TopBar } from '@shared/components'
import { SFC } from '@shared/types'
import { Avatar } from '../../components/Avatar'
import * as S from './Styles'

export const TopBarCon: SFC = ({ className }) => {
  return (
    <>
    <TopBar className={className}>
        <S.Container style={{'height':'50px'}}>
           <S.Logo> 
              <Logo/>
           </S.Logo>
           <S.Util>
              <Avatar/>
           </S.Util>
        </S.Container>
    </TopBar>
    </>
  )
}

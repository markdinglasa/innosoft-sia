import { Splash } from '@shared/components'
import { SFC } from '@shared/types'
import * as S from './Styles'
export const LoadingScreen: SFC = () => {
  return (
    <>
      <S.Container>
        <Splash message="Please wait..." />
      </S.Container>
    </>
  )
}

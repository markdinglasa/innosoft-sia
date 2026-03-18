import { Splash } from '@shared/components'
import { SFC } from '@shared/types'
import * as S from './Styles'
export const LoadingScreen: SFC<{ message?: string }> = ({ message = 'Please wait...' }) => {
  return (
    <>
      <S.Container>
        <Splash message={message} />
      </S.Container>
    </>
  )
}

import { mdiPlay } from '@mdi/js'
import { ButtonColor, GenericFunction, SFC } from '@shared/types'
import { memo } from 'react'
import * as S from './Styles'

interface AllianceTenant {
  generate: GenericFunction
}

export const AllianceTenant: SFC<AllianceTenant> = memo(({ generate }) => {
  return (
    <>
      <S.Container>
        <S.Content>
          <S.FormControl>
            <S.Button
              onClick={generate}
              iconLeft={mdiPlay}
              text="Generate"
              color={ButtonColor.blue}
            />
          </S.FormControl>
        </S.Content>
      </S.Container>
    </>
  )
})

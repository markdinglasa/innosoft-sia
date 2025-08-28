import { mdiPause, mdiPlay, mdiRestart } from '@mdi/js'
import { ButtonColor, GenericFunction, SFC } from '@shared/types'
import { memo } from 'react'
import { AccessControl } from '../AccessControl'
import * as S from './Styles'

interface SMTenant {
  pause: GenericFunction
  reStart: GenericFunction
  start: GenericFunction
  isStarted: boolean
}

export const SMTenant: SFC<SMTenant> = memo(({ pause, reStart, start, isStarted = false }) => {
  return (
    <>
      <S.Container>
        <AccessControl condition={isStarted}>
          <S.FormControl>
            <S.FormControl>
              <S.Button
                onClick={pause}
                iconLeft={mdiPause}
                text="Pause"
                color={ButtonColor.green}
              />
            </S.FormControl>
            <S.FormControl>
              <S.Button
                onClick={reStart}
                iconLeft={mdiRestart}
                text="Restart"
                color={ButtonColor.blue}
              />
            </S.FormControl>
          </S.FormControl>
        </AccessControl>
        <AccessControl condition={!isStarted}>
          <S.FormControl>
            <S.Button onClick={start} iconLeft={mdiPlay} text="Start" color={ButtonColor.blue} />
          </S.FormControl>
        </AccessControl>
      </S.Container>
    </>
  )
})

import { mdiPlay } from '@mdi/js'
import { AppDispatch, ButtonColor, GenericFunction, SFC } from '@shared/types'
import { formatDates } from '@shared/utils'
import { memo } from 'react'
import { useDispatch } from 'react-redux'
import { setDateEnd, setDateStart } from '../../store/settings'
import * as S from './Styles'

interface DateRange {
  data: {
    DateStart: Date
    DateEnd: Date
  }
  isInitialized: boolean
  handleGenerate: GenericFunction
}

export const DateRange: SFC<DateRange> = memo(({ data, isInitialized, handleGenerate }) => {
  const dispatch = useDispatch<AppDispatch>()

  return (
    <>
      <S.Container>
        <S.Content>
          <S.FormControl>
            <S.Label>Date Start</S.Label>
            <S.InputDate
              type="date"
              name="datestart"
              value={formatDates(data.DateStart ?? new Date())}
              onChange={(e) => dispatch(setDateStart(new Date(e.target.value).toString()))}
              disabled={isInitialized}
            />
          </S.FormControl>
          <S.FormControl>
            <S.Label>Date End</S.Label>
            <S.InputDate
              type="date"
              name="dateend"
              value={formatDates(data.DateEnd ?? new Date())}
              onChange={(e) => dispatch(setDateEnd(new Date(e.target.value).toString()))}
              disabled={isInitialized}
            />
          </S.FormControl>
        </S.Content>
        <S.FormControl>
          <S.Button
            onClick={handleGenerate}
            iconLeft={mdiPlay}
            text="Generate"
            color={ButtonColor.blue}
          />
        </S.FormControl>
      </S.Container>
    </>
  )
})

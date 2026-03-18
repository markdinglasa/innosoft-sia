import { AppDispatch, ButtonColor, SFC } from '@shared/types'
import { formatDates } from '@shared/utils'
import { memo } from 'react'
import { useDispatch } from 'react-redux'
import { setDates } from '../../store/manager'
import * as S from './Styles'

interface SingleDate {
  data: Date
  isInitialized: boolean
}

export const SingleDate: SFC<SingleDate> = memo(({ data, isInitialized }) => {
  const dispatch = useDispatch<AppDispatch>()

  return (
    <>
      <S.Container>
        <S.FormControl>
          <S.InputDate
            type="date"
            name="dates"
            value={formatDates(data ?? new Date())}
            onChange={(e) => dispatch(setDates(new Date(e.target.value).toString()))}
            disabled={isInitialized}
          />
        </S.FormControl>
        <S.FormControl>
          <S.Button
            onClick={() => dispatch(setDates(null))}
            text="System Date"
            color={ButtonColor.blue}
            disabled={isInitialized}
          />
        </S.FormControl>
      </S.Container>
    </>
  )
})

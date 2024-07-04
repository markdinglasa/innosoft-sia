import { colors } from '@shared/styles'
import { SFC } from '@shared/types'
import { ReactNode } from 'react'
import * as S from './Styles'

export interface ContentHeaderProps {
  Icon?: string
  Title?: string
  BreadCrumbs?: ReactNode
}

export const ContentHeader: SFC<ContentHeaderProps> = ({ className, Icon, Title, BreadCrumbs }) => {
  const renderTitle = () => {
    return (
      <>
        {Icon ? <S.Icon color={colors.primary} path={Icon} size="25px" /> : null}
        {<S.Title>{Title}</S.Title>}
      </>
    )
  }

  return (
    <>
      <S.Container className={className}>
        <S.Left> {renderTitle()}</S.Left>
        <S.Right> {BreadCrumbs}</S.Right>
      </S.Container>
    </>
  )
}

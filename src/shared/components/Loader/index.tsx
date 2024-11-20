import { SFC } from '@shared/types'
import { IconProps } from '../Icon'
import * as S from './Styles'

type LoaderProps = Pick<IconProps, 'size'>

export const Loader: SFC<LoaderProps> = ({ className, size }) => {
  return (
    <S.Container className={className}>
      <S.LoadingIcon size={size} totalSize="unset" />
    </S.Container>
  )
}

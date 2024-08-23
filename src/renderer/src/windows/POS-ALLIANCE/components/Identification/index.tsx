import { SFC } from '@shared/types'
import * as S from './Styles'

export interface IdentificationProps {
  bottomText: string
  displayImage: string
  topText: string
}

export const Identification: SFC<IdentificationProps> = ({
  bottomText,
  className,
  displayImage,
  topText
}) => {
  return (
    <S.Container className={className}>
      <S.Icon path={displayImage} />
      <S.Text>
        <S.TopText>{topText}</S.TopText>
        <S.BottomText>{bottomText}</S.BottomText>
      </S.Text>
    </S.Container>
  )
}

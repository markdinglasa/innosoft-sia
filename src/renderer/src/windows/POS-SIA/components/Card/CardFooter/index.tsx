
import { SFC } from '@shared/types';
import * as S from './Styles';

export interface CardHeaderProps {
    icon: string;
    title: string;
}

export const CardHeader: SFC<CardHeaderProps> = ({className, icon, title}) => {
    return (
        <>
            <S.Container className={className}>
                <S.Icon path={icon} size="40px"/>
                <S.CardTitle> {title} </S.CardTitle>
            </S.Container>
        </>
    );
}
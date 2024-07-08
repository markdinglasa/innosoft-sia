import { SFC } from '@shared/types';
import * as S from './Styles';

export interface InputProps {
  errors: {[field: string]: string};
  label: string;
  name: string;
  touched: {[field: string]: boolean};
  type?: string;
  value?:string;
}

export const Input: SFC<InputProps> = ({className, errors, label, name, touched, type = 'text', value}) => {
  return (
    <>
      <S.Label>{label}</S.Label>
      <S.Field $error={errors[name] && touched[name]} className={className} name={name} type={type} value={value} />
      <S.SecondaryContainer>
        {errors[name] && touched[name] ? <S.ErrorMessage>{errors[name]}</S.ErrorMessage> : null}
      </S.SecondaryContainer>
    </>
  );
};
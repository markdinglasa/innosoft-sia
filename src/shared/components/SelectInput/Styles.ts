import { colors } from '@shared/styles';
import { Field as UField } from 'formik';
import styled from 'styled-components';

export const ErrorMessage = styled.div`
  color: ${colors.palette.red['500']};
  font-size: 10px;
  margin-top: 6px;
`;

export const Field = styled(UField)`
  background: ${colors.palette.neutral['075']};
  border-radius: 3px;
  border: 1px solid ${({ $error }) => ($error ? colors.palette.red['500'] : 'transparent')};
  display: block;
  height: 40px;
  padding: 10px 14px;
  width: 100%;

  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const Label = styled.label`
  font-size: 10px;
  margin-bottom: 8px;
  color: ${colors.primary};
`;

export const SecondaryContainer = styled.div`
  margin-bottom: 32px;
`;

export const Option = styled.option`
  background-color: ${colors.palette.neutral['050']}; /* Example background color */
  color: ${colors.primary}; /* Example text color */
  padding: 10px; /* Example padding */
  height: 40px;
  width: 100px;
  padding: 10px 10px;
  transition: all 0.3s
  & {
    background: ${colors.pink}
  }
`


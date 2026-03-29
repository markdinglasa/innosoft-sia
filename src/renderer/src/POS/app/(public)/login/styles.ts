import styled from 'styled-components';

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--default);

  @media (max-width: 1050px) {
    flex-direction: column;
  }
`;
export const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  gap: 1rem;

  @media (min-width: 768px) {
    width: 90vw;
    flex-direction: row;
    gap: 5rem;
    justify-content: flex-end;
    align-items: center;
  }
`;
export const Title = styled.h1`
  font-size: 50px;
  color: var(--primary);
  align-items: center;
  display: flex;
  justify-content: end;
  width: 100%;
  text-transform: uppercase;
  font-weight: 550;

  @media (max-width: 1050px) {
    justify-content: center;
    display: flex;
    text-align: center;
    align-items: center;
  }
`;
export const SubTitle = styled.span`
  font-size: 25px;
  align-items: center;
  display: flex;
  justify-content: end;
  width: 100%;
  font-weight: 500;
  padding: 0;
  text-align: right;
  @media (max-width: 1050px) {
    justify-content: center;
    display: flex;
    text-align: center;
    align-items: center;
  }
`;
export const Footer = styled.div`
  width: 100%;
`;
export const Banner = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  align-items: center;

  @media (max-width: 768px) {
    justify-content: flex-end;
  }
`;
export const Right = styled.div`
  width: 100%;

  @media (min-width: 768) {
    width: 50%;
  }
`;
export const Card = styled.div`
  background: #fff;
  box-shadow: 0 4px 12px rgb(0 0 0 / 13%);
  border-radius: 10px;
  padding: 20px 20px;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;

  @media (min-width: 768px) {
    width: 30rem;
  }
`;
export const LoginConTitle = styled.div``;
export const CardBody = styled.div`
  padding-bottom: 10px;
  width: 100%;
`;
export const ErrorMessage = styled.div`
  width: 100%;
  padding: 1rem;
  border: 1px solid #ed5f74;
  background: #fde2dd;
  color: #ed5f74;
  text-align: center;
  align-items: center;
  justify-content: center;
  display: flex;
  margin-bottom: 1rem;
  font-size: 14px;
  border-radius: 0.375rem;
  font-weight: 500;
`;
export const FormContent = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;
export const FormControl = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
`;
export const FormHeader = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-between: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;
export const FormInput = styled.div`
  width: 100%;
`;
export const Text = styled.span`
  font-size: 14px;
  color: var(--primary);
  cursor: pointer;
`;
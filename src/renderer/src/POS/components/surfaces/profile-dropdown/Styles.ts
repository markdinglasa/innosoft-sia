import styled from "styled-components";

export const Dropdown = styled.div`
  position: absolute;
  right: 0;
  margin-top: 0.5rem;
  width: 16rem;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  z-index: 50;
`;

export const DropdownItem = styled.div`
  cursor: pointer;
  color: #4a5568;
  border-radius: 0.5rem;
  &:hover {
    background-color: #f7fafc;
  }
`;

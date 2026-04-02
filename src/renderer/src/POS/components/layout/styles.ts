import styled from 'styled-components';

export const Container = styled.div`
  height: 100vh;
  position: relative;
  overflow: hidden;
  width: 20rem;
  background: var(--primary);
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
`;
export const Image = styled.img`
  width: 50%;
  padding-bottom: 0.5rem;
  @media (min-width: 768px) {
    width: 100%;
  }
`;
export const Nav = styled.nav<{
  $isSidebarOpen: boolean;
}>`
  display: flex;
  align-items: start;
  justify-content: center;
  transition: width 0.3s ease-in-out;
  width: 100%;
  transition: margin-left 0.3s ease-in-out;

  display: ${({ $isSidebarOpen }) => ($isSidebarOpen ? 'block' : 'none')};
`;

export const Logo = styled.div`
  display: flex;
  width:100%;
  justify-content: center;
  align-items: center;
  height: 3.5rem;
  padding: 8px;
  cursor: pointer;
  margin-top: 0.5rem;
`;
export const MenuContainer = styled.div`
  height: 100%;
  overflow: auto;
  width: 100%;
  scrollbar-width: thin;
  scrollbar-color: #888 #14263e;
  padding: 1rem;
`;
export const MenuContent = styled.div<{ $isCollapse: boolean }>`
  display: flex;
  flex-direction: column;
  ${({ $isCollapse }) =>
    $isCollapse
      ? `
      gap:8px;
    `
      : ''}
`;
export const Category = styled.span`
  padding: 8px;
  text-transform: uppercase;
  color: rgb(226 232 240);
  font-size: 11px !important;
`;
export const HR = styled.hr`
  margin-bottom: 8px;
`;

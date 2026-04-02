import { Backdrop, Box, styled } from '@mui/material'
import { useToggle } from "@shared/hooks"
import { FC, memo, ReactNode } from 'react'
import { Footer } from './footer'
import { Header } from './header'
import { SideNav } from "./sidebar"
import { Nav } from "./styles"
interface POSLayoutProps {
  children: ReactNode
}

const LayoutWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  width: '100vw',
  flexDirection: 'column',
  gridTemplateAreas: `
    "header header"
    "main sidebar"
    "footer footer"
  `,
  gridTemplateColumns: '1fr 400px',
  gridTemplateRows: '64px 1fr 3rem',
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down('lg')]: {
    gridTemplateAreas: `
      "header"
      "main"
      "footer"
    `,
    gridTemplateColumns: '1fr',
  },
}))

const MainContent = styled(Box)({
  gridArea: 'main',
  overflowY: 'auto',
  padding: '2rem',
  width:'100vw',
  height:'calc(100vh - 6rem)'
})

export const POSLayout: FC<POSLayoutProps> = memo(({ children }) => {
  //const theme = useTheme()
  //const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const [openSidebar, toggleSidebard] = useToggle(false)

  return (
    <LayoutWrapper>
      <Box gridArea="header" data-testid="pos-header">
        <Header onMenuClick={toggleSidebard} />
      </Box>
      <Box gridArea="main" data-testid="pos-main">
        <Backdrop
          sx={(theme) => ({
            left: 0,
            zIndex: theme.zIndex.drawer + 1,
            transition: 'margin-left 0.3s ease-in-out',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          })}
          open={openSidebar}
          onClick={() => toggleSidebard()}
        >
          <Nav $isSidebarOpen={openSidebar} >
            <SideNav open={openSidebar} toggle={() => toggleSidebard()} />
          </Nav>
        </Backdrop>
        <MainContent>
          {children}
        </MainContent>
      </Box>
      <Box gridArea="footer" data-testid="pos-footer">
        <Footer />
      </Box>
    </LayoutWrapper>
  )
})

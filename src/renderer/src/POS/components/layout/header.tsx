import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PrinterIcon from '@mui/icons-material/Print';
import ScannerIcon from '@mui/icons-material/QrCodeScanner';
import { AppBar, Chip, Stack, Toolbar, Typography, styled } from '@mui/material';
import { colors } from "@shared/styles";
import { ButtonColor, ButtonType } from "@shared/types";
import { FC } from 'react';
import { useSelector } from 'react-redux';
import CircleButton from "../inputs/circle-button";
import ProfileDropdown from "../surfaces/profile-dropdown/profile-dropdown";

const StyledToolbar = styled(Toolbar)({
    height:'3rem',
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: '#14263E', // Primary color from guidelines
  color: 'white'
})

interface HeaderProps {
    onMenuClick: () => void
}
export const Header: FC<HeaderProps> = (props:HeaderProps) => {
    const { onMenuClick } = props
    const { loginDate } = useSelector((state: any) => state.POS.manager)

    return (
        <AppBar position="static" elevation={0}>
            <StyledToolbar variant="dense">
                <Stack direction="row" spacing={2} alignItems="center">
                    <CircleButton onClick={onMenuClick} icon={<MenuIcon  sx={{fontSize:30}} className="text-white"/>} type={ButtonType.button} color={ButtonColor.blue}/>
                    {/* <img src={logo||''} alt="Innosoft" width={150} height={50} /> */}
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mt:2}}>
                        NUTSHELL
                    </Typography>
                    <Chip 
                        label={`Date: ${loginDate || 'Not Set'}`} 
                        sx={{fontSize:'0.9rem', height:30,padding:0, color: 'white', borderColor: 'rgba(255,255,255,0.2)' }} 
                        variant="outlined" 
                    />
                </Stack>
                <Stack direction="row" spacing={3} alignItems="center">
                    {/* Peripheral Status */}
                    <Stack direction="row" spacing={1.5}>
                        <PrinterIcon sx={{ fontSize: 25, color: colors.secondary }} titleAccess="Printer Online" />
                        <ScannerIcon sx={{ fontSize: 25, color: colors.secondary }} titleAccess="Scanner Ready" />
                        <NotificationsIcon sx={{ fontSize: 25, color: colors.secondary }} titleAccess="Notifications" />
                    </Stack>
                    <ProfileDropdown/> 
                </Stack>
            </StyledToolbar>
        </AppBar>
    )
}

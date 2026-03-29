import CreditCardIcon from '@mui/icons-material/CreditCard'
import DeleteIcon from '@mui/icons-material/Delete'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Box, Button, Divider, List, Stack, Typography, styled } from '@mui/material'
import { SystemPermissions } from "@shared/constants/permissions"
import { FC } from 'react'
import { RequirePermission } from "../auth/RequirePermission"

const SidebarWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: '#f8fafd' // theme.palette.secondary.main
})

const OrderListArea = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  padding: '16px',
})

const TotalsArea = styled(Box)(() => ({
  flexShrink: 0,
  padding: '24px',
  backgroundColor: '#fff',
  borderTop: '1px solid rgba(0,0,0,0.1)',
  boxShadow: '0px -4px 10px rgba(0,0,0,0.02)'
}))

export const Sidebar: FC = () => {
  return (
    <SidebarWrapper>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', bgcolor: '#14263E', color: 'white' }}>
        <ShoppingCartIcon sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Current Order</Typography>
      </Box>

      <OrderListArea>
        <List>
          {/* Placeholder for real items */}
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 5, fontSize:'1rem' }}>
             Your cart is empty. Scan items to begin.
          </Typography>
        </List>
      </OrderListArea>

      <Divider />

      <TotalsArea>
        <Stack spacing={1.5} sx={{ mb: 3 }}>
           <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1">Subtotal:</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>₱0.00</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1">Tax (12%):</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>₱0.00</Typography>
          </Stack>
           <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1">Discount:</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>₱0.00</Typography>
          </Stack>
           <Divider sx={{ my: 1 }} />
           <Stack direction="row" justifyContent="space-between">
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Total:</Typography>
            <Typography variant="h5" color="primary" sx={{ fontWeight: 'black' }}>₱0.00</Typography>
          </Stack>
        </Stack>

        <Stack spacing={2}>
          <RequirePermission permissions={SystemPermissions.POS_RETAIL_TENDER}>
            <Button 
              variant="contained" 
              fullWidth 
              size="large"
              startIcon={<CreditCardIcon />}
              sx={{ py: 2, fontSize: '1.2rem', borderRadius: 2 }}
            >
              PROCESS PAYMENT
            </Button>
          </RequirePermission>

          <RequirePermission permissions={SystemPermissions.POS_RETAIL_CANCEL}>
            <Button 
              variant="outlined" 
              fullWidth 
              color="error"
              startIcon={<DeleteIcon />}
              sx={{ py: 1.5, fontSize: '1rem', borderRadius: 2 }}
            >
              VOID TRANSACTION
            </Button>
          </RequirePermission>
        </Stack>
      </TotalsArea>
    </SidebarWrapper>
  )
}

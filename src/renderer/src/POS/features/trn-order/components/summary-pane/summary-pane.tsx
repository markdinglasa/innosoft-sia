import { Box, Button, Divider, Paper, Typography } from '@mui/material'
import React from 'react'
import { Payments as PayIcon, ShoppingCart as OrderIcon } from '@mui/icons-material'
import { useOrderHubStore } from '../../store/use-order-hub-store'

export const SummaryPane: React.FC = () => {
  const { summary, cart, clearCart } = useOrderHubStore()

  const formatCurrency = (amount: number) => {
    return Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        p: 2.5, 
        bgcolor: 'primary.main', 
        color: 'white',
        borderRadius: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <OrderIcon fontSize="small" />
        <Typography variant="h6" fontWeight="bold">Summary</Typography>
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', opacity: 0.9 }}>
          <Typography variant="body2">Subtotal</Typography>
          <Typography variant="body2">{formatCurrency(summary.subtotal)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', opacity: 0.9 }}>
          <Typography variant="body2">Discount</Typography>
          <Typography variant="body2">-{formatCurrency(summary.totalDiscount)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', opacity: 0.9 }}>
          <Typography variant="body2">Taxes (VAT)</Typography>
          <Typography variant="body2">{formatCurrency(summary.totalTax)}</Typography>
        </Box>
        
        <Divider sx={{ my: 1, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="bold">Total Due</Typography>
          <Typography variant="h4" fontWeight="bold">{formatCurrency(summary.totalAmount)}</Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Button 
          fullWidth 
          variant="contained" 
          color="success" 
          size="large"
          startIcon={<PayIcon />}
          disabled={cart.length === 0}
          sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
        >
          Pay Now (F12)
        </Button>
        <Button 
          fullWidth 
          variant="outlined" 
          size="small"
          onClick={clearCart}
          sx={{ color: 'rgba(255, 255, 255, 0.7)', borderColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          Cancel Order
        </Button>
      </Box>
    </Paper>
  )
}

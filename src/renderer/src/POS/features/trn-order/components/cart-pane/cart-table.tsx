import { Add as AddIcon, Delete as DeleteIcon, Remove as RemoveIcon } from '@mui/icons-material'
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import React from 'react'
import { useOrderHubStore } from '../../store/use-order-hub-store'

export const CartTable: React.FC = () => {
  const { cart, updateQuantity, removeItem } = useOrderHubStore()

  const handleUpdateQty = (itemId: number, currentQty: number, delta: number) => {
    const newQty = Math.max(1, currentQty + delta)
    updateQuantity(itemId, newQty)
  }

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ flexGrow: 1, overflow: 'auto' }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Item Description</TableCell>
            <TableCell align="center" width={140}>
              Quantity
            </TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell width={40}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cart.map((item) => (
            <TableRow key={item.itemId} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {item.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.itemCode}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleUpdateQty(item.itemId, item.quantity, -1)}
                    disabled={item.quantity <= 1}
                  >
                    <RemoveIcon fontSize="inherit" />
                  </IconButton>
                  <TextField
                    size="small"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.itemId, parseInt(e.target.value) || 1)}
                    inputProps={{
                      style: { textAlign: 'center', padding: '4px 8px' },
                      type: 'number'
                    }}
                    sx={{ width: 50 }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleUpdateQty(item.itemId, item.quantity, 1)}
                  >
                    <AddIcon fontSize="inherit" />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell align="right">{item.price.toFixed(2)}</TableCell>
              <TableCell align="right">
                <Typography variant="body2" fontWeight="bold">
                  {(item.price * item.quantity).toFixed(2)}
                </Typography>
              </TableCell>
              <TableCell>
                <IconButton size="small" color="error" onClick={() => removeItem(item.itemId)}>
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {cart.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                <Typography variant="body2" color="text.secondary">
                  Your cart is empty. Start by adding items from the catalog.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}


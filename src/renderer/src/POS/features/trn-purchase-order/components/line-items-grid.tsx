import { Delete as DeleteIcon } from '@mui/icons-material'
import {
  Box,
  Button,
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
import { memo } from 'react'
import { usePurchaseOrderFormStore } from '../store/use-purchase-order-form-store'

function LineItemsGrid() {
  const { formData, updateLineItem, removeLineItem } = usePurchaseOrderFormStore()

  const handleAddRow = () => {
    // This would typically open a search modal for items
    // For now, adding a blank row logic
  }

  const calculateSubtotal = (unitCost: number, quantity: number) => unitCost * quantity

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Line Items
        </Typography>
        <Button variant="contained" size="small" onClick={handleAddRow}>
          Add Item
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell width="50">#</TableCell>
              <TableCell>Item Description</TableCell>
              <TableCell width="120" align="right">
                Quantity
              </TableCell>
              <TableCell width="120" align="right">
                Unit Cost
              </TableCell>
              <TableCell width="100" align="right">
                Tax %
              </TableCell>
              <TableCell width="120" align="right">
                Subtotal
              </TableCell>
              <TableCell width="50"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formData.lineItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  No items added yet. Click 'Add Item' to begin.
                </TableCell>
              </TableRow>
            ) : (
              formData.lineItems.map((line, index) => {
                const subtotal = calculateSubtotal(line.unitCost, line.quantity)
                return (
                  <TableRow key={'' + index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {/* Item search/selection will go here */}
                      <Typography variant="body2">
                        {line.description || 'Select Item...'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        type="number"
                        size="small"
                        value={line.quantity}
                        onChange={(e) =>
                          updateLineItem(index, {
                            quantity: Number.parseFloat(e.target.value) || 0
                          })
                        }
                        className="text-right"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        type="number"
                        size="small"
                        value={line.unitCost}
                        onChange={(e) =>
                          updateLineItem(index, {
                            unitCost: Number.parseFloat(e.target.value) || 0
                          })
                        }
                        className="text-right"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        type="number"
                        size="small"
                        value={line.taxRate}
                        onChange={(e) =>
                          updateLineItem(index, {
                            taxRate: Number.parseFloat(e.target.value) || 0
                          })
                        }
                        className="text-right"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="error" onClick={() => removeLineItem(index)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default memo(LineItemsGrid)


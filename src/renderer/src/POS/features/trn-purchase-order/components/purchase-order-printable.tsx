import {
  Box,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import React from 'react'
import { TrnPurchaseOrderLineEntity } from 'src/main/entities'

interface PurchaseOrderPrintableProps {
  data: any
  id: string
}

export const PurchaseOrderPrintable: React.FC<PurchaseOrderPrintableProps> = ({ data, id }) => {
  if (!data) return null

  return (
    <Box sx={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
      <Paper
        id={id}
        sx={{
          p: 6,
          width: '8.5in',
          minHeight: '11in',
          bgcolor: 'white',
          color: 'black',
          boxShadow: 'none'
        }}
      >
        {/* Header Section */}
        <Box
          sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              PURCHASE ORDER
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Transaction Document
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" fontWeight="bold">
              #{data.purchaseOrderNumber}
            </Typography>
            <Typography variant="body2">
              Date: {new Date(data.purchaseOrderDate).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Info Grid */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={6}>
            <Typography variant="overline" color="textSecondary" fontWeight="bold">
              Vendor
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {data.supplier?.name}
            </Typography>
            <Typography variant="body2">{data.supplier?.address || '—'}</Typography>
            <Typography variant="body2">{data.supplier?.contactNumber || '—'}</Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography variant="overline" color="textSecondary" fontWeight="bold">
              Ship To
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              Main Warehouse
            </Typography>
            <Typography variant="body2">123 Logistics Way, Suite 100</Typography>
            <Typography variant="body2">City, State, 12345</Typography>
          </Grid>
        </Grid>

        {/* Line Items Table */}
        <Table size="small" sx={{ mb: 4 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Item Description</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                Qty
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                Unit
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                Unit Cost
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.lineItems?.map((line: TrnPurchaseOrderLineEntity, index: number) => (
              <TableRow key={'' + index}>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {line.item?.name || 'Unknown Item'}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {line.description}
                  </Typography>
                </TableCell>
                <TableCell align="center">{line.quantity}</TableCell>
                <TableCell align="center">{line.unit?.name || '—'}</TableCell>
                <TableCell align="right">${Number(line.unitCost).toFixed(2)}</TableCell>
                <TableCell align="right">${Number(line.totalCost).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Totals Section */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={{ width: 250 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Subtotal:</Typography>
              <Typography variant="body2">${Number(data.amount).toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Tax:</Typography>
              <Typography variant="body2">${Number(data.taxAmount).toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Discount:</Typography>
              <Typography variant="body2">(${Number(data.discountAmount).toFixed(2)})</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Shipping:</Typography>
              <Typography variant="body2">${Number(data.shippingAmount).toFixed(2)}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" fontWeight="bold">
                Total:
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                ${Number(data.totalAmount).toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 'auto', pt: 10 }}>
          <Typography variant="caption" display="block" color="textSecondary" align="center">
            This is a computer-generated document. No signature is required.
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}


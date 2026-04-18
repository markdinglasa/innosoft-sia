import {
  Box,
  Button,
  Divider,
  Grid,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import React from 'react'

interface CollectionPreviewProps {
  open: boolean
  onClose: () => void
  data: any
  onExport: (format: 'pdf' | 'csv' | 'xlsx') => void
}

export const CollectionPreview: React.FC<CollectionPreviewProps> = ({
  open,
  onClose,
  data,
  onExport
}) => {
  if (!data) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Paper sx={{ width: 600, maxHeight: '90vh', overflow: 'auto', p: 4, borderRadius: 2 }}>
        <Box id="receipt-content">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h5" fontWeight="bold">
              OFFICIAL RECEIPT
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manual Collection Record
            </Typography>
          </Box>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                Collection #
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {data.collectionNumber}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                Date
              </Typography>
              <Typography variant="body1">
                {new Date(data.collectionDate).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                Customer
              </Typography>
              <Typography variant="body1">{data.customer?.name || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                Manual OR #
              </Typography>
              <Typography variant="body1">{data.manualORNumber}</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 2 }} />

          <Typography variant="subtitle2" gutterBottom fontWeight="bold">
            Payment Breakdown
          </Typography>
          <TableContainer component={Box} sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Method</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.collectionLines?.map((line: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell>{line.payType?.name || 'Unknown'}</TableCell>
                    <TableCell align="right">{Number(line.amount).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <Box sx={{ display: 'flex', gap: 4 }}>
              <Typography variant="body1">Total Amount:</Typography>
              <Typography variant="body1" fontWeight="bold">
                PHP {Number(data.amount).toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 4 }}>
              <Typography variant="body2">Tendered:</Typography>
              <Typography variant="body2">{Number(data.tenderAmount).toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 4 }}>
              <Typography variant="body2">Change:</Typography>
              <Typography variant="body2" fontWeight="bold">
                {Number(data.changeAmount).toFixed(2)}
              </Typography>
            </Box>
          </Box>

          {data.remarks && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Remarks:
              </Typography>
              <Typography variant="body2">{data.remarks}</Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
          <Button variant="contained" onClick={() => onExport('pdf')}>
            PDF
          </Button>
          <Button variant="contained" color="secondary" onClick={() => onExport('csv')}>
            CSV
          </Button>
          <Button variant="contained" color="success" onClick={() => onExport('xlsx')}>
            XLSX
          </Button>
        </Box>
      </Paper>
    </Modal>
  )
}


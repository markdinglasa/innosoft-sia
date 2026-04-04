import React from 'react'
import {
  Box,
  Typography,
  Paper,
  Divider,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material'
import { Assessment as ReportIcon } from '@mui/icons-material'

interface ShiftReportViewProps {
  data: any
  isLoading: boolean
  error?: any
}

export const ShiftReportView: React.FC<ShiftReportViewProps> = ({ data, isLoading, error }) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <Alert severity="error">{error.message || 'Failed to load report.'}</Alert>
  }

  if (!data) return null

  const formatCurrency = (amount: number) => {
    return Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  return (
    <Box sx={{ p: 2 }}>
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <ReportIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h5" fontWeight="bold">X-READING REPORT</Typography>
          <Typography variant="body2" color="text.secondary">Shift Breakdown & Audit</Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>General Info</Typography>
              <Divider sx={{ my: 0.5 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2">Cashier:</Typography>
                <Typography variant="body2" fontWeight="bold">{data.userName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Terminal:</Typography>
                <Typography variant="body2" fontWeight="bold">{data.terminalName}</Typography>
              </Box>
               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Opened:</Typography>
                <Typography variant="body2">{new Date(data.openDate).toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Status:</Typography>
                <Typography variant="body2" color={data.closeDate ? 'error.main' : 'success.main'} fontWeight="bold">
                   {data.closeDate ? 'CLOSED' : 'ACTIVE'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Performance Summary</Typography>
              <Divider sx={{ my: 0.5 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2">Gross Sales:</Typography>
                <Typography variant="body2" fontWeight="bold">{formatCurrency(data.totalGrossSales)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Starting Cash:</Typography>
                <Typography variant="body2">{formatCurrency(data.startingCash)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Total Collected:</Typography>
                <Typography variant="h6" color="primary.main" fontWeight="bold">{formatCurrency(data.totalCollected)}</Typography>
              </Box>
               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Transactions:</Typography>
                <Typography variant="body2" fontWeight="bold">{data.transactionCount}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Tender Breakdown</Typography>
              <Divider sx={{ my: 0.5 }} />
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={6}>
                  <Typography variant="body2">Cash Payments:</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                   <Typography variant="body2" fontWeight="bold">{formatCurrency(data.totalCashPayments)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Other (Non-Cash):</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                   <Typography variant="body2" fontWeight="bold">{formatCurrency(data.totalOtherPayments)}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

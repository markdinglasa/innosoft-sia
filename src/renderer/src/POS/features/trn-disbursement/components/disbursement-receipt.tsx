import { Box, Divider, Typography, Grid } from '@mui/material'
import React from 'react'
import { DisbursementFormData } from '../types/disbursement.types'

interface DisbursementReceiptProps {
  data: DisbursementFormData
  companyInfo?: {
    name: string
    address: string
    tin?: string
  }
}

export const DisbursementReceipt: React.FC<DisbursementReceiptProps> = ({ data, companyInfo }) => {
  return (
    <Box sx={{ p: 4, width: '80mm', margin: 'auto', bgcolor: 'white', border: '1px dashed #ccc', fontFamily: 'monospace' }}>
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
          {companyInfo?.name || 'POS SYSTEM'}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          {companyInfo?.address || '123 Business St, City, Country'}
        </Typography>
        {companyInfo?.tin && (
          <Typography variant="caption" sx={{ display: 'block' }}>
            TIN: {companyInfo.tin}
          </Typography>
        )}
      </Box>

      <Typography variant="subtitle2" sx={{ textAlign: 'center', mb: 2, fontWeight: 'bold' }}>
        DISBURSEMENT RECEIPT
      </Typography>

      <Box sx={{ fontSize: '0.8rem', mb: 2 }}>
        <Grid container>
          <Grid item xs={6}>No: {data.disbursementNumber || 'NEW'}</Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            {new Date(data.disbursementDate).toLocaleDateString()}
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

      <Box sx={{ fontSize: '0.8rem', mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption">Payee:</Typography>
          <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{data.payee}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption">Type:</Typography>
          <Typography variant="caption">{data.disbursementType}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption">Account ID:</Typography>
          <Typography variant="caption">{data.accountId}</Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

      <Box sx={{ textAlign: 'right', mb: 2 }}>
        <Typography variant="caption" sx={{ display: 'block' }}>Total Amount:</Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          ₱{data.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Typography>
      </Box>

      {data.remarks && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ display: 'block', fontStyle: 'italic' }}>Remarks:</Typography>
          <Typography variant="caption" sx={{ display: 'block' }}>{data.remarks}</Typography>
        </Box>
      )}

      <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

      <Box sx={{ fontSize: '0.7rem' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ borderTop: '1px solid #000', pt: 0.5, width: '30%' }}>
            <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>Prepared By</Typography>
          </Box>
          <Box sx={{ borderTop: '1px solid #000', pt: 0.5, width: '30%' }}>
            <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>Checked By</Typography>
          </Box>
          <Box sx={{ borderTop: '1px solid #000', pt: 0.5, width: '30%' }}>
            <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>Approved By</Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="caption" sx={{ fontStyle: 'italic' }}>*** This is a manual disbursement record ***</Typography>
      </Box>
    </Box>
  )
}

import { Box, Grid, TextField, Typography } from '@mui/material'
import React, { useCallback } from 'react'
import { CashDenominations } from '../types/disbursement.types'

interface CashDenominationCalculatorProps {
  totalAmount: number
  denominations: CashDenominations
  onDenominationChange: (denominations: CashDenominations) => void
  disabled?: boolean
  error?: string
}

const DENOMINATIONS: { value: number; label: string; key: keyof CashDenominations }[] = [
  { value: 1000, label: '₱1,000', key: 'amount1000' },
  { value: 500, label: '₱500', key: 'amount500' },
  { value: 200, label: '₱200', key: 'amount200' },
  { value: 100, label: '₱100', key: 'amount100' },
  { value: 50, label: '₱50', key: 'amount50' },
  { value: 20, label: '₱20', key: 'amount20' },
  { value: 10, label: '₱10', key: 'amount10' },
  { value: 5, label: '₱5', key: 'amount5' },
  { value: 1, label: '₱1', key: 'amount1' },
  { value: 0.25, label: '25¢', key: 'amount025' },
  { value: 0.1, label: '10¢', key: 'amount010' },
  { value: 0.05, label: '5¢', key: 'amount005' },
  { value: 0.01, label: '1¢', key: 'amount001' }
]

export const CashDenominationCalculator: React.FC<CashDenominationCalculatorProps> = ({
  totalAmount,
  denominations,
  onDenominationChange,
  disabled = false,
  error
}) => {
  const calculateTotal = useCallback((currentDenoms: CashDenominations) => {
    return DENOMINATIONS.reduce((acc, { value, key }) => {
      const count = currentDenoms[key] || 0
      return acc + count * value
    }, 0)
  }, [])

  const currentTotal = calculateTotal(denominations)
  const difference = currentTotal - totalAmount
  const isMismatch = Math.abs(difference) > 0.001

  const handleChange = (key: keyof CashDenominations, value: string) => {
    const numValue = parseInt(value, 10) || 0
    onDenominationChange({
      ...denominations,
      [key]: numValue
    })
  }

  return (
    <Box
      sx={{
        border: 1,
        borderColor: isMismatch ? 'error.main' : 'divider',
        borderRadius: 1,
        p: 2,
        bgcolor: 'background.default'
      }}
    >
      <Typography variant="subtitle2" gutterBottom color={isMismatch ? 'error' : 'textSecondary'}>
        Cash Denomination Breakdown
      </Typography>
      <Grid container spacing={1.5}>
        {DENOMINATIONS.map(({ label, key }) => (
          <Grid item xs={6} sm={4} key={key}>
            <TextField
              label={label}
              type="number"
              size="small"
              fullWidth
              disabled={disabled}
              value={denominations[key] || ''}
              onChange={(e) => handleChange(key, e.target.value)}
              InputProps={{
                inputProps: { min: 0 },
                endAdornment: (
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ ml: 1, whiteSpace: 'nowrap' }}
                  >
                    × {label}
                  </Typography>
                )
              }}
              placeholder="0"
            />
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          mt: 2,
          p: 1.5,
          bgcolor: isMismatch ? 'error.lighter' : 'secondary.light',
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box>
          <Typography variant="body2" color="textSecondary">
            Total Breakdowns:
          </Typography>
          <Typography variant="h6" color={isMismatch ? 'error' : 'primary'}>
            ₱
            {currentTotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </Typography>
        </Box>
        {isMismatch && (
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="error" sx={{ fontWeight: 'bold' }}>
              Mismatch: ₱
              {difference.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </Typography>
          </Box>
        )}
      </Box>
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  )
}


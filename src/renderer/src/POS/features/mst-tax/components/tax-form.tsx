import { zodResolver } from '@hookform/resolvers/zod'
import { Close as CloseIcon, Save as SaveIcon, Receipt as TaxIcon } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Skeleton,
  TextField,
  Typography
} from '@mui/material'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useTaxHubStore } from '../store/use-tax-hub-store'
import { TaxFormSkeleton } from './tax-form-skeleton'

const taxSchema = z.object({
  code: z.string().min(1, 'Tax Code is required'),
  name: z.string().min(1, 'Tax Name is required'),
  rate: z.coerce.number().min(0, 'Rate must be at least 0'),
  accountId: z.number().min(1, 'Account is required')
})

type FormData = z.infer<typeof taxSchema>

export const TaxForm: React.FC = () => {
  const { selectedId, setIsFormOpen, setSelectedId } = useTaxHubStore()
  const { useGet, useSaveMutation, useLookup } = useMasterfile('tax')
  const { data: existing, isLoading } = useGet(selectedId)
  const accountLookup = useLookup('account')
  const saveMutation = useSaveMutation()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(taxSchema),
    defaultValues: { code: '', name: '', rate: 0, accountId: 0 }
  })

  useEffect(
    function formResetter() {
      if (existing)
        reset({
          code: existing.code || '',
          name: existing.name || '',
          rate: existing.rate || 0,
          accountId: existing.accountId || 0
        })
      else reset({ code: '', name: '', rate: 0, accountId: 0 })
    },
    [existing, reset]
  )

  const handleClose = () => {
    setSelectedId(null)
    setIsFormOpen(false)
  }

  const onSubmit = async (formData: FormData) => {
    await saveMutation.mutateAsync({ ...formData, id: selectedId || undefined })
    setIsFormOpen(false)
  }

  if (selectedId && isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <TaxFormSkeleton />
      </Box>
    )
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'primary.dark',
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TaxIcon sx={{ fontSize: 25 }} />
          <Typography variant="h6">{selectedId ? 'Edit Tax' : 'New Tax'}</Typography>
        </Box>
        <IconButton size="small" onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon sx={{ fontSize: 25 }} />
        </IconButton>
      </Box>

      <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
        {saveMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {saveMutation.error?.message || 'Sorry, Something went wrong.'}
          </Alert>
        )}
        <Grid container>
          <Grid item xs={12}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tax"
                  fullWidth
                  required
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Tax Code"
                  fullWidth
                  required
                  margin="normal"
                  error={!!errors.code}
                  helperText={errors.code?.message}
                >
                  <MenuItem value="Inclusive">Inclusive</MenuItem>
                  <MenuItem value="Exclusive">Exclusive</MenuItem>
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="rate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Rate (%)"
                  type="number"
                  fullWidth
                  required
                  margin="normal"
                  error={!!errors.rate}
                  helperText={errors.rate?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="accountId"
              control={control}
              render={({ field }) =>
                accountLookup.isLoading ? (
                  <Skeleton variant="rectangular" height={56} sx={{ mt: 1, mb: 1 }} />
                ) : (
                  <TextField
                    {...field}
                    select
                    label="Account"
                    fullWidth
                    required
                    margin="normal"
                    error={!!errors.accountId}
                    helperText={errors.accountId?.message}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    <MenuItem value={0}>Select an Account</MenuItem>
                    {accountLookup.data?.map((account: any) => (
                      <MenuItem key={account.id} value={account.id}>
                        {account.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )
              }
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={handleClose}
          disabled={saveMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          fullWidth
          variant="contained"
          type="submit"
          startIcon={<SaveIcon sx={{ fontSize: 25 }} />}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? 'Saving...' : 'Save Tax'}
        </Button>
      </Box>
    </Box>
  )
}


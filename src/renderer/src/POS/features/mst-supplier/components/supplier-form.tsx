import {
  Close as CloseIcon,
  Save as SaveIcon,
  LocalShipping as SupplierIcon
} from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useSupplierHubStore } from '../store/use-supplier-hub-store'

export const SupplierForm: React.FC = () => {
  const { selectedSupplierId, setSelectedSupplierId, setIsFormOpen } = useSupplierHubStore()
  const { useGet, useSaveMutation, useLookup } = useMasterfile('supplier')

  const { data: terms = [] } = useLookup('term')
  const { data: accounts = [] } = useLookup('account')

  const { data: supplier, isLoading } = useGet(selectedSupplierId)
  const saveMutation = useSaveMutation()

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      address: '',
      telephoneNumber: '',
      cellphoneNumber: '',
      faxNumber: '',
      tin: '',
      termId: '',
      accountId: '',
      isDefault: false
    }
  })

  useEffect(() => {
    if (supplier) {
      reset({
        ...supplier
      })
    } else {
      reset({
        name: '',
        address: '',
        telephoneNumber: '',
        cellphoneNumber: '',
        faxNumber: '',
        tin: '',
        termId: '',
        accountId: '',
        isDefault: false
      })
    }
  }, [supplier, reset])

  const onSubmit = async (data: any) => {
    try {
      await saveMutation.mutateAsync({
        ...data,
        id: selectedSupplierId
      })
      handleClose()
    } catch (err) {
      console.error('Save failed:', err)
    }
  }

  const handleClose = () => {
    setSelectedSupplierId(null)
    setIsFormOpen(false)
  }

  if (selectedSupplierId && isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={32} />
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
          <SupplierIcon sx={{ fontSize: 25 }} />
          <Typography variant="h6">
            {selectedSupplierId ? 'Edit Supplier' : 'New Supplier'}
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon sx={{ fontSize: 25 }} />
        </IconButton>
      </Box>

      <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
        {saveMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {saveMutation.error?.message || 'Failed to save supplier.'}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              {...register('name', { required: 'Name is required' })}
              label="Supplier Name"
              fullWidth
              size="small"
              error={!!errors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register('address', { required: 'Address is required' })}
              label="Address"
              multiline
              rows={2}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              {...register('cellphoneNumber')}
              label="Cellphone Number"
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              {...register('telephoneNumber')}
              label="Telephone Number"
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField {...register('faxNumber')} label="Fax Number" fullWidth size="small" />
          </Grid>
          <Grid item xs={6}>
            <TextField {...register('tin')} label="TIN" fullWidth size="small" />
          </Grid>
          <Divider sx={{ width: '100%', my: 2 }} />
          <Grid item xs={12}>
            <Controller
              name="termId"
              control={control}
              render={({ field }) => (
                <TextField {...field} select label="Payment Term" fullWidth size="small">
                  {terms.map((t: any) => (
                    <MenuItem key={t.id} value={t.id}>
                      {t.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="accountId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="AP Account (Chart of Accounts)"
                  fullWidth
                  size="small"
                >
                  {accounts.map((a: any) => (
                    <MenuItem key={a.id} value={a.id}>
                      [{a.code}] {a.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
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
          {saveMutation.isPending ? 'Saving...' : 'Save Supplier'}
        </Button>
      </Box>
    </Box>
  )
}


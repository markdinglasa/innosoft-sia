import React, { useEffect } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  MenuItem,
  IconButton,
  Divider,
  CircularProgress,
  Paper,
  Alert,
  FormControlLabel,
  Switch
} from '@mui/material'
import { 
  Save as SaveIcon, 
  Close as CloseIcon,
  PersonPin as CustomerIcon,
  Description as DocIcon
} from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useCustomerHubStore } from '../store/use-customer-hub-store'

export const CustomerForm: React.FC = () => {
  const { selectedCustomerId, setSelectedCustomerId, setIsFormOpen } = useCustomerHubStore()
  const { useGet, useSaveMutation, useLookup } = useMasterfile('customer')
  
  const { data: terms = [] } = useLookup('term')
  const { data: accounts = [] } = useLookup('account')
  
  const { data: customer, isLoading } = useGet(selectedCustomerId)
  const saveMutation = useSaveMutation()

  const { control, register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      customerCode: '',
      address: '',
      contactPerson: '',
      contactNumber: '',
      tin: '',
      creditLimit: 0,
      termId: '',
      accountId: '',
      withReward: false,
      isDefault: false
    }
  })

  useEffect(() => {
    if (customer) {
      reset({
        ...customer
      })
    } else {
      reset({
        name: '',
        customerCode: '',
        address: '',
        contactPerson: '',
        contactNumber: '',
        tin: '',
        creditLimit: 0,
        termId: '',
        accountId: '',
        withReward: false,
        isDefault: false
      })
    }
  }, [customer, reset])

  const onSubmit = async (data: any) => {
    try {
      await saveMutation.mutateAsync({
        ...data,
        id: selectedCustomerId
      })
      handleClose()
    } catch (err) {
      console.error('Save failed:', err)
    }
  }

  const handleClose = () => {
    setSelectedCustomerId(null)
    setIsFormOpen(false)
  }

  if (selectedCustomerId && isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'primary.dark', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CustomerIcon />
          <Typography variant="h6">{selectedCustomerId ? 'Edit Customer' : 'New Customer'}</Typography>
        </Box>
        <IconButton size="small" onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
        {saveMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {saveMutation.error?.message || 'Failed to save customer.'}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              {...register('name', { required: 'Name is required' })}
              label="Customer Name"
              fullWidth
              size="small"
              error={!!errors.name}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              {...register('customerCode')}
              label="Customer Code"
              fullWidth
              size="small"
              placeholder="AUTO"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              {...register('tin')}
              label="TIN"
              fullWidth
              size="small"
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
              {...register('contactPerson')}
              label="Contact Person"
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              {...register('contactNumber')}
              label="Contact Number"
              fullWidth
              size="small"
            />
          </Grid>
          <Divider sx={{ width: '100%', my: 2 }} />
          <Grid item xs={6}>
            <TextField
              {...register('creditLimit')}
              label="Credit Limit"
              type="number"
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="termId"
              control={control}
              render={({ field }) => (
                <TextField {...field} select label="Payment Term" fullWidth size="small">
                  {terms.map((t: any) => (
                    <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
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
                <TextField {...field} select label="AR Account (Chart of Accounts)" fullWidth size="small">
                  {accounts.map((a: any) => (
                    <MenuItem key={a.id} value={a.id}>[{a.code}] {a.name}</MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="withReward"
              control={control}
              render={({ field }) => (
                <FormControlLabel 
                  control={<Switch checked={field.value} onChange={field.onChange} />} 
                  label="Join Rewards Program" 
                />
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
          startIcon={<SaveIcon />}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? 'Saving...' : 'Save Customer'}
        </Button>
      </Box>
    </Box>
  )
}

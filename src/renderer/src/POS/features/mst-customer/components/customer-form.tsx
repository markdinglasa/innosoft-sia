import { zodResolver } from '@hookform/resolvers/zod'
import {
  Close as CloseIcon,
  PersonPin as CustomerIcon,
  Save as SaveIcon
} from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { memo, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import AccessControl from '../../../components/utils/access-control'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useCustomerHubStore } from '../store/use-customer-hub-store'
import { CustomerFormSkeleton } from './customer-form-skeleton'

const customerSchema = z.object({
  name: z.string().min(2, 'Customer Name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  contactPerson: z.string().nullable().optional(),
  contactNumber: z.string().nullable().optional(),
  tin: z.string().nullable().optional(),
  creditLimit: z.coerce.number().min(0, 'Credit Limit must be at least 0'),
  termId: z.any().nullable().optional(),
  accountId: z.any().nullable().optional(),
  withReward: z.boolean().default(false),
  isDefault: z.boolean().default(false),
  rewardConversion: z.coerce.number().min(0, 'Reward Conversion must be at least 0')
})

type CustomerFormData = z.infer<typeof customerSchema>

function CustomerForm() {
  const { selectedCustomerId, setSelectedCustomerId, setIsFormOpen } = useCustomerHubStore()
  const { useGet, useSaveMutation, useLookup } = useMasterfile('customer')

  const { data: terms = [] } = useLookup('term')
  const { data: accounts = [] } = useLookup('account')

  const { data: customer, isLoading } = useGet(selectedCustomerId)
  const saveMutation = useSaveMutation()

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema) as any,
    defaultValues: {
      name: '',
      address: '',
      contactPerson: '',
      contactNumber: '',
      tin: '',
      creditLimit: 0,
      termId: '',
      accountId: '',
      withReward: false,
      isDefault: false,
      rewardConversion: 0
    }
  })

  useEffect(
    function formResetter() {
      if (customer) {
        reset({
          name: customer.name || '',
          address: customer.address || '',
          contactPerson: customer.contactPerson || '',
          contactNumber: customer.contactNumber || '',
          tin: customer.tin || '',
          creditLimit: customer.creditLimit || 0,
          termId: customer.termId || '',
          accountId: customer.accountId || '',
          withReward: !!customer.withReward,
          isDefault: !!customer.isDefault,
          rewardConversion: customer.rewardConversion || 0
        })
      } else {
        reset({
          name: '',
          address: '',
          contactPerson: '',
          contactNumber: '',
          tin: '',
          creditLimit: 0,
          termId: '',
          accountId: '',
          withReward: false,
          isDefault: false,
          rewardConversion: 0
        })
      }
    },
    [customer, reset]
  )

  const onSubmit = async (data: CustomerFormData) => {
    const customerCode = data.name.toUpperCase().replace(/\s/g, '_')
    await saveMutation.mutateAsync({
      ...data,
      customerCode,
      id: selectedCustomerId
    })
    handleClose()
  }

  const handleClose = () => {
    setSelectedCustomerId(null)
    setIsFormOpen(false)
  }

  if (selectedCustomerId && isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CustomerFormSkeleton />
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
          <CustomerIcon sx={{ fontSize: 25 }} />
          <Typography variant="h6">
            {selectedCustomerId ? 'Edit Customer' : 'New Customer'}
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon sx={{ fontSize: 25 }} />
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
              {...register('name')}
              label="Customer"
              fullWidth
              required
              size="small"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField {...register('tin')} label="TIN" fullWidth size="small" />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register('address')}
              label="Address"
              multiline
              rows={2}
              fullWidth
              required
              size="small"
              error={!!errors.address}
              helperText={errors.address?.message}
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
              required
              size="small"
              error={!!errors.creditLimit}
              helperText={errors.creditLimit?.message}
            />
          </Grid>
          <Grid item xs={6}>
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
                  label="AR Account (Chart of Accounts)"
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
          <AccessControl condition={watch('withReward')}>
            <Grid item xs={6}>
              <TextField
                {...register('rewardConversion')}
                label="Reward Conversion"
                type="number"
                fullWidth
                required
                size="small"
                error={!!errors.rewardConversion}
                helperText={errors.rewardConversion?.message}
              />
            </Grid>
          </AccessControl>
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
          {saveMutation.isPending ? 'Saving...' : 'Save Customer'}
        </Button>
      </Box>
    </Box>
  )
}

export default memo(CustomerForm)


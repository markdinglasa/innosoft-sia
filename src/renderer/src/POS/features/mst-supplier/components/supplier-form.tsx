import { zodResolver } from '@hookform/resolvers/zod'
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
import { memo, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useSupplierHubStore } from '../store/use-supplier-hub-store'

const supplierSchema = z.object({
  name: z.string().min(1, 'Supplier Name is required'),
  address: z.string().min(1, 'Address is required'),
  telephoneNumber: z.string().nullable().optional(),
  cellphoneNumber: z.string().nullable().optional(),
  faxNumber: z.string().nullable().optional(),
  tin: z.string().nullable().optional(),
  termId: z.any().nullable().optional(),
  accountId: z.any().nullable().optional(),
  isDefault: z.boolean().default(false)
})

type FormData = z.infer<typeof supplierSchema>

function SupplierForm() {
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
    resolver: zodResolver(supplierSchema),
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

  useEffect(
    function formResetter() {
      if (supplier) {
        reset({
          name: supplier.name || '',
          address: supplier.address || '',
          telephoneNumber: supplier.telephoneNumber || '',
          cellphoneNumber: supplier.cellphoneNumber || '',
          faxNumber: supplier.faxNumber || '',
          tin: supplier.tin || '',
          termId: supplier.termId || '',
          accountId: supplier.accountId || '',
          isDefault: !!supplier.isDefault
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
    },
    [supplier, reset]
  )

  const onSubmit = async (data: FormData) => {
    await saveMutation.mutateAsync({
      ...data,
      id: selectedSupplierId
    })
    handleClose()
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
              {...register('name')}
              label="Supplier Name"
              fullWidth
              required
              size="small"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
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

export default memo(SupplierForm)

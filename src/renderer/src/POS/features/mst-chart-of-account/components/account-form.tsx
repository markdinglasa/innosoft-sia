import { zodResolver } from '@hookform/resolvers/zod'
import {
  AccountBalance as AccountIcon,
  Close as CloseIcon,
  Save as SaveIcon
} from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useAccountHubStore } from '../store/use-account-hub-store'
import { AccountFormSkeleton } from './account-form-skeleton'

const accountSchema = z.object({
  code: z.string().min(1, 'Account Code is required'),
  name: z.string().min(1, 'Account Name is required'),
  type: z.string().min(1, 'Account Type is required'),
  isDefault: z.boolean().default(false)
})

type FormData = z.infer<typeof accountSchema>

const accountTypes = [
  'Asset',
  'Liability',
  'Equity',
  'Revenue',
  'Expense',
  'Sales',
  'Cost of Sales',
  'Other Income',
  'Other Expense'
]

export const AccountForm: React.FC = () => {
  const { selectedId, setIsFormOpen, setSelectedId } = useAccountHubStore()
  const { useGet, useSaveMutation } = useMasterfile('account')
  const { data: existing, isLoading } = useGet(selectedId)
  const saveMutation = useSaveMutation()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: { code: '', name: '', type: '', isDefault: false }
  })

  useEffect(
    function formResetter() {
      if (existing)
        reset({
          code: existing.code || '',
          name: existing.name || '',
          type: existing.type || '',
          isDefault: !!existing.isDefault
        })
      else reset({ code: '', name: '', type: '', isDefault: false })
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
        <AccountFormSkeleton />
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
          <AccountIcon sx={{ fontSize: 25 }} />
          <Typography variant="h6">{selectedId ? 'Edit Account' : 'New Account'}</Typography>
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
                  label="Account"
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
                  label="Account Code"
                  fullWidth
                  required
                  margin="normal"
                  error={!!errors.code}
                  helperText={errors.code?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Account Type"
                  fullWidth
                  required
                  margin="normal"
                  error={!!errors.type}
                  helperText={errors.type?.message}
                >
                  {accountTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          {/* <Grid item xs={12}>
            <Controller
              name="isDefault"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Default Account"
                />
              )}
            />
          </Grid> */}
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
          {saveMutation.isPending ? 'Saving...' : 'Save Account'}
        </Button>
      </Box>
    </Box>
  )
}


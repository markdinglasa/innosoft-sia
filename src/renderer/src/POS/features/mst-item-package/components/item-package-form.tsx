import { zodResolver } from '@hookform/resolvers/zod'
import { Close as CloseIcon, Inventory as PackageIcon, Save as SaveIcon } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useItemPackageHubStore } from '../store/use-item-package-hub-store'
import { ItemPackageFormSkeleton } from './item-package-form-skeleton'

const itemPackageSchema = z.object({
  branchId: z.coerce.number().default(0),
  itemId: z.coerce.number().min(1, 'Parent Item ID required'),
  packageItemId: z.coerce.number().min(1, 'Package Item ID required'),
  unitId: z.coerce.number().min(1, 'Unit ID required'),
  quantity: z.coerce.number().min(0, 'Quantity must be at least 0'),
  isOptional: z.boolean().default(false)
})

type FormData = z.infer<typeof itemPackageSchema>

export const ItemPackageForm: React.FC = () => {
  const { selectedId, setIsFormOpen, setSelectedId } = useItemPackageHubStore()
  const { useGet, useSaveMutation } = useMasterfile('itemPackage')
  const { data: existing, isLoading } = useGet(selectedId)
  const saveMutation = useSaveMutation()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(itemPackageSchema),
    defaultValues: {
      branchId: 0,
      itemId: 0,
      packageItemId: 0,
      unitId: 0,
      quantity: 1,
      isOptional: false
    }
  })

  useEffect(
    function formResetter() {
      if (existing)
        reset({
          branchId: existing.branchId || 0,
          itemId: existing.itemId || 0,
          packageItemId: existing.packageItemId || 0,
          unitId: existing.unitId || 0,
          quantity: existing.quantity || 1,
          isOptional: !!existing.isOptional
        })
      else
        reset({
          branchId: 0,
          itemId: 0,
          packageItemId: 0,
          unitId: 0,
          quantity: 1,
          isOptional: false
        })
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
        <ItemPackageFormSkeleton />
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
          <PackageIcon sx={{ fontSize: 25 }} />
          <Typography variant="h6">{selectedId ? 'Edit Package' : 'New Package'}</Typography>
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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Controller
              name="itemId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Parent Item ID"
                  type="number"
                  fullWidth
                  required
                  margin="normal"
                  error={!!errors.itemId}
                  helperText={errors.itemId?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="packageItemId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Package Item ID"
                  type="number"
                  fullWidth
                  required
                  margin="normal"
                  error={!!errors.packageItemId}
                  helperText={errors.packageItemId?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="unitId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Unit ID"
                  type="number"
                  fullWidth
                  required
                  margin="normal"
                  error={!!errors.unitId}
                  helperText={errors.unitId?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="quantity"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Quantity"
                  type="number"
                  fullWidth
                  required
                  margin="normal"
                  error={!!errors.quantity}
                  helperText={errors.quantity?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="isOptional"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Optional Package"
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
          startIcon={<SaveIcon sx={{ fontSize: 25 }} />}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? 'Saving...' : 'Save Package'}
        </Button>
      </Box>
    </Box>
  )
}

import { Close as CloseIcon, Save as SaveIcon, Extension as ComponentIcon } from '@mui/icons-material'
import { Alert, Box, Button, CircularProgress, Divider, IconButton, TextField, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useItemComponentHubStore } from '../store/use-item-component-hub-store'

interface FormData { itemId: number; componentItemId: number; quantity: number }

export const ItemComponentForm: React.FC = () => {
  const { selectedId, setIsFormOpen } = useItemComponentHubStore()
  const { useGet, useSaveMutation } = useMasterfile('itemComponent')
  const { data: existing, isLoading } = useGet(selectedId)
  const saveMutation = useSaveMutation()
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ defaultValues: { itemId: 0, componentItemId: 0, quantity: 1 } })
  useEffect(() => { if (existing) reset({ itemId: existing.itemId || 0, componentItemId: existing.componentItemId || 0, quantity: existing.quantity || 1 }); else reset({ itemId: 0, componentItemId: 0, quantity: 1 }) }, [existing, reset])
  const onSubmit = async (formData: FormData) => { await saveMutation.mutateAsync({ ...formData, id: selectedId || undefined }); setIsFormOpen(false) }
  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><ComponentIcon color="primary" /><Typography variant="h6">{selectedId ? 'Edit Component' : 'New Component'}</Typography></Box><IconButton onClick={() => setIsFormOpen(false)}><CloseIcon /></IconButton></Box>
      <Divider sx={{ mb: 3 }} />
      {isLoading ? <CircularProgress /> : (
        <form onSubmit={handleSubmit(onSubmit)} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Controller name="itemId" control={control} rules={{ required: 'Item ID required' }} render={({ field }) => <TextField {...field} label="Item ID" type="number" fullWidth margin="normal" error={!!errors.itemId} helperText={errors.itemId?.message} />} />
          <Controller name="componentItemId" control={control} rules={{ required: 'Component Item ID required' }} render={({ field }) => <TextField {...field} label="Component Item ID" type="number" fullWidth margin="normal" error={!!errors.componentItemId} helperText={errors.componentItemId?.message} />} />
          <Controller name="quantity" control={control} rules={{ required: 'Quantity required' }} render={({ field }) => <TextField {...field} label="Quantity" type="number" fullWidth margin="normal" error={!!errors.quantity} helperText={errors.quantity?.message} />} />
          {saveMutation.isError && <Alert severity="error" sx={{ mt: 2 }}>Failed to save.</Alert>}
          <Box sx={{ mt: 'auto', pt: 3 }}><Button type="submit" variant="contained" fullWidth startIcon={<SaveIcon />} disabled={saveMutation.isPending}>{saveMutation.isPending ? 'Saving...' : 'Save Component'}</Button></Box>
        </form>)}
    </Box>)
}

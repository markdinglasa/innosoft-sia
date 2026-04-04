import { Close as CloseIcon, Save as SaveIcon, Receipt as TaxIcon } from '@mui/icons-material'
import { Alert, Box, Button, CircularProgress, Divider, IconButton, TextField, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useTaxHubStore } from '../store/use-tax-hub-store'

interface TaxFormData { code: string; name: string; rate: number }

export const TaxForm: React.FC = () => {
  const { selectedId, setIsFormOpen } = useTaxHubStore()
  const { useGet, useSaveMutation } = useMasterfile('tax')
  const { data: existing, isLoading } = useGet(selectedId)
  const saveMutation = useSaveMutation()
  const { control, handleSubmit, reset, formState: { errors } } = useForm<TaxFormData>({ defaultValues: { code: '', name: '', rate: 0 } })

  useEffect(() => {
    if (existing) reset({ code: existing.code || '', name: existing.name || '', rate: existing.rate || 0 })
    else reset({ code: '', name: '', rate: 0 })
  }, [existing, reset])

  const onSubmit = async (formData: TaxFormData) => {
    await saveMutation.mutateAsync({ ...formData, id: selectedId || undefined })
    setIsFormOpen(false)
  }

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><TaxIcon color="primary" /><Typography variant="h6">{selectedId ? 'Edit Tax' : 'New Tax'}</Typography></Box>
        <IconButton onClick={() => setIsFormOpen(false)}><CloseIcon /></IconButton>
      </Box>
      <Divider sx={{ mb: 3 }} />
      {isLoading ? <CircularProgress /> : (
        <form onSubmit={handleSubmit(onSubmit)} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Controller name="code" control={control} rules={{ required: 'Code is required' }}
            render={({ field }) => <TextField {...field} label="Tax Code" fullWidth margin="normal" error={!!errors.code} helperText={errors.code?.message} />} />
          <Controller name="name" control={control} rules={{ required: 'Name is required' }}
            render={({ field }) => <TextField {...field} label="Tax Name" fullWidth margin="normal" error={!!errors.name} helperText={errors.name?.message} />} />
          <Controller name="rate" control={control} rules={{ required: 'Rate is required' }}
            render={({ field }) => <TextField {...field} label="Rate (%)" type="number" fullWidth margin="normal" error={!!errors.rate} helperText={errors.rate?.message} />} />
          {saveMutation.isError && <Alert severity="error" sx={{ mt: 2 }}>Failed to save tax.</Alert>}
          <Box sx={{ mt: 'auto', pt: 3 }}><Button type="submit" variant="contained" fullWidth startIcon={<SaveIcon />} disabled={saveMutation.isPending}>{saveMutation.isPending ? 'Saving...' : 'Save Tax'}</Button></Box>
        </form>
      )}
    </Box>
  )
}

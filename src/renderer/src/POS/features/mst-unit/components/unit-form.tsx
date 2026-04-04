import { Close as CloseIcon, Save as SaveIcon, Straighten as UnitIcon } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  TextField,
  Typography
} from '@mui/material'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useUnitHubStore } from '../store/use-unit-hub-store'

interface UnitFormData {
  name: string
  description: string
}

export const UnitForm: React.FC = () => {
  const { selectedId, setIsFormOpen } = useUnitHubStore()
  const { useGet, useSaveMutation } = useMasterfile('unit')
  const { data: existing, isLoading } = useGet(selectedId)
  const saveMutation = useSaveMutation()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UnitFormData>({ defaultValues: { name: '', description: '' } })

  useEffect(() => {
    if (existing) reset({ name: existing.name || '', description: existing.description || '' })
    else reset({ name: '', description: '' })
  }, [existing, reset])

  const onSubmit = async (formData: UnitFormData) => {
    await saveMutation.mutateAsync({ ...formData, id: selectedId || undefined })
    setIsFormOpen(false)
  }

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <UnitIcon color="primary" sx={{ fontSize: 25 }} />
          <Typography variant="h6">{selectedId ? 'Edit Unit' : 'New Unit'}</Typography>
        </Box>
        <IconButton onClick={() => setIsFormOpen(false)}>
          <CloseIcon sx={{ fontSize: 25 }} />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 3 }} />
      {isLoading ? (
        <CircularProgress />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Unit Name"
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                margin="normal"
                multiline
                rows={3}
              />
            )}
          />
          {saveMutation.isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Failed to save unit.
            </Alert>
          )}
          <Box sx={{ mt: 'auto', pt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              startIcon={<SaveIcon sx={{ fontSize: 25 }} />}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? 'Saving...' : 'Save Unit'}
            </Button>
          </Box>
        </form>
      )}
    </Box>
  )
}


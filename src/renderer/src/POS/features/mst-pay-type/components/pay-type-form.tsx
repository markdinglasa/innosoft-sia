import { Close as CloseIcon, Payment as PayIcon, Save as SaveIcon } from '@mui/icons-material'
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
import { usePayTypeHubStore } from '../store/use-pay-type-hub-store'

interface FormData {
  name: string
  sortNumber: number | null
}

export const PayTypeForm: React.FC = () => {
  const { selectedId, setIsFormOpen } = usePayTypeHubStore()
  const { useGet, useSaveMutation } = useMasterfile('payType')
  const { data: existing, isLoading } = useGet(selectedId)
  const saveMutation = useSaveMutation()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({ defaultValues: { name: '', sortNumber: null } })
  useEffect(() => {
    if (existing) reset({ name: existing.name || '', sortNumber: existing.sortNumber })
    else reset({ name: '', sortNumber: null })
  }, [existing, reset])
  const onSubmit = async (formData: FormData) => {
    await saveMutation.mutateAsync({ ...formData, id: selectedId || undefined })
    setIsFormOpen(false)
  }
  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PayIcon color="primary" sx={{ fontSize: 25 }} />
          <Typography variant="h6">
            {selectedId ? 'Edit Payment Type' : 'New Payment Type'}
          </Typography>
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
                label="Payment Type Name"
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
          <Controller
            name="sortNumber"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Sort Number" type="number" fullWidth margin="normal" />
            )}
          />
          {saveMutation.isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Failed to save.
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
              {saveMutation.isPending ? 'Saving...' : 'Save Payment Type'}
            </Button>
          </Box>
        </form>
      )}
    </Box>
  )
}


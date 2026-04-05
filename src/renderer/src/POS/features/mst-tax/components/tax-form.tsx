import { zodResolver } from '@hookform/resolvers/zod'
import { Close as CloseIcon, Save as SaveIcon, Receipt as TaxIcon } from '@mui/icons-material'
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
import { z } from 'zod'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useTaxHubStore } from '../store/use-tax-hub-store'

const taxSchema = z.object({
  code: z.string().min(1, 'Tax Code is required'),
  name: z.string().min(1, 'Tax Name is required'),
  rate: z.coerce.number().min(0, 'Rate must be at least 0')
})

type FormData = z.infer<typeof taxSchema>

export const TaxForm: React.FC = () => {
  const { selectedId, setIsFormOpen } = useTaxHubStore()
  const { useGet, useSaveMutation } = useMasterfile('tax')
  const { data: existing, isLoading } = useGet(selectedId)
  const saveMutation = useSaveMutation()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(taxSchema),
    defaultValues: { code: '', name: '', rate: 0 }
  })

  useEffect(
    function formResetter() {
      if (existing)
        reset({ code: existing.code || '', name: existing.name || '', rate: existing.rate || 0 })
      else reset({ code: '', name: '', rate: 0 })
    },
    [existing, reset]
  )

  const onSubmit = async (formData: FormData) => {
    await saveMutation.mutateAsync({ ...formData, id: selectedId || undefined })
    setIsFormOpen(false)
  }

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TaxIcon color="primary" sx={{ fontSize: 25 }} />
          <Typography variant="h6">{selectedId ? 'Edit Tax' : 'New Tax'}</Typography>
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
            name="code"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Tax Code"
                fullWidth
                required
                margin="normal"
                error={!!errors.code}
                helperText={errors.code?.message}
              />
            )}
          />
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Tax Name"
                fullWidth
                required
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
          <Controller
            name="rate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Rate (%)"
                type="number"
                fullWidth
                required
                margin="normal"
                error={!!errors.rate}
                helperText={errors.rate?.message}
              />
            )}
          />
          {saveMutation.isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Failed to save tax.
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
              {saveMutation.isPending ? 'Saving...' : 'Save Tax'}
            </Button>
          </Box>
        </form>
      )}
    </Box>
  )
}


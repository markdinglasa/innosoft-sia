import { zodResolver } from '@hookform/resolvers/zod'
import { Close as CloseIcon, Payment as PayIcon, Save as SaveIcon } from '@mui/icons-material'
import { Alert, Box, Button, Grid, IconButton, TextField, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { usePayTypeHubStore } from '../store/use-pay-type-hub-store'
import { PayTypeFormSkeleton } from './pay-type-form-skeleton'

const payTypeSchema = z.object({
  name: z.string().min(1, 'Payment Type Name is required'),
  sortNumber: z.coerce.number().optional().nullable()
})

type FormData = z.infer<typeof payTypeSchema>

export const PayTypeForm: React.FC = () => {
  const { selectedId, setIsFormOpen, setSelectedId } = usePayTypeHubStore()
  const { useGet, useSaveMutation } = useMasterfile('payType')
  const { data: existing, isLoading } = useGet(selectedId)

  const saveMutation = useSaveMutation()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(payTypeSchema),
    defaultValues: { name: '', sortNumber: null }
  })

  useEffect(
    function formResetter() {
      if (existing) reset({ name: existing.name || '', sortNumber: existing.sortNumber })
      else reset({ name: '', sortNumber: null })
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
        <PayTypeFormSkeleton />
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
          <PayIcon sx={{ fontSize: 25 }} />
          <Typography variant="h6">{selectedId ? 'Edit Pay Type' : 'New Pay Type'}</Typography>
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
                  label="Pay Type"
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
              name="sortNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ''}
                  label="Sort Number"
                  type="number"
                  fullWidth
                  margin="normal"
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
          {saveMutation.isPending ? 'Saving...' : 'Save Pay Type'}
        </Button>
      </Box>
    </Box>
  )
}


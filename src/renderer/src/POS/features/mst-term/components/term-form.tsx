import { zodResolver } from '@hookform/resolvers/zod'
import { Close as CloseIcon, Save as SaveIcon, EventNote as TermIcon } from '@mui/icons-material'
import { Alert, Box, Button, Grid, IconButton, TextField, Typography } from '@mui/material'
import { memo, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useTermHubStore } from '../store/use-term-hub-store'
import { TermFormSkeleton } from './term-form-skeleton'

const termSchema = z.object({
  name: z.string().min(1, 'Term is required'),
  numberOfDays: z.coerce.number().min(0, 'Days must be at least 0'),
  isDefault: z.boolean()
})

type FormData = z.infer<typeof termSchema>
function TermForm() {
  const { selectedId, setIsFormOpen, setSelectedId } = useTermHubStore()
  const { useGet, useSaveMutation } = useMasterfile('term')

  const { data: existing, isLoading } = useGet(selectedId)
  const saveMutation = useSaveMutation()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(termSchema),
    defaultValues: { name: '', numberOfDays: 0, isDefault: false }
  })

  useEffect(
    function formResetter() {
      if (selectedId && existing) {
        reset({
          name: existing.name || '',
          numberOfDays: existing.numberOfDays || 0,
          isDefault: existing.isDefault || false
        })
      } else if (!selectedId) {
        reset({ name: '', numberOfDays: 0, isDefault: false })
      }
    },
    [existing, reset, selectedId]
  )

  const handleClose = () => {
    setSelectedId(null)
    setIsFormOpen(false)
  }

  const onSubmit = async (formData: FormData) => {
    await saveMutation.mutateAsync({ ...formData, id: selectedId || undefined, isDefault: false })
    setIsFormOpen(false)
  }

  if (selectedId && isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <TermFormSkeleton />
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
          <TermIcon sx={{ fontSize: 25 }} />
          <Typography variant="h6">{selectedId ? 'Edit Term' : 'New Term'}</Typography>
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
                  label="Term"
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
              name="numberOfDays"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Number of Days"
                  type="number"
                  fullWidth
                  required
                  margin="normal"
                  error={!!errors.numberOfDays}
                  helperText={errors.numberOfDays?.message}
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
          {saveMutation.isPending ? 'Saving...' : 'Save Term'}
        </Button>
      </Box>
    </Box>
  )
}

export default memo(TermForm)


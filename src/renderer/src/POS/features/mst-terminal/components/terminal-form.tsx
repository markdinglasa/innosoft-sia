import { zodResolver } from '@hookform/resolvers/zod'
import {
  Close as CloseIcon,
  Save as SaveIcon,
  PointOfSale as TerminalIcon
} from '@mui/icons-material'
import { Alert, Box, Button, IconButton, TextField, Typography } from '@mui/material'
import { memo, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useTerminalHubStore } from '../store/use-terminal-hub-store'
import { TerminalFormSkeleton } from './terminal-form-skeleton'

const terminalSchema = z.object({
  name: z.string().min(1, 'Terminal Name is required')
})

type FormData = z.infer<typeof terminalSchema>

function TerminalForm() {
  const { selectedId, setIsFormOpen } = useTerminalHubStore()
  const { useGet, useSaveMutation } = useMasterfile('terminal')
  const { data: existing, isLoading } = useGet(selectedId)
  const saveMutation = useSaveMutation()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(terminalSchema),
    defaultValues: { name: '' }
  })

  useEffect(
    function formResetter() {
      if (existing)
        reset({
          name: existing.name || ''
        })
      else reset({ name: '' })
    },
    [existing, reset]
  )

  const onSubmit = async (formData: FormData) => {
    await saveMutation.mutateAsync({ ...formData, id: selectedId || undefined })
    setIsFormOpen(false)
  }

  const handleClose = () => {
    setIsFormOpen(false)
  }

  if (selectedId && isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <TerminalFormSkeleton />
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
          <TerminalIcon sx={{ fontSize: 25 }} />
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

        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Terminal"
              fullWidth
              required
              margin="normal"
              placeholder="e.g. 01"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />
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
          {saveMutation.isPending ? 'Saving...' : 'Save Terminal'}
        </Button>
      </Box>
    </Box>
  )
}

export default memo(TerminalForm)


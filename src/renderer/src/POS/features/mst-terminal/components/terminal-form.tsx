import { zodResolver } from '@hookform/resolvers/zod'
import {
  Close as CloseIcon,
  Save as SaveIcon,
  PointOfSale as TerminalIcon
} from '@mui/icons-material'
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
import { useTerminalHubStore } from '../store/use-terminal-hub-store'

const terminalSchema = z.object({
  name: z.string().min(1, 'Terminal Name is required')
})

type FormData = z.infer<typeof terminalSchema>

export const TerminalForm: React.FC = () => {
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

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TerminalIcon color="primary" sx={{ fontSize: 25 }} />
          <Typography variant="h6">{selectedId ? 'Edit Terminal' : 'New Terminal'}</Typography>
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
            render={({ field }) => (
              <TextField
                {...field}
                label="Terminal Name"
                fullWidth
                required
                margin="normal"
                placeholder="e.g. 01"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
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
              {saveMutation.isPending ? 'Saving...' : 'Save Terminal'}
            </Button>
          </Box>
        </form>
      )}
    </Box>
  )
}

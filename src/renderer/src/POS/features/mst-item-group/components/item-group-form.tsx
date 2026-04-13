import { zodResolver } from '@hookform/resolvers/zod'
import { Close as CloseIcon, Category as GroupIcon, Save as SaveIcon } from '@mui/icons-material'
import { Alert, Box, Button, Grid, IconButton, TextField, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useItemGroupHubStore } from '../store/use-item-group-hub-store'
import { ItemGroupFormSkeleton } from './item-group-form-skeleton'

const itemGroupSchema = z.object({
  name: z.string().min(1, 'Item Group Name is required')
})

type FormData = z.infer<typeof itemGroupSchema>

export const ItemGroupForm: React.FC = () => {
  const { selectedId, setIsFormOpen, setSelectedId } = useItemGroupHubStore()
  const { useGet, useSaveMutation } = useMasterfile('itemGroup')
  const { data: existing, isLoading } = useGet(selectedId)
  const saveMutation = useSaveMutation()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(itemGroupSchema),
    defaultValues: { name: '' }
  })

  useEffect(
    function formResetter() {
      if (existing) reset({ name: existing.name || '' })
      else reset({ name: '' })
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
        <ItemGroupFormSkeleton />
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
          <GroupIcon sx={{ fontSize: 25 }} />
          <Typography variant="h6">{selectedId ? 'Edit Category' : 'New Category'}</Typography>
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
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Category"
                  fullWidth
                  required
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name?.message}
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
          {saveMutation.isPending ? 'Saving...' : 'Save Item Group'}
        </Button>
      </Box>
    </Box>
  )
}


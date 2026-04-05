import { Close as CloseIcon, Save as SaveIcon } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { ToastType } from '@shared/types'
import { displayToast } from '@shared/utils'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useBranchHubStore } from '../store/use-branch-hub-store'

export const BranchForm: React.FC = () => {
  const { selectedBranchId, setSelectedBranchId, setIsFormOpen } = useBranchHubStore()
  const { useGet, useSaveMutation } = useMasterfile('branch')

  const { data: branch, isLoading } = useGet(selectedBranchId)
  const saveMutation = useSaveMutation()

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      address: '',
      description: '',
      isDefault: false
    }
  })

  useEffect(() => {
    if (branch) {
      reset({
        ...branch
      })
    } else {
      reset({
        name: '',
        address: '',
        description: '',
        isDefault: false
      })
    }
  }, [branch, reset])

  const onSubmit = async (data: any) => {
    try {
      await saveMutation.mutateAsync({
        ...data,
        isDefault: Boolean(data.isDefault),
        id: selectedBranchId
      })
      handleClose()
    } catch (error: unknown) {
      displayToast((error as Error)?.message || 'Sorry, Something went wrong.', ToastType.error)
    }
  }

  const handleClose = () => {
    setSelectedBranchId(null)
    setIsFormOpen(false)
  }

  if (selectedBranchId && isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={32} />
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
          bgcolor: 'primary.main',
          color: 'white'
        }}
      >
        <Typography variant="h6">{selectedBranchId ? 'Edit Branch' : 'New Branch'}</Typography>
        <IconButton size="small" onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon sx={{ fontSize: 25 }} />
        </IconButton>
      </Box>

      <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
        {saveMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {saveMutation.error?.message || 'Failed to save branch.'}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              {...register('name', { required: 'Name is required' })}
              label="Branch Name"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message as string}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register('address', { required: 'Address is required' })}
              label="Address"
              multiline
              rows={3}
              fullWidth
              error={!!errors.address}
              helperText={errors.address?.message as string}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField {...register('description')} label="Description" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="isDefault"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Set as Default Branch"
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
          {saveMutation.isPending ? 'Saving...' : 'Save Branch'}
        </Button>
      </Box>
    </Box>
  )
}


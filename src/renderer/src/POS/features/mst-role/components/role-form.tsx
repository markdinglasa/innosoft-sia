import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Security as SecurityIcon
} from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import React, { useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useRoleHubStore } from '../store/use-role-hub-store'

export const RoleForm: React.FC = () => {
  const { selectedRoleId, setSelectedRoleId, setIsFormOpen } = useRoleHubStore()
  const { useGet, useSaveMutation, useLookup } = useMasterfile('role')
  const { data: accessRights = [] } = useLookup('accessRight')

  const { data: role, isLoading } = useGet(selectedRoleId)
  const saveMutation = useSaveMutation()

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      code: '',
      name: '',
      description: '',
      isDefault: false,
      permissions: [] as any[]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'permissions'
  })

  useEffect(() => {
    if (role) {
      reset({
        ...role,
        permissions: role.permissions || []
      })
    } else {
      reset({
        code: '',
        name: '',
        description: '',
        isDefault: false,
        permissions: []
      })
    }
  }, [role, reset])

  const onSubmit = async (data: any) => {
    try {
      await saveMutation.mutateAsync({
        ...data,
        id: selectedRoleId
      })
      handleClose()
    } catch (err) {
      console.error('Save failed:', err)
    }
  }

  const handleClose = () => {
    setSelectedRoleId(null)
    setIsFormOpen(false)
  }

  if (selectedRoleId && isLoading) {
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
          bgcolor: 'secondary.main',
          color: 'white'
        }}
      >
        <Typography variant="h6">{selectedRoleId ? 'Edit Role' : 'New Role'}</Typography>
        <IconButton size="small" onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon sx={{ fontSize: 25 }} />
        </IconButton>
      </Box>

      <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
        {saveMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {saveMutation.error?.message || 'Failed to save role.'}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              {...register('code', { required: 'Code is required' })}
              label="Role Code"
              fullWidth
              error={!!errors.code}
              helperText={errors.code?.message as string}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              {...register('name', { required: 'Name is required' })}
              label="Role Name"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message as string}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register('description')}
              label="Description"
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, mb: 2 }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}
          >
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <SecurityIcon fontSize="small" />
              Permissions Matrix
            </Typography>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={() => append({ accessRightId: '' })}
            >
              Add Access Right
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {fields.map((field, index) => (
              <Paper
                key={field.id}
                variant="outlined"
                sx={{ p: 2, position: 'relative', bgcolor: 'grey.50' }}
              >
                <IconButton
                  size="small"
                  color="error"
                  sx={{ position: 'absolute', top: 4, right: 4 }}
                  onClick={() => remove(index)}
                >
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Controller
                      name={`permissions.${index}.accessRightId`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          label="Access Right / Action"
                          fullWidth
                          size="small"
                        >
                          {accessRights.map((ar: any) => (
                            <MenuItem key={ar.id} value={ar.id}>
                              [{ar.category}] {ar.action}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                </Grid>
              </Paper>
            ))}
            {fields.length === 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                textAlign="center"
                sx={{ display: 'block', py: 2 }}
              >
                This role currently has no permissions assigned.
              </Typography>
            )}
          </Box>
        </Box>
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
          color="secondary"
          type="submit"
          startIcon={<SaveIcon sx={{ fontSize: 25 }} />}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? 'Saving...' : 'Save Role'}
        </Button>
      </Box>
    </Box>
  )
}


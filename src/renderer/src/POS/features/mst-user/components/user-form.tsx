import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Save as SaveIcon
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
import { useUserHubStore } from '../store/use-user-hub-store'

export const UserForm: React.FC = () => {
  const { selectedUserId, setSelectedUserId, setIsFormOpen } = useUserHubStore()
  const { useGet, useSaveMutation, useLookup } = useMasterfile('user')
  const { data: branches = [] } = useLookup('branch') 
  
  const { data: user, isLoading } = useGet(selectedUserId)
  const saveMutation = useSaveMutation()

  const { control, register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      username: '',
      fullName: '',
      email: '',
      password: '',
      type: 'Teller',
      status: 'Active',
      branchAccesses: [] as any[]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'branchAccesses'
  })

  useEffect(() => {
    if (user) {
      reset({
        ...user,
        password: '', // Don't show password for editing
        branchAccesses: user.branchAccesses || []
      })
    } else {
      reset({
        username: '',
        fullName: '',
        email: '',
        password: '',
        type: 'Teller',
        status: 'Active',
        branchAccesses: []
      })
    }
  }, [user, reset])

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        id: selectedUserId // TypeORM handles save/update based on ID
      }
      
      // If editing and password is empty, don't update it
      if (selectedUserId && !data.password) {
        delete payload.password
      }

      await saveMutation.mutateAsync(payload)
      handleClose()
    } catch (err) {
      console.error('Save failed:', err)
    }
  }

  const handleClose = () => {
    setSelectedUserId(null)
    setIsFormOpen(false)
  }

  if (selectedUserId && isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6">{selectedUserId ? 'Edit User' : 'New User'}</Typography>
        <IconButton size="small" onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
        {saveMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {saveMutation.error?.message || 'Failed to save user.'}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              {...register('fullName', { required: 'Full name is required' })}
              label="Full Name"
              fullWidth
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              {...register('username', { required: 'Username is required' })}
              label="Username"
              fullWidth
              error={!!errors.username}
              helperText={errors.username?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              {...register('password', { required: !selectedUserId ? 'Password is required' : false })}
              label={selectedUserId ? 'Password (Optional)' : 'Password'}
              type="password"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register('email')}
              label="Email"
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <TextField {...field} select label="User Type" fullWidth>
                  <MenuItem value="Teller">Teller</MenuItem>
                  <MenuItem value="Cashier">Cashier</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField {...field} select label="Status" fullWidth>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Locked">Locked</MenuItem>
                </TextField>
              )}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold">Branch Access</Typography>
            <Button size="small" startIcon={<AddIcon />} onClick={() => append({ branchId: '', canOpenShift: true })}>
              Add Branch
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {fields.map((field, index) => (
              <Paper key={field.id} variant="outlined" sx={{ p: 2, position: 'relative' }}>
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
                      name={`branchAccesses.${index}.branchId`}
                      control={control}
                      render={({ field }) => (
                        <TextField 
                          {...field} 
                          select 
                          label="Branch" 
                          fullWidth 
                          size="small"
                        >
                          {branches.map((b: any) => (
                            <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                </Grid>
              </Paper>
            ))}
            {fields.length === 0 && (
              <Typography variant="caption" color="text.secondary" textAlign="center">
                This user currently has no branch access assigned.
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
          type="submit" 
          startIcon={<SaveIcon />}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? 'Saving...' : 'Save User'}
        </Button>
      </Box>
    </Box>
  )
}

import { zodResolver } from '@hookform/resolvers/zod'
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
import { ButtonType, ToastType } from '@shared/types'
import { displayToast } from '@shared/utils'
import React, { useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import CircleButton from '../../../components/inputs/circle-button'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useUserHubStore } from '../store/use-user-hub-store'

const userSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email').optional().nullable().or(z.literal('')),
  password: z.string().optional().nullable(),
  type: z.enum(['Teller', 'Cashier', 'Admin']),
  status: z.enum(['Active', 'Inactive', 'Locked']),
  branchAccesses: z
    .array(
      z.object({
        branchId: z.string().min(1, 'Branch is required')
      })
    )
    .default([])
})

type FormData = z.infer<typeof userSchema>

export const UserForm: React.FC = () => {
  const { selectedUserId, setSelectedUserId, setIsFormOpen } = useUserHubStore()
  const { useGet, useSaveMutation, useLookup } = useMasterfile('user')
  const { data: branches = [] } = useLookup('branch')

  const { data: user, isLoading } = useGet(selectedUserId)
  const saveMutation = useSaveMutation()

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: '',
      fullName: '',
      email: '',
      password: '',
      type: 'Teller' as const,
      status: 'Active' as const,
      branchAccesses: []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'branchAccesses'
  })

  useEffect(
    function formResetter() {
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
    },
    [user, reset]
  )

  const onSubmit = async (data: FormData) => {
    try {
      const payload: any = {
        ...data,
        id: selectedUserId // TypeORM handles save/update based on ID
      }
      // If editing and password is empty, don't update it
      if (selectedUserId && !data.password) {
        delete payload.password
      } else if (!selectedUserId && !data.password) {
        // Handle new user password if needed, but UI says system generated
        delete payload.password
      }

      await saveMutation.mutateAsync(payload)
      handleClose()
    } catch (error: unknown) {
      displayToast((error as Error)?.message || 'Sorry, Something went wrong.', ToastType.error)
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
        <Typography variant="h6">{selectedUserId ? 'Edit User' : 'New User'}</Typography>
        <IconButton size="small" onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon sx={{ fontSize: 25 }} />
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
              {...register('fullName')}
              label="Full Name"
              fullWidth
              required
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              {...register('username')}
              label="Username"
              fullWidth
              required
              error={!!errors.username}
              helperText={errors.username?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <TextField {...field} select label="User Type" fullWidth required>
                  <MenuItem value="Teller">Teller</MenuItem>
                  <MenuItem value="Cashier">Cashier</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register('email')}
              label="Email"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>
          {/* <Grid item xs={6}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField {...field} select label="Status" fullWidth required>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Locked">Locked</MenuItem>
                </TextField>
              )}
            />
          </Grid> */}
        </Grid>

        <Box sx={{ mt: 4, mb: 2 }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}
          >
            <Typography variant="subtitle2" fontWeight="bold">
              Branch Access
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => append({ branchId: '' })}
            >
              Branch
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {fields.map((field, index) => (
              <Paper key={field.id} variant="outlined" className="flex flex-row gap-2 p-2">
                <CircleButton
                  //disabled={!canDelete}
                  icon={<DeleteIcon sx={{ fontSize: 25 }} />}
                  onClick={() => remove(index)}
                  type={ButtonType.button}
                />

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
                          required
                          error={!!errors.branchAccesses?.[index]?.branchId}
                        >
                          {branches.map((b: any) => (
                            <MenuItem key={b.id} value={b.id}>
                              {b.name}
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
          startIcon={<SaveIcon sx={{ fontSize: 25 }} />}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? 'Saving...' : 'Save User'}
        </Button>
      </Box>
    </Box>
  )
}


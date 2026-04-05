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
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Skeleton,
  TextField,
  Typography
} from '@mui/material'
import { ButtonType, ToastType } from '@shared/types'
import { displayToast } from '@shared/utils'
import { truncate } from 'lodash'
import React, { useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { MstAccessRightEntity } from 'src/main/entities'
import CircleButton from '../../../components/inputs/circle-button'
import AccessControl from '../../../components/utils/access-control'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useRoleHubStore } from '../store/use-role-hub-store'

export const RoleForm: React.FC = () => {
  const { selectedRoleId, setSelectedRoleId, setIsFormOpen } = useRoleHubStore()
  const { useGet, useSaveMutation, useLookup } = useMasterfile('role')

  const { data: accessRights, isLoading: isAccessRightsLoading } = useLookup('accessRight')
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
      const code = data?.name.toUpperCase().replace(/\s/g, '_')
      await saveMutation.mutateAsync({
        ...data,
        code,
        id: selectedRoleId
      })
      handleClose()
    } catch (error: unknown) {
      displayToast((error as Error)?.message || 'Sorry, Something went wrong.', ToastType.error)
    }
  }

  const handleClose = () => {
    setSelectedRoleId(null)
    setIsFormOpen(false)
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
        <AccessControl condition={!!selectedRoleId && isLoading}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Skeleton variant="rectangular" height={40} width="100%" sx={{ borderRadius: 1 }} />
            </Grid>
            <Grid item xs={12}>
              <Skeleton variant="rectangular" height={40} width="100%" sx={{ borderRadius: 1 }} />
            </Grid>
          </Grid>
        </AccessControl>
        <AccessControl condition={!isLoading}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
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
        </AccessControl>

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
              <SecurityIcon sx={{ fontSize: 25 }} />
              Permissions
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon sx={{ fontSize: 25 }} />}
              disabled={isAccessRightsLoading}
              onClick={() => {
                if (fields.length > 0 && accessRights.length > 0) {
                  displayToast('All available access rights have been assigned.', ToastType.info)
                  return
                }
                append({ accessRightId: '' })
              }}
            >
              Access Right
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {fields.map((field, index) => (
              <Paper key={field.id} variant="outlined" className="flex flex-row gap-2 p-2">
                <CircleButton
                  icon={<DeleteIcon sx={{ fontSize: 25 }} className="text-red-800" />}
                  type={ButtonType.button}
                  onClick={() => remove(index)}
                />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Controller
                      name={`permissions.${index}.accessRightId`}
                      control={control}
                      render={({ field }) =>
                        isAccessRightsLoading || isLoading ? (
                          <Skeleton
                            variant="rectangular"
                            className="border-red"
                            height={40}
                            width="100%"
                            sx={{ borderRadius: 1 }}
                          />
                        ) : (
                          <TextField
                            {...field}
                            select
                            label="Access Right / Action"
                            fullWidth
                            size="small"
                            SelectProps={{
                              MenuProps: {
                                PaperProps: {
                                  sx: {
                                    maxHeight: 400
                                  }
                                }
                              }
                            }}
                          >
                            {accessRights.map((ar: MstAccessRightEntity) => (
                              <MenuItem key={ar.id} value={ar.id}>
                                [{ar.category}]{' '}
                                {truncate(ar.action, { length: 40, omission: '...' })}
                              </MenuItem>
                            ))}
                          </TextField>
                        )
                      }
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
          color="primary"
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


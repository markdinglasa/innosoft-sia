import { zodResolver } from '@hookform/resolvers/zod'
import { Close as CloseIcon, Save as SaveIcon, Store as StoreIcon } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  TextField,
  Typography
} from '@mui/material'
import { memo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useBranchHubStore } from '../store/use-branch-hub-store'

const branchSchema = z.object({
  name: z.string().min(2, 'Branch must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  description: z.string().nullable().optional(),
  isDefault: z.boolean().default(false)
})

function BranchForm() {
  const { selectedBranchId, setIsFormOpen } = useBranchHubStore()
  const { useGet, useSaveMutation } = useMasterfile('branch')

  const { data: branch, isLoading } = useGet(selectedBranchId)
  const saveMutation = useSaveMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: '',
      address: '',
      description: '',
      isDefault: false
    }
  })

  useEffect(
    function formResetter() {
      if (branch) {
        reset({
          name: branch.name || '',
          address: branch.address || '',
          description: branch.description || '',
          isDefault: !!branch.isDefault
        })
      } else {
        reset({
          name: '',
          address: '',
          description: '',
          isDefault: false
        })
      }
    },
    [branch, reset]
  )

  const onSubmit = async (data: z.infer<typeof branchSchema>) => {
    await saveMutation.mutateAsync({
      ...data,
      id: selectedBranchId
    })
    handleClose()
  }

  const handleClose = () => {
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
        <Typography variant="h6" className="flex flex-row gap-2">
          <StoreIcon sx={{ fontSize: 25 }} />
          {selectedBranchId ? 'Edit Branch' : 'New Branch'}
        </Typography>
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
              {...register('name')}
              label="Branch"
              fullWidth
              required
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register('address')}
              label="Address"
              multiline
              rows={3}
              fullWidth
              required
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField {...register('description')} label="Description" fullWidth />
          </Grid>
          {/* <Grid item xs={12}>
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
          </Grid> */}
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

export default memo(BranchForm)


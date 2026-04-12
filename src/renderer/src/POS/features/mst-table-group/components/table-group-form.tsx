import { zodResolver } from '@hookform/resolvers/zod'
import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  TableChart as GroupIcon,
  Save as SaveIcon
} from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import { ButtonType } from '@shared/types'
import { memo, useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { z } from 'zod'
import CircleButton from '../../../components/inputs/circle-button'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useTableGroupHubStore } from '../store/use-table-group-hub-store'
import { TableGroupFormSkeleton } from './table-group-form-skeleton'

const tableGroupSchema = z.object({
  name: z.string().min(1, 'Table Group Name is required'),
  tables: z
    .array(
      z.object({
        id: z.number().optional(),
        tableCode: z
          .string()
          .min(1, 'Table Code is required')
          .max(30, 'Table Code must be at most 30 characters')
      })
    )
    .optional()
})

type FormData = z.infer<typeof tableGroupSchema>

function TableGroupForm() {
  const { selectedId, setIsFormOpen, setSelectedId } = useTableGroupHubStore()
  const activeBranch = useSelector((state: any) => state.POS.manager.activeBranch)
  const { useGet, useSaveMutation } = useMasterfile('tableGroup')
  const { data: existing, isLoading } = useGet(selectedId)
  const saveMutation = useSaveMutation()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(tableGroupSchema),
    defaultValues: { name: '', tables: [] }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tables'
  })

  useEffect(
    function formResetter() {
      if (selectedId && existing) {
        reset({ name: existing.name || '', tables: existing.tables || [] })
      } else if (!selectedId) {
        reset({ name: '', tables: [] })
      }
    },
    [existing, reset, selectedId]
  )

  const onSubmit = async (formData: FormData) => {
    const { tables, ...parent } = formData
    await saveMutation.mutateAsync({
      parent: { 
        ...parent, 
        id: selectedId || undefined,
        branchId: activeBranch?.id || 1
      },
      tables: tables || []
    })
    setIsFormOpen(false)
  }

  const handleClose = () => {
    setSelectedId(null)
    setIsFormOpen(false)
  }

  if (selectedId && isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <TableGroupFormSkeleton />
      </Box>
    )
  }

  return (
    <Box
      component="form"
      aria-label="table-group-form"
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
          <Typography variant="h6">
            {selectedId ? 'Edit Table Group' : 'New Table Group'}
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon sx={{ fontSize: 25 }} />
        </IconButton>
      </Box>
      <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
        {saveMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {saveMutation.error?.message || 'Failed to save table group.'}
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
                  label="Table Group"
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
            <Box
              sx={{
                mt: 4,
                mb: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <GroupIcon sx={{ fontSize: 25 }} />
                Assigned Tables
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon sx={{ fontSize: 25 }} />}
                onClick={() => append({ tableCode: '' })}
              >
                Add Table
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {fields.map((field, index) => (
                <Paper key={field.id} variant="outlined" className="flex flex-row gap-2 p-2">
                  <CircleButton
                    icon={<DeleteIcon color="primary" sx={{ fontSize: 25 }} />}
                    type={ButtonType.button}
                    onClick={() => remove(index)}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Controller
                        name={`tables.${index}.tableCode`}
                        control={control}
                        render={({ field: inputField, fieldState }) => (
                          <TextField
                            {...inputField}
                            label="Table"
                            size="small"
                            fullWidth
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            placeholder="e.g. T1"
                          />
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
                  This table group currently has no tables assigned.
                </Typography>
              )}
            </Box>
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
          {saveMutation.isPending ? 'Saving...' : 'Save Table Group'}
        </Button>
      </Box>
    </Box>
  )
}

export default memo(TableGroupForm)


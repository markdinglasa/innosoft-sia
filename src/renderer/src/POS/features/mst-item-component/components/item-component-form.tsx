import { zodResolver } from '@hookform/resolvers/zod'
import {
  Close as CloseIcon,
  Extension as ComponentIcon,
  Save as SaveIcon
} from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useItemComponentHubStore } from '../store/use-item-component-hub-store'
import { ItemComponentFormSkeleton } from './item-component-form-skeleton'

interface FormData {
  itemId: number
  componentItemId: number
  unitId: number
  quantity: number
  cost: number
  amount: number
  isPrinted: boolean
}

const itemComponentSchema: z.ZodType<FormData, any, any> = z.object({
  itemId: z.coerce.number().min(1, 'Item required'),
  componentItemId: z.coerce.number().min(1, 'Component required'),
  unitId: z.coerce.number().min(1, 'Unit required'),
  quantity: z.coerce.number().min(0.00001, 'Quantity is required'),
  cost: z.coerce.number().min(0, 'Cost is required'),
  amount: z.coerce.number().min(0).default(0),
  isPrinted: z.boolean().default(false)
})

export const ItemComponentForm: React.FC = () => {
  const { selectedId, setIsFormOpen, setSelectedId } = useItemComponentHubStore()
  const { useGet, useSaveMutation, useLookup } = useMasterfile('itemComponent')
  const { data: existing, isLoading } = useGet(selectedId)
  const saveMutation = useSaveMutation()

  const parentItemsLookup = useLookup('item', { filters: [{ isInventory: false }] })
  const componentsLookup = useLookup('item', { filters: [{ isInventory: true }] })
  const unitsLookup = useLookup('unit')

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(itemComponentSchema),
    defaultValues: {
      itemId: 0,
      componentItemId: 0,
      unitId: 0,
      quantity: 1,
      cost: 0,
      amount: 0,
      isPrinted: false
    }
  })

  const watchQuantity = watch('quantity') as number
  const watchCost = watch('cost') as number

  useEffect(() => {
    setValue('amount', (watchQuantity || 0) * (watchCost || 0))
  }, [watchQuantity, watchCost, setValue])

  useEffect(
    function formResetter() {
      if (existing)
        reset({
          itemId: existing.itemId || 0,
          componentItemId: existing.componentItemId || 0,
          unitId: existing.unitId || 0,
          quantity: existing.quantity || 1,
          cost: existing.cost || 0,
          amount: existing.amount || 0,
          isPrinted: existing.isPrinted || false
        })
      else
        reset({
          itemId: 0,
          componentItemId: 0,
          unitId: 0,
          quantity: 1,
          cost: 0,
          amount: 0,
          isPrinted: false
        })
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
        <ItemComponentFormSkeleton />
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
          <ComponentIcon sx={{ fontSize: 25 }} />
          <Typography variant="h6">{selectedId ? 'Edit Component' : 'New Component'}</Typography>
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
              name="itemId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Finished Product (Parent)"
                  fullWidth
                  required
                  size="small"
                  error={!!errors.itemId}
                  helperText={errors.itemId?.message}
                >
                  {parentItemsLookup.data?.map((item: any) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="componentItemId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Ingredient (Component)"
                  fullWidth
                  required
                  size="small"
                  error={!!errors.componentItemId}
                  helperText={errors.componentItemId?.message}
                >
                  {componentsLookup.data?.map((item: any) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="unitId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Unit"
                  fullWidth
                  required
                  size="small"
                  error={!!errors.unitId}
                  helperText={errors.unitId?.message}
                >
                  {unitsLookup.data?.map((unit: any) => (
                    <MenuItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="quantity"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Quantity"
                  type="number"
                  fullWidth
                  required
                  size="small"
                  error={!!errors.quantity}
                  helperText={errors.quantity?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="cost"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Unit Cost"
                  type="number"
                  fullWidth
                  required
                  size="small"
                  error={!!errors.cost}
                  helperText={errors.cost?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Total Amount"
                  type="number"
                  fullWidth
                  required
                  size="small"
                  InputProps={{ readOnly: true }}
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="isPrinted"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Print on Slips"
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
          {saveMutation.isPending ? 'Saving...' : 'Save Component'}
        </Button>
      </Box>
    </Box>
  )
}


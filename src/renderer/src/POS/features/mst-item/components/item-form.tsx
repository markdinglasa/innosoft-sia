import { zodResolver } from '@hookform/resolvers/zod'
import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Inventory as ItemIcon,
  Save as SaveIcon
} from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useItemHubStore } from '../store/use-item-hub-store'

const itemSchema = z.object({
  itemCode: z.string().min(1, 'Item Code is required'),
  barCode: z.string().nullable().optional(),
  name: z.string().min(1, 'Item Name is required'),
  description: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  unitId: z.string().min(1, 'Base Unit is required'),
  price: z.coerce.number().min(0, 'Default Price must be at least 0'),
  cost: z.coerce.number().min(0, 'Standard Cost must be at least 0'),
  isInventory: z.boolean().default(true),
  isPackage: z.boolean().default(false),
  itemPrices: z
    .array(
      z.object({
        priceDescription: z.string().min(1, 'Description is required'),
        price: z.coerce.number().min(0, 'Price must be at least 0'),
        triggerQuantity: z.coerce.number().min(0, 'Min Qty must be at least 0')
      })
    )
    .default([])
})

type FormData = z.infer<typeof itemSchema>

export const ItemForm: React.FC = () => {
  const { selectedItemId, setSelectedItemId, setIsFormOpen } = useItemHubStore()
  const [activeTab, setActiveTab] = useState(0)

  const { useGet, useSaveMutation, useLookup } = useMasterfile('item')
  const { data: units = [] } = useLookup('unit')
  const { data: categories = [] } = useLookup('itemGroup')

  const { data: item, isLoading } = useGet(selectedItemId)
  const saveMutation = useSaveMutation()

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      itemCode: '',
      barCode: '',
      name: '',
      description: '',
      category: '',
      unitId: '',
      price: 0,
      cost: 0,
      isInventory: true,
      isPackage: false,
      itemPrices: []
    }
  })

  const {
    fields: priceFields,
    append: appendPrice,
    remove: removePrice
  } = useFieldArray({
    control,
    name: 'itemPrices'
  })

  useEffect(
    function formResetter() {
      if (item) {
        reset({
          itemCode: item.itemCode || '',
          barCode: item.barCode || '',
          name: item.name || '',
          description: item.description || '',
          category: item.category || '',
          unitId: item.unitId || '',
          price: item.price || 0,
          cost: item.cost || 0,
          isInventory: !!item.isInventory,
          isPackage: !!item.isPackage,
          itemPrices: item.itemPrices || []
        })
      } else {
        reset({
          itemCode: '',
          barCode: '',
          name: '',
          description: '',
          category: '',
          unitId: '',
          price: 0,
          cost: 0,
          isInventory: true,
          isPackage: false,
          itemPrices: []
        })
      }
    },
    [item, reset]
  )

  const onSubmit = async (data: FormData) => {
    await saveMutation.mutateAsync({
      ...data,
      id: selectedItemId
    })
    handleClose()
  }

  const handleClose = () => {
    setSelectedItemId(null)
    setIsFormOpen(false)
  }

  if (selectedItemId && isLoading) {
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
          bgcolor: 'primary.dark',
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ItemIcon sx={{ fontSize: 25 }} />
          <Typography variant="h6">{selectedItemId ? 'Edit Item' : 'New Item'}</Typography>
        </Box>
        <IconButton size="small" onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon sx={{ fontSize: 25 }} />
        </IconButton>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="General" />
        <Tab label="Prices" />
        <Tab label="Packages" disabled={!selectedItemId} />
      </Tabs>

      <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
        {saveMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {saveMutation.error?.message || 'Failed to save item.'}
          </Alert>
        )}

        {activeTab === 0 && (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                {...register('itemCode')}
                label="Item Code"
                fullWidth
                required
                size="small"
                error={!!errors.itemCode}
                helperText={errors.itemCode?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField {...register('barCode')} label="Barcode" fullWidth size="small" />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register('name')}
                label="Item Name"
                fullWidth
                required
                size="small"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register('description')}
                label="Description"
                fullWidth
                size="small"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Category" fullWidth size="small">
                    {categories.map((c: any) => (
                      <MenuItem key={c.id} value={c.name}>
                        {c.name}
                      </MenuItem>
                    ))}
                    <MenuItem value="">Uncategorized</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="unitId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Base Unit"
                    fullWidth
                    required
                    size="small"
                    error={!!errors.unitId}
                    helperText={errors.unitId?.message}
                  >
                    {units.map((u: any) => (
                      <MenuItem key={u.id} value={u.id}>
                        {u.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                {...register('cost')}
                label="Standard Cost"
                type="number"
                fullWidth
                required
                size="small"
                error={!!errors.cost}
                helperText={errors.cost?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                {...register('price')}
                label="Default Price"
                type="number"
                fullWidth
                required
                size="small"
                error={!!errors.price}
                helperText={errors.price?.message}
                InputProps={{ sx: { fontWeight: 'bold', color: 'primary.main' } }}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="isInventory"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={!!field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Inventory Item"
                  />
                )}
              />
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Box>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
            >
              <Typography variant="caption" color="text.secondary">
                Special pricing tiers and branch-specific rates.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => appendPrice({ priceDescription: '', price: 0, triggerQuantity: 0 })}
              >
                Add Price Tier
              </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Min Qty</TableCell>
                    <TableCell width={50}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {priceFields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <TextField
                          {...register(`itemPrices.${index}.priceDescription`)}
                          fullWidth
                          required
                          variant="standard"
                          placeholder="e.g. Wholesale"
                          error={!!errors.itemPrices?.[index]?.priceDescription}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          {...register(`itemPrices.${index}.price`)}
                          type="number"
                          fullWidth
                          required
                          variant="standard"
                          sx={{ textAlign: 'right' }}
                          error={!!errors.itemPrices?.[index]?.price}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          {...register(`itemPrices.${index}.triggerQuantity`)}
                          type="number"
                          fullWidth
                          required
                          variant="standard"
                          error={!!errors.itemPrices?.[index]?.triggerQuantity}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" color="error" onClick={() => removePrice(index)}>
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {priceFields.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                        No special price tiers defined.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
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
          {saveMutation.isPending ? 'Saving...' : 'Save Item'}
        </Button>
      </Box>
    </Box>
  )
}


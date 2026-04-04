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
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useItemHubStore } from '../store/use-item-hub-store'

export const ItemForm: React.FC = () => {
  const { selectedItemId, setSelectedItemId, setIsFormOpen } = useItemHubStore()
  const [activeTab, setActiveTab] = useState(0)
  
  const { useGet, useSaveMutation, useLookup } = useMasterfile('item')
  const { data: units = [] } = useLookup('unit')
  const { data: categories = [] } = useLookup('itemGroup')
  
  const { data: item, isLoading } = useGet(selectedItemId)
  const saveMutation = useSaveMutation()

  const { control, register, handleSubmit, reset, formState: { errors } } = useForm({
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
      itemPrices: [] as any[]
    }
  })

  const { fields: priceFields, append: appendPrice, remove: removePrice } = useFieldArray({
    control,
    name: 'itemPrices'
  })

  useEffect(() => {
    if (item) {
      reset({
        ...item,
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
  }, [item, reset])

  const onSubmit = async (data: any) => {
    try {
      await saveMutation.mutateAsync({
        ...data,
        id: selectedItemId
      })
      handleClose()
    } catch (err) {
      console.error('Save failed:', err)
    }
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
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'primary.dark', color: 'white' }}>
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
                {...register('itemCode', { required: 'Code is required' })}
                label="Item Code"
                fullWidth
                size="small"
                error={!!errors.itemCode}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                {...register('barCode')}
                label="Barcode"
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register('name', { required: 'Name is required' })}
                label="Item Name"
                fullWidth
                size="small"
                error={!!errors.name}
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
                      <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>
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
                  <TextField {...field} select label="Base Unit" fullWidth size="small">
                    {units.map((u: any) => (
                      <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
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
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                {...register('price')}
                label="Default Price"
                type="number"
                fullWidth
                size="small"
                InputProps={{ sx: { fontWeight: 'bold', color: 'primary.main' } }}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="isInventory"
                control={control}
                render={({ field }) => (
                  <FormControlLabel 
                    control={<Switch checked={field.value} onChange={field.onChange} />} 
                    label="Inventory Item" 
                  />
                )}
              />
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Special pricing tiers and branch-specific rates.
              </Typography>
              <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={() => appendPrice({ priceDescription: '', price: 0, triggerQuantity: 0 })}>
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
                          variant="standard" 
                          placeholder="e.g. Wholesale" 
                        />
                      </TableCell>
                      <TableCell>
                        <TextField 
                          {...register(`itemPrices.${index}.price`)} 
                          type="number" 
                          fullWidth 
                          variant="standard" 
                          sx={{ textAlign: 'right' }} 
                        />
                      </TableCell>
                      <TableCell>
                        <TextField 
                          {...register(`itemPrices.${index}.triggerQuantity`)} 
                          type="number" 
                          fullWidth 
                          variant="standard" 
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

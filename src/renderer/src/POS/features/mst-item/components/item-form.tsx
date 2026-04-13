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
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material'
import { ButtonType } from '@shared/types'
import { memo, useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import CircleButton from '../../../components/inputs/circle-button'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useItemHubStore } from '../store/use-item-hub-store'
import { ItemFormSkeleton } from './item-form-skeleton'

const itemSchema = z.object({
  itemCode: z.string().min(1, 'Item Code is required'),
  barCode: z.string().nullable().optional().or(z.literal('')),
  name: z.string().min(1, 'Item Name is required'),
  description: z.string().nullable().optional().or(z.literal('')),
  genericName: z.string().nullable().optional().or(z.literal('')),
  category: z.string().nullable().optional().or(z.literal('')),
  unitId: z.coerce.number().min(1, 'Base Unit is required'),
  price: z.coerce.number().min(0, 'Default Price must be at least 0'),
  cost: z.coerce.number().min(0, 'Standard Cost must be at least 0'),
  salesAccountId: z.coerce.number().min(1, 'Sales Account is required'),
  assetAccountId: z.coerce.number().min(1, 'Asset Account is required'),
  costAccountId: z.coerce.number().min(1, 'Cost Account is required'),
  inTaxId: z.coerce.number().min(1, 'Inbound Tax is required'),
  outTaxId: z.coerce.number().min(1, 'Outbound Tax is required'),
  defaultSupplierId: z.coerce.number().optional().nullable(),
  isInventory: z.boolean().default(true),
  isPackage: z.boolean().default(false),
  itemPrices: z
    .array(
      z.object({
        id: z.number().optional(),
        priceDescription: z.string().min(1, 'Description is required'),
        price: z.coerce.number().min(0, 'Price must be at least 0'),
        triggerQuantity: z.coerce.number().min(0, 'Min Qty must be at least 0')
      })
    )
    .default([])
})

type FormData = z.infer<typeof itemSchema>

function ItemForm() {
  const { selectedId, setSelectedId, setIsFormOpen } = useItemHubStore()
  const [activeTab, setActiveTab] = useState(0)

  const { useGet, useSaveMutation, useLookup } = useMasterfile('item')
  const { data: units = [] } = useLookup('unit')
  const { data: categories = [] } = useLookup('itemGroup')
  const { data: accounts = [] } = useLookup('account')
  const { data: taxes = [] } = useLookup('tax')
  const { data: suppliers = [] } = useLookup('supplier')

  const { data: item, isLoading } = useGet(selectedId)
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
      genericName: '',
      category: '',
      unitId: 0 as any,
      price: 0,
      cost: 0,
      salesAccountId: 6, // Default to Sales Account from seed if possible or 1
      assetAccountId: 3, // Default to Inventory Account
      costAccountId: 7, // Default to Cost of Sales
      inTaxId: 0,
      outTaxId: 0,
      defaultSupplierId: '' as any,
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
      // Create mode
      if (!selectedId) {
        reset({
          itemCode: '',
          barCode: '',
          name: '',
          description: '',
          genericName: '',
          category: '',
          unitId: '' as any,
          price: 0,
          cost: 0,
          salesAccountId: 6,
          assetAccountId: 3,
          costAccountId: 7,
          inTaxId: 1,
          outTaxId: 1,
          defaultSupplierId: '' as any,
          isInventory: true,
          isPackage: false,
          itemPrices: []
        })
        return
      }

      // Edit mode
      if (item) {
        reset({
          itemCode: item.itemCode || '',
          barCode: item.barCode || '',
          name: item.name || '',
          description: item.description || '',
          genericName: item.genericName || '',
          category: item.category || '',
          unitId: item.unitId ?? '',
          price: item.price || 0,
          cost: item.cost || 0,
          salesAccountId: item.salesAccountId || 6,
          assetAccountId: item.assetAccountId || 3,
          costAccountId: item.costAccountId || 7,
          inTaxId: item.inTaxId || 1,
          outTaxId: item.outTaxId || 1,
          defaultSupplierId: item.defaultSupplierId ?? '',
          isInventory: !!item.isInventory,
          isPackage: !!item.isPackage,
          itemPrices: (item.itemPrices || []).map((p: any) => ({
            id: p.id,
            priceDescription: p.priceDescription,
            price: Number(p.price),
            triggerQuantity: Number(p.triggerQuantity)
          }))
        })
      }
    },
    [item, reset, selectedId]
  )

  const onSubmit = async (data: FormData) => {
    try {
      const { itemPrices, ...baseFields } = data
      const payload: any = {
        parent: {
          ...baseFields,
          id: selectedId || undefined
        },
        itemPrices: itemPrices || []
      }

      await saveMutation.mutateAsync(payload)
      handleClose()
    } catch (error: unknown) {
      // Form errors are handled by field state, but we catch async issues here
      console.error('Save failed:', error)
    }
  }

  const handleClose = () => {
    setSelectedId(null)
    setIsFormOpen(false)
  }

  if (selectedId && isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <ItemFormSkeleton />
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
          <Typography variant="h6">{selectedId ? 'Edit Item' : 'New Item'}</Typography>
        </Box>
        <IconButton size="small" onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon sx={{ fontSize: 25 }} />
        </IconButton>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="General" />
        <Tab label="GL Accounts" />
        <Tab label="Taxes" />
        <Tab label="Prices" />
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
              <TextField {...register('genericName')} label="Generic Name" fullWidth size="small" />
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
                  <TextField
                    {...field}
                    value={field.value ?? ''}
                    select
                    label="Category"
                    fullWidth
                    size="small"
                  >
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
                    value={field.value ?? ''}
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                Map this item to specific General Ledger accounts for financial reporting.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="salesAccountId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value ?? ''}
                    select
                    label="Sales Account"
                    fullWidth
                    size="small"
                    required
                  >
                    {accounts.map((a: any) => (
                      <MenuItem key={a.id} value={a.id}>
                        {a.code} - {a.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="assetAccountId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value ?? ''}
                    select
                    label="Asset (Inventory) Account"
                    fullWidth
                    size="small"
                    required
                  >
                    {accounts.map((a: any) => (
                      <MenuItem key={a.id} value={a.id}>
                        {a.code} - {a.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="costAccountId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value ?? ''}
                    select
                    label="Cost of Sales Account"
                    fullWidth
                    size="small"
                    required
                  >
                    {accounts.map((a: any) => (
                      <MenuItem key={a.id} value={a.id}>
                        {a.code} - {a.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="defaultSupplierId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value ?? ''}
                    select
                    label="Default Supplier"
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="">None</MenuItem>
                    {suppliers.map((s: any) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
        )}

        {activeTab === 2 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                Tax configuration for purchasing and selling this item.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="inTaxId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value ?? ''}
                    select
                    label="Purchase Tax (Inbound)"
                    fullWidth
                    size="small"
                    required
                  >
                    {taxes.map((t: any) => (
                      <MenuItem key={t.id} value={t.id}>
                        {t.name} ({t.rate}%)
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="outTaxId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value ?? ''}
                    select
                    label="Sales Tax (Outbound)"
                    fullWidth
                    size="small"
                    required
                  >
                    {taxes.map((t: any) => (
                      <MenuItem key={t.id} value={t.id}>
                        {t.name} ({t.rate}%)
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
        )}

        {activeTab === 3 && (
          <Box>
            <Box
              sx={{
                mt: 2,
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Special pricing tiers and branch-specific rates.
              </Typography>
              <Button
                size="small"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => appendPrice({ priceDescription: '', price: 0, triggerQuantity: 0 })}
              >
                New Price Tier
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {priceFields.map((field, index) => (
                <Paper key={field.id} variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <CircleButton
                      icon={<DeleteIcon color="primary" sx={{ fontSize: 25 }} />}
                      type={ButtonType.button}
                      onClick={() => removePrice(index)}
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          {...register(`itemPrices.${index}.priceDescription`)}
                          label="Description"
                          fullWidth
                          size="small"
                          required
                          placeholder="e.g. Wholesale"
                          error={!!errors.itemPrices?.[index]?.priceDescription}
                          helperText={errors.itemPrices?.[index]?.priceDescription?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          {...register(`itemPrices.${index}.price`)}
                          type="number"
                          label="Price"
                          fullWidth
                          size="small"
                          required
                          error={!!errors.itemPrices?.[index]?.price}
                          helperText={errors.itemPrices?.[index]?.price?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          {...register(`itemPrices.${index}.triggerQuantity`)}
                          type="number"
                          label="Min Quantity"
                          fullWidth
                          size="small"
                          required
                          error={!!errors.itemPrices?.[index]?.triggerQuantity}
                          helperText={errors.itemPrices?.[index]?.triggerQuantity?.message}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              ))}
              {priceFields.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    No special pricing tiers defined. Click "New Price Tier" to start.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
        {activeTab === 4 && (
          <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Package components management coming soon.
            </Typography>
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

export default memo(ItemForm)


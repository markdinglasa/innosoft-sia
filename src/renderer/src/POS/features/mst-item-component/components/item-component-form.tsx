import { zodResolver } from '@hookform/resolvers/zod'
import {
  Add as AddIcon,
  Extension as ComponentIcon,
  Delete as DeleteIcon,
  Inventory as PackageIcon,
  Save as SaveIcon
} from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
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
import { SystemPermissions } from '@shared/constants/permissions'
import { ButtonType, ToastType } from '@shared/types'
import { displayToast } from '@shared/utils'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import CircleButton from '../../../components/inputs/circle-button'
import { useAccessControl } from '../../../hooks'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useItemComponentHubStore } from '../store/use-item-component-hub-store'
import { ItemComponentFormSkeleton } from './item-component-form-skeleton'

interface FormData {
  childId: number | '' // Used for both componentItemId and packageItemId
  unitId: number | ''
  quantity: number
  cost: number
  amount: number
  isPrinted: boolean
  isOptional: boolean
}

const itemSchema: z.ZodType<FormData, any, any> = z.object({
  childId: z.coerce.number().min(1, 'Item selection is required'),
  unitId: z.coerce.number().min(1, 'Unit is required'),
  quantity: z.coerce.number().min(0.00001, 'Quantity is required'),
  cost: z.coerce.number().min(0, 'Cost is required'),
  amount: z.coerce.number().min(0).default(0),
  isPrinted: z.boolean().default(false),
  isOptional: z.boolean().default(false)
})

export const ItemComponentForm: React.FC = () => {
  const {
    selectedParentId,
    selectedParentName,
    selectedId,
    setSelectedId,
    activeTab,
    setActiveTab
  } = useItemComponentHubStore()

  const { hasPermission } = useAccessControl()
  const canAdd = hasPermission(SystemPermissions.ITEM_COMPONENT_ADD)
  const canDelete = hasPermission(SystemPermissions.ITEM_COMPONENT_REMOVE)

  // Determine service and labels based on tab
  const isBOM = activeTab === 0
  const serviceName = isBOM ? 'itemComponent' : 'itemPackage'
  const childKey = isBOM ? 'componentItemId' : 'packageItemId'
  const relationKey = isBOM ? 'componentItem' : 'packageItem'
  const tabTitle = isBOM ? 'Bill of Materials' : 'Package Items'

  const { useList, useGet, useSaveMutation, useDeleteMutation, useLookup } =
    useMasterfile(serviceName)
  const { data: existing, isLoading: isLoadingExisting } = useGet(selectedId)
  const saveMutation = useSaveMutation()
  const deleteMutation = useDeleteMutation()

  // Lookup based on tab
  // BOM: Inventoriable ingredients
  // Package: Uninventoriable menu items
  const lookupFilters = isBOM ? [{ isInventory: true }] : [{ isInventory: false }]
  const childrenLookup = useLookup('item', { filters: lookupFilters })
  const unitsLookup = useLookup('unit')

  const {
    data: listData,
    isLoading: isLoadingList,
    isError: isListError
  } = useList({
    page: 1,
    take: 100,
    filters: [{ itemId: selectedParentId }]
  })

  const items = (listData as any)?.items || []

  // Delete dialog state
  const [deleteId, setDeleteId] = React.useState<number | null>(null)
  const [showAddForm, setShowAddForm] = React.useState(false)

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      childId: '',
      unitId: '',
      quantity: 1,
      cost: 0,
      amount: 0,
      isPrinted: false,
      isOptional: false
    }
  })

  const watchQuantity = watch('quantity') as number
  const watchCost = watch('cost') as number

  useEffect(() => {
    setValue('amount', (watchQuantity || 0) * (watchCost || 0))
  }, [watchQuantity, watchCost, setValue])

  useEffect(
    function formResetter() {
      if (existing) {
        reset({
          childId: (existing as any)[childKey] || '',
          unitId: existing.unitId || '',
          quantity: existing.quantity || 1,
          cost: existing.cost || 0,
          amount: existing.amount || 0,
          isPrinted: existing.isPrinted || false,
          isOptional: existing.isOptional || false
        })
        setShowAddForm(true)
      } else {
        reset({
          childId: '',
          unitId: '',
          quantity: 1,
          cost: 0,
          amount: 0,
          isPrinted: false,
          isOptional: false
        })
      }
    },
    [existing, reset, childKey]
  )

  const handleCancelForm = () => {
    setSelectedId(null)
    setShowAddForm(false)
    reset({
      childId: '',
      unitId: '',
      quantity: 1,
      cost: 0,
      amount: 0,
      isPrinted: false,
      isOptional: false
    })
  }

  const onSubmit = async (formData: FormData) => {
    if (!selectedParentId) {
      displayToast('Please select a parent item first.', ToastType.warning)
      return
    }
    const payload = {
      ...formData,
      itemId: selectedParentId,
      [childKey]: formData.childId,
      id: selectedId || undefined
    }
    delete (payload as any).childId
    await saveMutation.mutateAsync(payload)
    handleCancelForm()
  }

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }

  if (!selectedParentId) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          p: 4,
          color: 'text.secondary'
        }}
      >
        <ComponentIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
        <Typography variant="h6">No Item Selected</Typography>
        <Typography variant="body2" color="text.disabled" textAlign="center">
          Select a product from the left panel to manage its components or packages.
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: 'primary.dark',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '6.5rem'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {isBOM ? <ComponentIcon sx={{ fontSize: 26 }} /> : <PackageIcon sx={{ fontSize: 26 }} />}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.2}>
              {selectedParentName}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {tabTitle}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={`${items.length} item${items.length !== 1 ? 's' : ''}`}
          size="small"
          sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold' }}
        />
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => {
            setActiveTab(v)
            handleCancelForm()
          }}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          className="h-[4rem]"
        >
          <Tab
            icon={<ComponentIcon sx={{ fontSize: 25 }} />}
            iconPosition="start"
            label="Ingredient BOM"
          />
          <Tab
            icon={<PackageIcon sx={{ fontSize: 25 }} />}
            iconPosition="start"
            label="Package Meal"
          />
        </Tabs>
      </Box>

      {/* Content */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        {saveMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {saveMutation.error?.message || 'Something went wrong.'}
          </Alert>
        )}

        <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell>
                  <Typography variant="caption" fontWeight="bold">
                    Item Name
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="caption" fontWeight="bold">
                    Qty
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="caption" fontWeight="bold">
                    Unit
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="caption" fontWeight="bold">
                    Cost
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="caption" fontWeight="bold">
                    Amount
                  </Typography>
                </TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoadingList &&
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <TableCell key={j}>
                        <Box
                          sx={{ height: 16, bgcolor: 'grey.200', borderRadius: 0.5, my: 0.25 }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              {!isLoadingList && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No {isBOM ? 'ingredient(s)' : 'package item(s)'} added yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {items.map((row: any) => (
                <TableRow
                  key={row.id}
                  hover
                  onClick={() => setSelectedId(row.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight="600" color="primary.main">
                      {row[relationKey]?.name || 'N/A'}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: -0.5 }}
                    >
                      {row[relationKey]?.code || '—'}{' '}
                      {row.isOptional && (
                        <Chip
                          label="Optional"
                          size="small"
                          color="info"
                          sx={{ height: 16, fontSize: '0.65rem' }}
                        />
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="medium">
                      {row.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={row.unit?.name || '—'}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', height: 20 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" color="text.secondary">
                      {'P' +
                        (row.cost ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="bold">
                      {'P' +
                        (row.amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <CircleButton
                      disabled={!canDelete}
                      icon={<DeleteIcon sx={{ fontSize: 18 }} />}
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteId(row.id)
                      }}
                      type={ButtonType.button}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {items.length > 0 && (
          <Box sx={{ display: 'flex', gap: 6, justifyContent: 'flex-end', pr: 1, mb: 2 }}>
            <Typography variant="body2" fontWeight="bold" color="text.secondary">
              Total Amount:{' '}
              <span style={{ color: '#14263E' }}>
                {items.reduce((sum: number, r: any) => sum + (r.amount ?? 0), 0).toFixed(2)}
              </span>
            </Typography>
          </Box>
        )}

        <Divider sx={{ mb: 2 }} />

        {!showAddForm ? (
          <Box className="flex justify-end">
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setShowAddForm(true)}
              disabled={!canAdd}
              fullWidth
            >
              New {isBOM ? 'Component' : 'Package Item'}
            </Button>
          </Box>
        ) : (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5 }}>
              {selectedId ? 'Edit' : 'Add'} {isBOM ? 'Ingredient' : 'Package Item'}
            </Typography>
            {isLoadingExisting ? (
              <ItemComponentFormSkeleton />
            ) : (
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Controller
                      name="childId"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          label={isBOM ? 'Ingredient' : 'Package Item'}
                          fullWidth
                          required
                          size="small"
                          error={!!errors.childId}
                          helperText={errors.childId?.message}
                        >
                          {childrenLookup.data?.map((item: any) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.name}
                            </MenuItem>
                          ))}
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
                          label="Unit"
                          fullWidth
                          required
                          size="small"
                          error={!!errors.unitId}
                          helperText={errors.unitId?.message}
                        >
                          {unitsLookup.data?.map((u: any) => (
                            <MenuItem key={u.id} value={u.id}>
                              {u.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
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
                  <Grid item xs={6}>
                    <Controller
                      name="cost"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Unit Cost"
                          type="number"
                          fullWidth
                          size="small"
                          error={!!errors.cost}
                          helperText={errors.cost?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Controller
                      name="amount"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Total Amount"
                          type="number"
                          fullWidth
                          size="small"
                          InputProps={{ readOnly: true }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name={isBOM ? 'isPrinted' : 'isOptional'}
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          }
                          label={isBOM ? 'Print on Slips' : 'Optional Choice'}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button variant="outlined" onClick={handleCancelForm} size="small">
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      type="submit"
                      size="small"
                      startIcon={<SaveIcon />}
                      disabled={saveMutation.isPending}
                    >
                      {saveMutation.isPending ? 'Saving...' : 'Save'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>
        )}
      </Box>

      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Remove this item? This cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}


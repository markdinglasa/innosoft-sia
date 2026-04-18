import { zodResolver } from '@hookform/resolvers/zod'
import {
  Add as AddIcon,
  Close as CloseIcon,
  ReceiptLong as CollectionIcon,
  Delete as DeleteIcon,
  Save as SaveIcon
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import { memo, useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useCollectionHubStore } from '../store/use-collection-hub-store'
import { CollectionFormSkeleton } from './collection-form-skeleton'

const collectionLineSchema = z.object({
  id: z.number().optional(),
  payTypeId: z.coerce.number().min(1, 'Pay Type is required'),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  checkNumber: z.string().nullable().optional(),
  checkDate: z.string().nullable().optional(),
  checkBank: z.string().nullable().optional(),
  otherInformation: z.string().nullable().optional(),
  accountId: z.coerce.number().default(1) // Default account ID
})

const collectionSchema = z.object({
  periodId: z.coerce.number().min(1, 'Period is required'),
  collectionDate: z.string().min(1, 'Date is required'),
  collectionNumber: z.string().min(1, 'Collection Number is required'),
  terminalId: z.coerce.number().min(1, 'Terminal is required'),
  manualORNumber: z.string().min(1, 'Manual OR Number is required'),
  customerId: z.coerce.number().min(1, 'Customer is required'),
  remarks: z.string().nullable().optional(),
  orderId: z.coerce.number().nullable().optional(),
  salesBalanceAmount: z.coerce.number().default(0),
  amount: z.coerce.number().default(0),
  tenderAmount: z.coerce.number().min(0, 'Tender Amount must be at least 0'),
  changeAmount: z.coerce.number().default(0),
  preparedBy: z.coerce.number().default(1),
  checkedBy: z.coerce.number().default(1),
  approvedBy: z.coerce.number().default(1),
  isCancelled: z.boolean().default(false),
  collectionLines: z.array(collectionLineSchema).min(1, 'At least one payment line is required')
})

type FormData = z.infer<typeof collectionSchema>

function CollectionForm() {
  const { selectedId, setSelectedId, setIsFormOpen } = useCollectionHubStore()

  const { useGet, useSaveMutation, useLookup } = useMasterfile('collection')

  // Lookups
  const { data: periods = [] } = useLookup('period')
  const { data: customers = [] } = useLookup('customer')
  const { data: terminals = [] } = useLookup('terminal')
  const { data: payTypes = [] } = useLookup('payType')
  const { data: accounts = [] } = useLookup('account')

  const { data: collection, isLoading } = useGet(selectedId)
  const saveMutation = useSaveMutation()

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      periodId: 0,
      collectionDate: new Date().toISOString().split('T')[0],
      collectionNumber: '',
      terminalId: 0,
      manualORNumber: '',
      customerId: 0,
      remarks: '',
      orderId: undefined,
      salesBalanceAmount: 0,
      amount: 0,
      tenderAmount: 0,
      changeAmount: 0,
      preparedBy: 1,
      checkedBy: 1,
      approvedBy: 1,
      isCancelled: false,
      collectionLines: []
    } as any // Use 'as any' for defaultValues to bypass initial strict check during type inference phase
  })

  const {
    fields: lineFields,
    append: appendLine,
    remove: removeLine
  } = useFieldArray({
    control,
    name: 'collectionLines'
  })

  const watchedLines = watch('collectionLines')
  const watchedTenderAmount = watch('tenderAmount')

  useEffect(
    function lineAmountCalculator() {
      const total = watchedLines.reduce(
        (acc: number, line: { amount: number }) => acc + (Number(line.amount) || 0),
        0
      )
      setValue('amount', total)
      setValue('changeAmount', Math.max(0, watchedTenderAmount - total))
    },
    [watchedLines, watchedTenderAmount, setValue]
  )

  useEffect(
    function formResetter() {
      if (!selectedId) {
        reset({
          periodId: periods[0]?.id || 0,
          collectionDate: new Date().toISOString().split('T')[0],
          collectionNumber: `COL-${Date.now()}`,
          terminalId: terminals[0]?.id || 0,
          manualORNumber: '',
          customerId: 0,
          remarks: '',
          tenderAmount: 0,
          collectionLines: []
        })
        return
      }

      if (collection) {
        reset({
          ...collection,
          collectionDate: new Date(collection.collectionDate).toISOString().split('T')[0],
          collectionLines:
            collection.collectionLines?.map((l: any) => ({
              ...l,
              amount: Number(l.amount)
            })) || []
        })
      }
    },
    [collection, reset, selectedId, periods, terminals]
  )

  const onSubmit = async (data: FormData) => {
    const payload = {
      ...data,
      id: selectedId || undefined,
      collectionDate: new Date(data.collectionDate)
    }
    await saveMutation.mutateAsync(payload)
    handleClose()
  }

  const handleClose = () => {
    setSelectedId(null)
    setIsFormOpen(false)
  }

  if (selectedId && isLoading) {
    return <CollectionFormSkeleton />
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {/* Header */}
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CollectionIcon sx={{ fontSize: 25 }} />
          <Typography variant="h6">{selectedId ? 'Edit Collection' : 'New Collection'}</Typography>
        </Box>
        <IconButton size="small" onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon sx={{ fontSize: 25 }} />
        </IconButton>
      </Box>

      <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
        {saveMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {saveMutation.error?.message || 'Failed to save collection.'}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register('collectionNumber')}
              label="Collection #"
              fullWidth
              size="small"
              required
              error={!!errors.collectionNumber}
              helperText={errors.collectionNumber?.message?.toString()}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register('collectionDate')}
              type="date"
              label="Date"
              fullWidth
              size="small"
              required
              InputLabelProps={{ shrink: true }}
              error={!!errors.collectionDate}
              helperText={errors.collectionDate?.message?.toString()}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register('manualORNumber')}
              label="Manual OR #"
              fullWidth
              size="small"
              required
              error={!!errors.manualORNumber}
              helperText={errors.manualORNumber?.message?.toString()}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="customerId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Customer"
                  fullWidth
                  size="small"
                  required
                  error={!!errors.customerId}
                  helperText={errors.customerId?.message?.toString()}
                >
                  {customers.map((c: any) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="terminalId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Terminal"
                  fullWidth
                  size="small"
                  required
                  error={!!errors.terminalId}
                  helperText={errors.terminalId?.message?.toString()}
                >
                  {terminals.map((t: any) => (
                    <MenuItem key={t.id} value={t.id}>
                      {t.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="periodId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Period"
                  fullWidth
                  size="small"
                  required
                  error={!!errors.periodId}
                  helperText={errors.periodId?.message?.toString()}
                >
                  {periods.map((p: any) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register('remarks')}
              label="Remarks"
              fullWidth
              size="small"
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Payment Details
              </Typography>
              <Button
                size="small"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() =>
                  appendLine({ payTypeId: 0, amount: 0, accountId: accounts[0]?.id || 1 })
                }
              >
                Add Payment
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width={40}></TableCell>
                    <TableCell>Pay Type</TableCell>
                    <TableCell width={150}>Amount</TableCell>
                    <TableCell>Info / Check #</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lineFields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <IconButton size="small" color="error" onClick={() => removeLine(index)}>
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Controller
                          name={`collectionLines.${index}.payTypeId`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              select
                              fullWidth
                              size="small"
                              variant="standard"
                              error={!!errors.collectionLines?.[index]?.payTypeId}
                            >
                              {payTypes.map((pt: any) => (
                                <MenuItem key={pt.id} value={pt.id}>
                                  {pt.name}
                                </MenuItem>
                              ))}
                            </TextField>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          {...register(`collectionLines.${index}.amount`)}
                          type="number"
                          fullWidth
                          size="small"
                          variant="standard"
                          inputProps={{ step: '0.01' }}
                          error={!!errors.collectionLines?.[index]?.amount}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          {...register(`collectionLines.${index}.otherInformation`)}
                          fullWidth
                          size="small"
                          variant="standard"
                          placeholder="Ref / Check info"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {lineFields.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          No payments added.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {errors.collectionLines?.message && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {(errors.collectionLines as any)?.message?.toString()}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total Amount
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="primary.main">
                    {Number.parseFloat(watch('amount') || 0)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    {...register('tenderAmount')}
                    label="Tender Amount"
                    type="number"
                    fullWidth
                    size="small"
                    inputProps={{ step: '0.01' }}
                    variant="filled"
                    error={!!errors.tenderAmount}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2">Change Due:</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {Number.parseFloat(watch('changeAmount') || 0)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Footer Actions */}
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
          {saveMutation.isPending ? 'Saving...' : 'Save Collection'}
        </Button>
      </Box>
    </Box>
  )
}

export default memo(CollectionForm)


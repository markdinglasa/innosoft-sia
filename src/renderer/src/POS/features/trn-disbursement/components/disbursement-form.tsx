import { zodResolver } from '@hookform/resolvers/zod'
import {
  Close as CloseIcon,
  Payments as DisbursementIcon,
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
  TextField,
  Typography
} from '@mui/material'
import { memo, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { MstUserEntity } from 'src/main/entities'
import { z } from 'zod'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useAuth } from '../../authentication/hooks/use-auth'
import { useDisbursementHubStore } from '../store/use-disbursement-hub-store'
import { DisbursementType } from '../types/disbursement.types'
import { CashDenominationCalculator } from './cash-denomination-calculator'
import { DisbursementFormSkeleton } from './disbursement-form-skeleton'

const disbursementSchema = z
  .object({
    disbursementDate: z.string().min(1, 'Date is required'),
    disbursementNumber: z.string().min(1, 'Disbursement number is required'),
    disbursementType: z.enum(DisbursementType),
    amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
    payee: z.string().min(1, 'Payee is required').max(255),
    remarks: z.string().optional().nullable(),
    accountId: z.coerce.number().min(1, 'Account is required'),
    payTypeId: z.coerce.number().min(1, 'Payment type is required'),
    preparedBy: z.coerce.number().min(1, 'Prepared by is required'),
    checkedBy: z.coerce.number().min(1, 'Checked by is required'),
    approvedBy: z.coerce.number().min(1, 'Approved by is required'),
    isReturn: z.boolean().default(false),
    stockInId: z.coerce.number().optional().nullable(),
    // Denominations
    amount1000: z.coerce.number().default(0),
    amount500: z.coerce.number().default(0),
    amount200: z.coerce.number().default(0),
    amount100: z.coerce.number().default(0),
    amount50: z.coerce.number().default(0),
    amount20: z.coerce.number().default(0),
    amount10: z.coerce.number().default(0),
    amount5: z.coerce.number().default(0),
    amount1: z.coerce.number().default(0),
    amount025: z.coerce.number().default(0),
    amount010: z.coerce.number().default(0),
    amount005: z.coerce.number().default(0),
    amount001: z.coerce.number().default(0)
  })
  .refine(
    (data) => {
      // Unique approval users
      const users = [data.preparedBy, data.checkedBy, data.approvedBy].filter(Boolean)
      return new Set(users).size === users.length
    },
    {
      message: 'Approval users must be different',
      path: ['approvedBy']
    }
  )

type DisbursementFormValues = z.infer<typeof disbursementSchema>

const defaultValues: Partial<DisbursementFormValues> = {
  disbursementDate: new Date().toISOString().split('T')[0],
  disbursementType: DisbursementType.PETTY_CASH as any,
  amount: 0,
  payee: '',
  remarks: '',
  accountId: '' as any,
  payTypeId: '' as any,
  preparedBy: '' as any,
  checkedBy: '' as any,
  approvedBy: '' as any,
  isReturn: false,
  amount1000: 0,
  amount500: 0,
  amount200: 0,
  amount100: 0,
  amount50: 0,
  amount20: 0,
  amount10: 0,
  amount5: 0,
  amount1: 0,
  amount025: 0,
  amount010: 0,
  amount005: 0,
  amount001: 0
}

function DisbursementForm() {
  const { selectedId, setSelectedId, setIsFormOpen, denominations, setDenominations } =
    useDisbursementHubStore()
  const { user } = useAuth()
  const activeTerminal = useSelector((state: any) => state.POS.manager.activeTerminal)
  const activeBranch = useSelector((state: any) => state.POS.manager.activeBranch)

  const { useGet, useSaveMutation, useLookup } = useMasterfile('disbursement')

  const { data: accounts = [] } = useLookup('account')
  const { data: payTypes = [] } = useLookup('payType')
  const { data: users = [] } = useLookup('user')

  const { data: disbursement, isLoading } = useGet(selectedId)
  const saveMutation = useSaveMutation()

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<DisbursementFormValues>({
    resolver: zodResolver(disbursementSchema) as any,
    defaultValues: defaultValues as any
  })

  const watchAmount = watch('amount')
  const watchPayTypeId = watch('payTypeId')

  const isCashPayment = payTypes
    .find((p) => p.id === watchPayTypeId)
    ?.name?.toUpperCase()
    .includes('CASH')

  useEffect(
    function formResetter() {
      if (selectedId && disbursement) {
        reset({
          ...disbursement,
          disbursementDate: disbursement.disbursementDate
            ? new Date(disbursement.disbursementDate).toISOString().split('T')[0]
            : '',
          remarks: disbursement.remarks || '',
          disbursementNumber: disbursement.disbursementNumber || ''
        })
        // Sync store denominations if it's an edit
        const denoms = {
          amount1000: disbursement.amount1000 || 0,
          amount500: disbursement.amount500 || 0,
          amount200: disbursement.amount200 || 0,
          amount100: disbursement.amount100 || 0,
          amount50: disbursement.amount50 || 0,
          amount20: disbursement.amount20 || 0,
          amount10: disbursement.amount10 || 0,
          amount5: disbursement.amount5 || 0,
          amount1: disbursement.amount1 || 0,
          amount025: disbursement.amount025 || 0,
          amount010: disbursement.amount010 || 0,
          amount005: disbursement.amount005 || 0,
          amount001: disbursement.amount001 || 0
        }
        setDenominations(denoms)
      } else if (!selectedId) {
        reset({
          ...defaultValues,
          preparedBy: user?.id || ('' as any),
          disbursementNumber: `DISB-${new Date().getFullYear()}-${Math.floor(
            1000 + Math.random() * 9000
          )
            .toString()
            .padStart(4, '0')}`
        })
      }
    },
    [selectedId, disbursement, reset, setDenominations, user]
  )

  const onSubmit = async (data: DisbursementFormValues) => {
    if (isCashPayment) {
      const total = Object.entries(denominations).reduce((acc, [key, count]) => {
        const valStr = key.replace('amount', '')
        let multiplier = 0
        if (valStr === '025') multiplier = 0.25
        else if (valStr === '010') multiplier = 0.1
        else if (valStr === '005') multiplier = 0.05
        else if (valStr === '001') multiplier = 0.01
        else multiplier = Number.parseInt(valStr, 10)
        return acc + count * multiplier
      }, 0)

      if (Math.abs(total - data.amount) > 0.01) {
        alert('Cash denominations total does not match the disbursement amount.')
        return
      }
    }

    await saveMutation.mutateAsync({
      ...data,
      ...denominations,
      branchId: activeBranch?.id || 1,
      terminalId: activeTerminal?.id || 1,
      periodId: 1, // Defaulting to 1 for manual disbursements outside shift if needed, or based on shift logic
      id: selectedId || undefined
    })
    handleClose()
  }

  const handleClose = () => {
    setSelectedId(null)
    setIsFormOpen(false)
  }

  if (selectedId && isLoading) return <DisbursementFormSkeleton />

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <input type="hidden" {...register('disbursementNumber')} />
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
          <DisbursementIcon sx={{ fontSize: 25 }} />
          <Typography variant="h6">
            {selectedId ? 'Edit Disbursement' : 'New Disbursement'}
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon sx={{ fontSize: 25 }} />
        </IconButton>
      </Box>

      <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
        {saveMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {saveMutation.error?.message || 'Failed to save disbursement.'}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              {...register('disbursementNumber')}
              label="Disbursement No."
              fullWidth
              required
              size="small"
              error={!!errors.disbursementNumber}
              helperText={errors.disbursementNumber?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              {...register('disbursementDate')}
              label="Date"
              type="date"
              fullWidth
              required
              size="small"
              InputLabelProps={{ shrink: true }}
              error={!!errors.disbursementDate}
              helperText={errors.disbursementDate?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="disbursementType"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Type"
                  fullWidth
                  size="small"
                  placeholder="Select disbursement type"
                  error={!!errors.disbursementType}
                  helperText={errors.disbursementType?.message || ''}
                >
                  {Object.values(DisbursementType).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register('payee')}
              label="Payee Name"
              fullWidth
              required
              size="small"
              error={!!errors.payee}
              helperText={errors.payee?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              {...register('amount')}
              label="Amount"
              type="number"
              fullWidth
              required
              size="small"
              error={!!errors.amount}
              helperText={errors.amount?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="payTypeId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Payment Type"
                  fullWidth
                  size="small"
                  required
                  placeholder="Select payment type"
                  error={!!errors.payTypeId}
                  helperText={errors.payTypeId?.message}
                >
                  {payTypes.map((p: any) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="accountId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Expense Account (Chart of Accounts)"
                  fullWidth
                  size="small"
                  required
                  error={!!errors.accountId}
                  helperText={errors.accountId?.message}
                >
                  {accounts.map((a: any) => (
                    <MenuItem key={a.id} value={a.id}>
                      [{a.code}] {a.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          {isCashPayment && (
            <Grid item xs={12}>
              <CashDenominationCalculator
                totalAmount={watchAmount}
                denominations={denominations}
                onDenominationChange={setDenominations}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              {...register('remarks')}
              label="Remarks"
              multiline
              rows={2}
              fullWidth
              size="small"
            />
          </Grid>

          <Divider sx={{ width: '100%', my: 2 }} />
          <Typography variant="overline" sx={{ px: 2, fontWeight: 'bold', width: '100%' }}>
            Approval Workflow
          </Typography>

          <Grid item xs={4}>
            <Controller
              name="preparedBy"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Prepared By"
                  fullWidth
                  size="small"
                  required
                  error={!!errors.preparedBy}
                >
                  {users.map((u: MstUserEntity) => (
                    <MenuItem key={u.id} value={u.id}>
                      {u.fullName}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              name="checkedBy"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Checked By"
                  fullWidth
                  size="small"
                  required
                  error={!!errors.checkedBy}
                >
                  {users.map((u: MstUserEntity) => (
                    <MenuItem key={u.id} value={u.id}>
                      {u.fullName}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              name="approvedBy"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Approved By"
                  fullWidth
                  size="small"
                  required
                  error={!!errors.approvedBy}
                  helperText={errors.approvedBy?.message}
                >
                  {users.map((u: MstUserEntity) => (
                    <MenuItem key={u.id} value={u.id}>
                      {u.fullName}
                    </MenuItem>
                  ))}
                </TextField>
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
          {saveMutation.isPending ? 'Saving...' : 'Save Disbursement'}
        </Button>
      </Box>
    </Box>
  )
}

export default memo(DisbursementForm)


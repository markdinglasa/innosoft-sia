import { zodResolver } from '@hookform/resolvers/zod'
import {
  NavigateBefore as BackIcon,
  Close as CloseIcon,
  Lock as LockIcon,
  Receipt as MemoIcon,
  NavigateNext as NextIcon,
  Save as SaveIcon
} from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography
} from '@mui/material'
import {
  debitCreditMemoSchema,
  DebitCreditMemoSchema
} from '@shared/validators/debit-credit-memo.validator'
import { memo, useEffect } from 'react'
import { Controller, Resolver, SubmitHandler, useForm } from 'react-hook-form'
import {
  useCreateDebitCreditMemo,
  useDebitCreditMemo,
  useUpdateDebitCreditMemo
} from '../hooks/use-debit-credit-memo'
import { useDebitCreditMemoFormStore } from '../store/use-debit-credit-memo-form-store'
import { useDebitCreditMemoHubStore } from '../store/use-debit-credit-memo-hub-store'

const steps = ['Details', 'Review']

function DebitCreditMemoForm() {
  const { selectedId, setSelectedId, setIsFormOpen } = useDebitCreditMemoHubStore()
  const { formData, setFormData, activeStep, setActiveStep, resetForm } =
    useDebitCreditMemoFormStore()

  const { data: memoData } = useDebitCreditMemo(selectedId)
  const createMutation = useCreateDebitCreditMemo()
  const updateMutation = useUpdateDebitCreditMemo()

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<DebitCreditMemoSchema>({
    resolver: zodResolver(debitCreditMemoSchema) as unknown as Resolver<DebitCreditMemoSchema>,
    defaultValues: formData
  })

  const currentAmount = watch('amount')
  const requiresAuthorization = currentAmount > 100 && !watch('authorizationCode')

  useEffect(() => {
    if (memoData) {
      const data = {
        dcMemoDate: new Date(memoData.dcMemoDate),
        dcMemoNumber: memoData.dcMemoNumber,
        memoType: memoData.memoType,
        amount: memoData.amount,
        particulars: memoData.particulars,
        terminalId: memoData.terminalId || '',
        cardType: memoData.cardType || '',
        authorizationCode: memoData.authorizationCode || '',
        lineItems: memoData.lineItems || []
      }
      reset(data)
      setFormData(data)
    } else {
      resetForm()
      reset(formData)
    }
  }, [memoData, reset])

  const onSubmit: SubmitHandler<DebitCreditMemoSchema> = async (data) => {
    if (selectedId) {
      await updateMutation.mutateAsync({ id: selectedId, payload: data, userId: 1 })
    } else {
      await createMutation.mutateAsync({ payload: data, userId: 1 })
    }
    handleClose()
  }

  const handleClose = () => {
    setSelectedId(null)
    setIsFormOpen(false)
    resetForm()
  }

  const handleNext = () => setActiveStep(activeStep + 1)
  const handleBack = () => setActiveStep(activeStep - 1)

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'background.default'
      }}
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MemoIcon sx={{ fontSize: 25 }} />
          <Typography variant="h6">
            {selectedId
              ? `Edit Debit/Credit Memo #${memoData?.dcMemoNumber}`
              : 'New Debit/Credit Memo'}
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon sx={{ fontSize: 25 }} />
        </IconButton>
      </Box>

      <Box sx={{ p: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
        {activeStep === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                {...register('dcMemoNumber')}
                label="Memo Number"
                fullWidth
                size="small"
                required
                error={!!errors.dcMemoNumber}
                helperText={errors.dcMemoNumber?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="dcMemoDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Memo Date"
                    type="date"
                    fullWidth
                    size="small"
                    required
                    error={!!errors.dcMemoDate}
                    helperText={errors.dcMemoDate?.message}
                    InputLabelProps={{ shrink: true }}
                    value={
                      field.value instanceof Date
                        ? field.value.toISOString().split('T')[0]
                        : field.value
                    }
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="memoType"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Memo Type"
                    fullWidth
                    size="small"
                    required
                    error={!!errors.memoType}
                    helperText={errors.memoType?.message}
                  >
                    <MenuItem value="DEBIT">DEBIT</MenuItem>
                    <MenuItem value="CREDIT">CREDIT</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                {...register('amount', { valueAsNumber: true })}
                label="Amount"
                type="number"
                fullWidth
                size="small"
                required
                error={!!errors.amount}
                helperText={errors.amount?.message}
                InputProps={{ inputProps: { step: 0.01, min: 0 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register('particulars')}
                label="Particulars"
                multiline
                rows={3}
                fullWidth
                size="small"
                required
                error={!!errors.particulars}
                helperText={errors.particulars?.message}
              />
            </Grid>
            {currentAmount > 100 && (
              <Grid item xs={12}>
                <Alert icon={<LockIcon fontSize="inherit" />} severity="warning">
                  Manager authorization required for amounts over $100.
                </Alert>
                <TextField
                  {...register('authorizationCode')}
                  label="Authorization Code"
                  placeholder="Enter manager override code"
                  fullWidth
                  size="small"
                  sx={{ mt: 2 }}
                  error={!!errors.authorizationCode}
                  helperText={errors.authorizationCode?.message}
                />
              </Grid>
            )}
          </Grid>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Summary
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography color="textSecondary" variant="caption">
                    Memo Number
                  </Typography>
                  <Typography variant="body1">{watch('dcMemoNumber')}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary" variant="caption">
                    Type
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {watch('memoType')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary" variant="caption">
                    Amount
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${watch('amount')?.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary" variant="caption">
                    Terminal ID
                  </Typography>
                  <Typography variant="body1">{watch('terminalId') || 'N/A'}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2
        }}
      >
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={activeStep === 0}
          startIcon={<BackIcon />}
        >
          Back
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={requiresAuthorization}
              endIcon={<NextIcon />}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              type="submit"
              startIcon={<SaveIcon />}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {selectedId ? 'Update Memo' : 'Save Memo'}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default memo(DebitCreditMemoForm)


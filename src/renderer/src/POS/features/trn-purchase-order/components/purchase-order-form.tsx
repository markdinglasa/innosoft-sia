import { zodResolver } from '@hookform/resolvers/zod'
import {
  NavigateBefore as BackIcon,
  Close as CloseIcon,
  NavigateNext as NextIcon,
  ShoppingCart as POIcon,
  Save as SaveIcon
} from '@mui/icons-material'
import {
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
  purchaseOrderSchema,
  PurchaseOrderSchema
} from '@shared/validators/purchase-order.validator'
import { memo, useEffect } from 'react'
import { Controller, Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { useMasterfile } from '../../../hooks/use-masterfile'
import {
  useCreatePurchaseOrder,
  usePurchaseOrder,
  useUpdatePurchaseOrder
} from '../hooks/use-purchase-order'
import { usePurchaseOrderFormStore } from '../store/use-purchase-order-form-store'
import { usePurchaseOrderHubStore } from '../store/use-purchase-order-hub-store'
import ApprovalWorkflow from './approval-workflow'
import LineItemsGrid from './line-items-grid'

const steps = ['Details', 'Line Items', 'Summary']

function PurchaseOrderForm() {
  const { selectedId, setSelectedId, setIsFormOpen } = usePurchaseOrderHubStore()
  const { formData, setFormData, activeStep, setActiveStep, resetForm } =
    usePurchaseOrderFormStore()

  const { useLookup } = useMasterfile('supplier')
  const { data: suppliers = [] } = useLookup('supplier')

  const { data: purchaseOrder } = usePurchaseOrder(selectedId)
  const createMutation = useCreatePurchaseOrder()
  const updateMutation = useUpdatePurchaseOrder()

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<PurchaseOrderSchema>({
    resolver: zodResolver(purchaseOrderSchema) as unknown as Resolver<PurchaseOrderSchema>,
    defaultValues: formData
  })

  useEffect(() => {
    if (purchaseOrder) {
      const data = {
        purchaseOrderDate: new Date(purchaseOrder.purchaseOrderDate),
        purchaseOrderNumber: purchaseOrder.purchaseOrderNumber,
        supplierId: purchaseOrder.supplierId,
        expectedDeliveryDate: purchaseOrder.expectedDeliveryDate
          ? new Date(purchaseOrder.expectedDeliveryDate)
          : null,
        remarks: purchaseOrder.remarks || '',
        status: purchaseOrder.status,
        shippingAmount: purchaseOrder.shippingAmount || 0,
        lineItems: purchaseOrder.lineItems || []
      }
      reset(data)
      setFormData(data)
    } else {
      resetForm()
      reset(formData)
    }
  }, [purchaseOrder, reset])

  const onSubmit: SubmitHandler<PurchaseOrderSchema> = async (data) => {
    if (selectedId) {
      await updateMutation.mutateAsync({ id: selectedId, payload: data, userId: 1 }) // Placeholder userId
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
      onSubmit={handleSubmit(onSubmit as any)}
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
          <POIcon sx={{ fontSize: 25 }} />
          <Typography variant="h6">
            {selectedId
              ? `Edit Purchase Order #${purchaseOrder?.purchaseOrderNumber}`
              : 'New Purchase Order'}
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
                {...register('purchaseOrderNumber')}
                label="PO Number"
                fullWidth
                size="small"
                required
                error={!!errors.purchaseOrderNumber}
                helperText={errors.purchaseOrderNumber?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="purchaseOrderDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="PO Date"
                    type="date"
                    fullWidth
                    size="small"
                    required
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
                name="supplierId"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Supplier" fullWidth size="small" required>
                    {suppliers.map((s: any) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="expectedDeliveryDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Expected Delivery"
                    type="date"
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={
                      field?.value instanceof Date ? field.value.toISOString().split('T')[0] : ''
                    }
                    onChange={(e) =>
                      field.onChange(e.target.value ? new Date(e.target.value) : null)
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register('remarks')}
                label="Remarks"
                multiline
                rows={3}
                fullWidth
                size="small"
              />
            </Grid>
          </Grid>
        )}

        {activeStep === 1 && <LineItemsGrid />}

        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Summary
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography color="textSecondary" variant="caption">
                    Supplier
                  </Typography>
                  <Typography variant="body1">
                    {suppliers.find((s) => s.id === watch('supplierId'))?.name || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary" variant="caption">
                    PO Number
                  </Typography>
                  <Typography variant="body1">{watch('purchaseOrderNumber')}</Typography>
                </Grid>
              </Grid>
            </Paper>

            {purchaseOrder && <ApprovalWorkflow purchaseOrder={purchaseOrder} />}
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
            <Button variant="contained" onClick={handleNext} endIcon={<NextIcon />}>
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
              {selectedId ? 'Update Purchase Order' : 'Save Purchase Order'}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default memo(PurchaseOrderForm)


import { zodResolver } from '@hookform/resolvers/zod'
import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Percent as DiscountIcon,
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
  Skeleton,
  Switch,
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
import { useDiscountHubStore } from '../store/use-discount-hub-store'
import { DiscountFormSkeleton } from './discount-form-skeleton'

const discountSchema = z.object({
  branchId: z.number().min(1, 'Branch is required'),
  name: z.string().min(1, 'Discount name is required'),
  discountAlias: z.string().nullable().optional(),
  discountRate: z.coerce.number().min(0, 'Discount Rate must be at least 0'),
  isVatExempt: z.boolean().default(false),
  isDateScheduled: z.boolean().default(false),
  dateStart: z.coerce.date(),
  dateEnd: z.coerce.date(),
  isTimeScheduled: z.boolean().default(false),
  timeStart: z.coerce.date(),
  timeEnd: z.coerce.date(),
  isDayScheduled: z.boolean().default(false),
  dayMon: z.boolean().default(false),
  dayTue: z.boolean().default(false),
  dayWed: z.boolean().default(false),
  dayThu: z.boolean().default(false),
  dayFri: z.boolean().default(false),
  daySat: z.boolean().default(false),
  daySun: z.boolean().default(false),
  discountItems: z
    .array(
      z.object({
        id: z.number().optional(),
        itemId: z.number().min(1, 'Item is required'),
        isAutoDiscount: z.boolean().default(false)
      })
    )
    .optional()
})

type FormData = z.infer<typeof discountSchema>

function DiscountForm() {
  const { selectedId, setIsFormOpen, setSelectedId } = useDiscountHubStore()
  const activeBranch = useSelector((state: any) => state.POS.manager.activeBranch)
  const { useGet, useSaveMutation, useLookup } = useMasterfile('discount')
  const { data: existing, isLoading } = useGet(selectedId)
  const itemsLookup = useLookup('item')
  const saveMutation = useSaveMutation()

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(discountSchema) as any,
    defaultValues: {
      branchId: activeBranch?.id || 0,
      name: '',
      discountAlias: '',
      discountRate: 0,
      isVatExempt: false,
      isDateScheduled: false,
      dateStart: new Date(),
      dateEnd: new Date(),
      isTimeScheduled: false,
      timeStart: new Date(),
      timeEnd: new Date(),
      isDayScheduled: false,
      dayMon: false,
      dayTue: false,
      dayWed: false,
      dayThu: false,
      dayFri: false,
      daySat: false,
      daySun: false,
      discountItems: []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'discountItems'
  })

  const isDateScheduled = watch('isDateScheduled')
  const isTimeScheduled = watch('isTimeScheduled')
  const isDayScheduled = watch('isDayScheduled')

  useEffect(
    function formResetter() {
      if (existing) {
        reset({
          name: existing.name || '',
          discountAlias: existing.discountAlias || '',
          discountRate: existing.discountRate || 0,
          isVatExempt: !!existing.isVatExempt || !!existing.isVATExempt,
          isDateScheduled: !!existing.isDateScheduled,
          dateStart: existing.dateStart ? new Date(existing.dateStart) : new Date(),
          dateEnd: existing.dateEnd ? new Date(existing.dateEnd) : new Date(),
          isTimeScheduled: !!existing.isTimeScheduled,
          timeStart: existing.timeStart ? new Date(existing.timeStart) : new Date(),
          timeEnd: existing.timeEnd ? new Date(existing.timeEnd) : new Date(),
          isDayScheduled: !!existing.isDayScheduled,
          dayMon: !!existing.dayMon,
          dayTue: !!existing.dayTue,
          dayWed: !!existing.dayWed,
          dayThu: !!existing.dayThu,
          dayFri: !!existing.dayFri,
          daySat: !!existing.daySat,
          daySun: !!existing.daySun,
          discountItems: existing.discountItems || []
        })
      } else {
        reset({
          name: '',
          discountAlias: '',
          discountRate: 0,
          isVatExempt: false,
          isDateScheduled: false,
          dateStart: new Date(),
          dateEnd: new Date(),
          isTimeScheduled: false,
          timeStart: new Date(),
          timeEnd: new Date(),
          isDayScheduled: false,
          dayMon: false,
          dayTue: false,
          dayWed: false,
          dayThu: false,
          dayFri: false,
          daySat: false,
          daySun: false,
          discountItems: []
        })
      }
    },
    [existing, reset]
  )

  const onSubmit = async (formData: FormData) => {
    const { discountItems, ...parent } = formData
    await saveMutation.mutateAsync({
      parent: {
        ...parent,
        id: selectedId || undefined,
        branchId: activeBranch?.id || 0
      },
      discountItems: discountItems || []
    })
    handleClose()
  }

  const handleClose = () => {
    setSelectedId(null)
    setIsFormOpen(false)
  }

  if (selectedId && isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <DiscountFormSkeleton />
      </Box>
    )
  }

  return (
    <Box
      component="form"
      aria-label="discount-form"
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
          <DiscountIcon sx={{ fontSize: 25 }} />
          <Typography variant="h6">{selectedId ? 'Edit Discount' : 'New Discount'}</Typography>
        </Box>
        <IconButton size="small" onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon sx={{ fontSize: 25 }} />
        </IconButton>
      </Box>

      <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
        {saveMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {saveMutation.error?.message || 'Failed to save discount.'}
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
                  label="Discount"
                  fullWidth
                  required
                  size="small"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="discountAlias"
              control={control}
              render={({ field }) => <TextField {...field} label="Alias" fullWidth size="small" />}
            />
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <Controller
              name="isVatExempt"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="VAT Exempt"
                />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <Controller
              name="discountRate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Discount Rate (%)"
                  type="number"
                  fullWidth
                  required
                  size="small"
                  error={!!errors.discountRate}
                  helperText={errors.discountRate?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Scheduling Options
              </Typography>
            </Divider>
          </Grid>

          {/* Date Scheduling */}
          <Grid item xs={12}>
            <Controller
              name="isDateScheduled"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Schedule by Date"
                />
              )}
            />
          </Grid>
          {isDateScheduled && (
            <>
              <Grid item xs={6}>
                <Controller
                  name="dateStart"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Start Date"
                      type="date"
                      fullWidth
                      size="small"
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
              <Grid item xs={6}>
                <Controller
                  name="dateEnd"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="End Date"
                      type="date"
                      fullWidth
                      size="small"
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
            </>
          )}

          {/* Time Scheduling */}
          <Grid item xs={12}>
            <Controller
              name="isTimeScheduled"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Schedule by Time"
                />
              )}
            />
          </Grid>
          {isTimeScheduled && (
            <>
              <Grid item xs={6}>
                <Controller
                  name="timeStart"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Start Time"
                      type="time"
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      value={
                        field.value instanceof Date
                          ? field.value.toTimeString().split(' ')[0].substring(0, 5)
                          : field.value
                      }
                      onChange={(e) => {
                        const date = new Date()
                        const [hours, minutes] = e.target.value.split(':')
                        date.setHours(parseInt(hours), parseInt(minutes), 0, 0)
                        field.onChange(date)
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="timeEnd"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="End Time"
                      type="time"
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      value={
                        field.value instanceof Date
                          ? field.value.toTimeString().split(' ')[0].substring(0, 5)
                          : field.value
                      }
                      onChange={(e) => {
                        const date = new Date()
                        const [hours, minutes] = e.target.value.split(':')
                        date.setHours(parseInt(hours), parseInt(minutes), 0, 0)
                        field.onChange(date)
                      }}
                    />
                  )}
                />
              </Grid>
            </>
          )}

          {/* Day Scheduling */}
          <Grid item xs={12}>
            <Controller
              name="isDayScheduled"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Schedule by Day"
                />
              )}
            />
          </Grid>
          {isDayScheduled && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  { name: 'dayMon', label: 'Mon' },
                  { name: 'dayTue', label: 'Tue' },
                  { name: 'dayWed', label: 'Wed' },
                  { name: 'dayThu', label: 'Thu' },
                  { name: 'dayFri', label: 'Fri' },
                  { name: 'daySat', label: 'Sat' },
                  { name: 'daySun', label: 'Sun' }
                ].map((day) => (
                  <Controller
                    key={day.name}
                    name={day.name as any}
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={!!field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label={day.label}
                      />
                    )}
                  />
                ))}
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Box
              sx={{
                mt: 2,
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                Assigned Items
              </Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => append({ itemId: 0, isAutoDiscount: false })}
              >
                Add Item
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {fields.map((field, index) => (
                <Paper key={field.id} variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <CircleButton
                      icon={<DeleteIcon color="primary" sx={{ fontSize: 25 }} />}
                      type={ButtonType.button}
                      onClick={() => remove(index)}
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Controller
                          name={`discountItems.${index}.itemId`}
                          control={control}
                          render={({ field: itemField }) =>
                            itemsLookup.isLoading ? (
                              <Skeleton variant="rectangular" height={40} width="100%" />
                            ) : (
                              <TextField
                                {...itemField}
                                select
                                label="Select Item"
                                fullWidth
                                size="small"
                                error={!!errors.discountItems?.[index]?.itemId}
                                helperText={errors.discountItems?.[index]?.itemId?.message}
                                onChange={(e) => itemField.onChange(Number(e.target.value))}
                              >
                                {itemsLookup.data?.map((item: any) => (
                                  <MenuItem key={item.id} value={item.id}>
                                    {item.name}
                                  </MenuItem>
                                ))}
                              </TextField>
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Controller
                          name={`discountItems.${index}.isAutoDiscount`}
                          control={control}
                          render={({ field: autoField }) => (
                            <FormControlLabel
                              control={
                                <Switch
                                  size="small"
                                  checked={!!autoField.value}
                                  onChange={(e) => autoField.onChange(e.target.checked)}
                                />
                              }
                              label="Auto Discount"
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              ))}
              {fields.length === 0 && (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No items assigned. Click "Add Item" to start.
                  </Typography>
                </Box>
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
          {saveMutation.isPending ? 'Saving...' : 'Save Discount'}
        </Button>
      </Box>
    </Box>
  )
}

export default memo(DiscountForm)


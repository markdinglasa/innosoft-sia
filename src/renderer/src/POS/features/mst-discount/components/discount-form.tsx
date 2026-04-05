import { zodResolver } from '@hookform/resolvers/zod'
import { Close as CloseIcon, Percent as DiscountIcon, Save as SaveIcon } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { memo, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useDiscountHubStore } from '../store/use-discount-hub-store'

const discountSchema = z.object({
  name: z.string().min(1, 'Discount Name is required'),
  discountAlias: z.string().nullable().optional(),
  discountRate: z.coerce.number().min(0, 'Discount Rate must be at least 0'),
  isVATExempt: z.boolean().default(false)
})

type FormData = z.infer<typeof discountSchema>

function DiscountForm() {
  const { selectedId, setIsFormOpen, setSelectedId } = useDiscountHubStore()
  const { useGet, useSaveMutation } = useMasterfile('discount')
  const { data: existing, isLoading } = useGet(selectedId)
  const saveMutation = useSaveMutation()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(discountSchema),
    defaultValues: { name: '', discountAlias: '', discountRate: 0, isVATExempt: false }
  })

  useEffect(
    function formResetter() {
      if (existing)
        reset({
          name: existing.name || '',
          discountAlias: existing.discountAlias || '',
          discountRate: existing.discountRate || 0,
          isVATExempt: existing.isVATExempt || false
        })
      else reset({ name: '', discountAlias: '', discountRate: 0, isVATExempt: false })
    },
    [existing, reset]
  )

  const onSubmit = async (formData: FormData) => {
    await saveMutation.mutateAsync({ ...formData, id: selectedId || undefined })
    setIsFormOpen(false)
  }

  const handleClose = () => {
    setSelectedId(null)
    setIsFormOpen(false)
  }

  if (selectedId && isLoading) {
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
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Discount"
              fullWidth
              required
              margin="normal"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />
        <Controller
          name="discountAlias"
          control={control}
          render={({ field }) => <TextField {...field} label="Alias" fullWidth margin="normal" />}
        />
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
              margin="normal"
              error={!!errors.discountRate}
              helperText={errors.discountRate?.message}
            />
          )}
        />
        <Controller
          name="isVATExempt"
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


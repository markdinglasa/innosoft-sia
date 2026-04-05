import { zodResolver } from '@hookform/resolvers/zod'
import { Close as CloseIcon, Percent as DiscountIcon, Save as SaveIcon } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useDiscountHubStore } from '../store/use-discount-hub-store'

const discountSchema = z.object({
  name: z.string().min(1, 'Discount Name is required'),
  discountAlias: z.string().optional(),
  discountRate: z.coerce.number().min(0, 'Discount Rate must be at least 0'),
  isVATExempt: z.boolean().default(false)
})

type FormData = z.infer<typeof discountSchema>

export const DiscountForm: React.FC = () => {
  const { selectedId, setIsFormOpen } = useDiscountHubStore()
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

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DiscountIcon color="primary" sx={{ fontSize: 25 }} />
          <Typography variant="h6">{selectedId ? 'Edit Discount' : 'New Discount'}</Typography>
        </Box>
        <IconButton onClick={() => setIsFormOpen(false)}>
          <CloseIcon sx={{ fontSize: 25 }} />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 3 }} />
      {isLoading ? (
        <CircularProgress />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Discount Name"
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
          {saveMutation.isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Failed to save.
            </Alert>
          )}
          <Box sx={{ mt: 'auto', pt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              startIcon={<SaveIcon sx={{ fontSize: 25 }} />}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? 'Saving...' : 'Save Discount'}
            </Button>
          </Box>
        </form>
      )}
    </Box>
  )
}


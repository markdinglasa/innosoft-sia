import {
  Close as CloseIcon,
  Check as SaveIcon,
  LocalShipping as ShippingIcon
} from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
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
import { memo, useEffect, useState } from 'react'
import { useReceivePurchaseOrder } from '../hooks/use-purchase-order'

interface ReceivingFormProps {
  open: boolean
  onClose: () => void
  purchaseOrder: any
}

function ReceivingForm({ open, onClose, purchaseOrder }: Readonly<ReceivingFormProps>) {
  const [receivingNumber, setReceivingNumber] = useState('')
  const [deliveryNote, setDeliveryNote] = useState('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<any[]>([])

  const receiveMutation = useReceivePurchaseOrder()

  useEffect(() => {
    if (purchaseOrder?.lineItems) {
      setItems(
        purchaseOrder.lineItems.map((line: any) => ({
          itemId: line.itemId,
          unitId: line.unitId,
          description: line.item?.name || 'Unknown Item',
          orderedQuantity: line.quantity,
          previouslyReceived: line.receivedQuantity || 0,
          receivingQuantity: line.quantity - (line.receivedQuantity || 0)
        }))
      )
      setReceivingNumber(
        `RCV-${purchaseOrder.purchaseOrderNumber}-${Date.now().toString().slice(-4)}`
      )
    }
  }, [purchaseOrder])

  const handleUpdateQty = (index: number, val: string) => {
    const qty = parseFloat(val) || 0
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, receivingQuantity: qty } : item))
    )
  }

  const handleSubmit = async () => {
    if (!receivingNumber) return alert('Receiving Number is required.')

    await receiveMutation.mutateAsync({
      id: purchaseOrder.id,
      userId: 1, // Placeholder
      data: {
        receivingNumber,
        deliveryNote,
        notes,
        items: items
          .filter((i) => i.receivingQuantity > 0)
          .map((i) => ({
            itemId: i.itemId,
            unitId: i.unitId,
            quantity: i.receivingQuantity
          }))
      }
    })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <ShippingIcon />
        Receive Items for PO #{purchaseOrder?.purchaseOrderNumber}
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <TextField
              label="Receiving Number"
              fullWidth
              size="small"
              required
              value={receivingNumber}
              onChange={(e) => setReceivingNumber(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Delivery Note / SI #"
              fullWidth
              size="small"
              value={deliveryNote}
              onChange={(e) => setDeliveryNote(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Notes"
              fullWidth
              size="small"
              multiline
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          Items to Receive
        </Typography>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell align="right">Ordered</TableCell>
                <TableCell align="right">Prev Recv</TableCell>
                <TableCell align="right" width="150">
                  Receiving Qty
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell align="right">{item.orderedQuantity}</TableCell>
                  <TableCell align="right">{item.previouslyReceived}</TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      size="small"
                      value={item.receivingQuantity}
                      onChange={(e) => handleUpdateQty(idx, e.target.value)}
                      inputProps={{
                        style: { textAlign: 'right' },
                        max: item.orderedQuantity - item.previouslyReceived
                      }}
                      error={
                        item.receivingQuantity > item.orderedQuantity - item.previouslyReceived
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} variant="outlined" startIcon={<CloseIcon />}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="success"
          startIcon={<SaveIcon />}
          disabled={receiveMutation.isPending}
        >
          {receiveMutation.isPending ? 'Processing...' : 'Complete Receiving'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default memo(ReceivingForm)


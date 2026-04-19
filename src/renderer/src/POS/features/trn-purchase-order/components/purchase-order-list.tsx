import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  ShoppingCart as POIcon,
  LocalShipping as ShippingIcon
} from '@mui/icons-material'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'
import { PurchaseOrderStatus } from '@shared/types/purchase-order.types'
import React, { useState } from 'react'
import { useDeletePurchaseOrder, usePurchaseOrders } from '../hooks/use-purchase-order'
import { usePurchaseOrderHubStore } from '../store/use-purchase-order-hub-store'
import ReceivingForm from './receiving-form'

export const PurchaseOrderList: React.FC = () => {
  const { searchKeyword, setSelectedId, setIsFormOpen } = usePurchaseOrderHubStore()
  const [page, setPage] = useState(0)
  const { data, isLoading, isError } = usePurchaseOrders({
    searchKeyword,
    page: page + 1,
    take: 30
  })
  const deleteMutation = useDeletePurchaseOrder()

  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [receivingPO, setReceivingPO] = useState<string | null>(null)

  const handleEdit = (id: number) => {
    setSelectedId(id)
    setIsFormOpen(true)
  }

  const handleReceive = (po: string) => {
    setReceivingPO(po)
  }

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }

  const getStatusColor = (status: PurchaseOrderStatus) => {
    switch (status) {
      case PurchaseOrderStatus.DRAFT:
        return 'default'
      case PurchaseOrderStatus.PENDING_APPROVAL:
        return 'warning'
      case PurchaseOrderStatus.APPROVED:
        return 'info'
      case PurchaseOrderStatus.PARTIALLY_RECEIVED:
        return 'primary'
      case PurchaseOrderStatus.COMPLETED:
        return 'success'
      case PurchaseOrderStatus.REJECTED:
        return 'error'
      case PurchaseOrderStatus.CANCELLED:
        return 'error'
      default:
        return 'default'
    }
  }

  if (isLoading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={32} />
      </Box>
    )

  if (isError) return <Typography color="error">Failed to load purchase orders.</Typography>

  const items = (data as any)?.items || []

  return (
    <>
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ maxHeight: 'calc(100vh - 250px)' }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell width={50}></TableCell>
              <TableCell>PO #</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell align="right">Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item: any) => (
              <TableRow
                key={item.id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => handleEdit(item.id)}
              >
                <TableCell>
                  <POIcon color="action" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {item.purchaseOrderNumber}
                  </Typography>
                </TableCell>
                <TableCell>
                  {item.purchaseOrderDate
                    ? new Date(item.purchaseOrderDate).toLocaleDateString()
                    : '—'}
                </TableCell>
                <TableCell>{item.supplier?.name || '—'}</TableCell>
                <TableCell align="right">
                  {Number(item.totalAmount || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2
                  })}
                </TableCell>
                <TableCell>
                  <Chip
                    label={item.status.replace('_', ' ')}
                    color={getStatusColor(item.status) as any}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                    {(item.status === PurchaseOrderStatus.APPROVED ||
                      item.status === PurchaseOrderStatus.PARTIALLY_RECEIVED) && (
                      <Tooltip title="Receive Items">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleReceive(item)}
                        >
                          <ShippingIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleEdit(item.id)}>
                        <EditIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteId(item.id)}
                        disabled={item.status !== PurchaseOrderStatus.DRAFT}
                      >
                        <DeleteIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  No purchase orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[30]}
        component="div"
        count={(data as any)?.meta?.totalItems || 0}
        rowsPerPage={30}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
      />

      {/* Receiving Form Dialog */}
      {receivingPO && (
        <ReceivingForm
          open={!!receivingPO}
          onClose={() => setReceivingPO(null)}
          purchaseOrder={receivingPO}
        />
      )}

      {/* Delete Confirmation */}
      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete this purchase order? This can only be done for DRAFT orders.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}


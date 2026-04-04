import { Delete as DeleteIcon, Edit as EditIcon, ShoppingCart as POIcon } from '@mui/icons-material'
import { Box, CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React from 'react'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { usePurchaseOrderHubStore } from '../store/use-purchase-order-hub-store'

export const PurchaseOrderList: React.FC = () => {
  const { searchKeyword, setSelectedId, setIsFormOpen } = usePurchaseOrderHubStore()
  const { useList, useDeleteMutation } = useMasterfile('purchaseOrder')
  const { data, isLoading, isError } = useList({ searchKeyword })
  const deleteMutation = useDeleteMutation()
  const handleEdit = (id: number) => { setSelectedId(id); setIsFormOpen(true) }
  const handleDelete = async (id: number) => { if (window.confirm('Delete this purchase order?')) await deleteMutation.mutateAsync(id) }
  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress size={32} /></Box>
  if (isError) return <Typography color="error">Failed to load purchase orders.</Typography>
  const items = (data as any)?.items || []
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 'calc(100vh - 250px)' }}>
      <Table stickyHeader size="small"><TableHead><TableRow>
        <TableCell width={50}></TableCell><TableCell>PO #</TableCell><TableCell>Date</TableCell>
        <TableCell>Supplier</TableCell><TableCell align="right">Amount</TableCell><TableCell align="right">Actions</TableCell>
      </TableRow></TableHead>
        <TableBody>{items.map((item: any) => (
          <TableRow key={item.id} hover onClick={() => handleEdit(item.id)} sx={{ cursor: 'pointer' }}>
            <TableCell><POIcon color="action" fontSize="small" /></TableCell>
            <TableCell><Typography variant="body2" fontWeight="medium">{item.purchaseOrderNumber}</Typography></TableCell>
            <TableCell>{item.purchaseOrderDate ? new Date(item.purchaseOrderDate).toLocaleDateString() : '—'}</TableCell>
            <TableCell>{item.supplier?.name || '—'}</TableCell>
            <TableCell align="right">{Number(item.amount || 0).toFixed(2)}</TableCell>
            <TableCell align="right">
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEdit(item.id) }}><EditIcon fontSize="small" /></IconButton>
              <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDelete(item.id) }}><DeleteIcon fontSize="small" /></IconButton>
            </TableCell></TableRow>))}
          {items.length === 0 && <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}><Typography variant="body2" color="text.secondary">No purchase orders found.</Typography></TableCell></TableRow>}
        </TableBody></Table></TableContainer>)
}

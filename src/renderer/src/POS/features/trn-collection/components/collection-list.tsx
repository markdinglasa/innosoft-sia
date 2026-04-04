import { Delete as DeleteIcon, Edit as EditIcon, ReceiptLong as CollectionIcon } from '@mui/icons-material'
import { Box, Chip, CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React from 'react'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useCollectionHubStore } from '../store/use-collection-hub-store'

export const CollectionList: React.FC = () => {
  const { searchKeyword, setSelectedId, setIsFormOpen } = useCollectionHubStore()
  const { useList, useDeleteMutation } = useMasterfile('collection')
  const { data, isLoading, isError } = useList({ searchKeyword })
  const deleteMutation = useDeleteMutation()
  const handleEdit = (id: number) => { setSelectedId(id); setIsFormOpen(true) }
  const handleDelete = async (id: number) => { if (window.confirm('Delete this collection?')) await deleteMutation.mutateAsync(id) }
  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress size={32} /></Box>
  if (isError) return <Typography color="error">Failed to load collections.</Typography>
  const items = (data as any)?.items || []
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 'calc(100vh - 250px)' }}>
      <Table stickyHeader size="small"><TableHead><TableRow>
        <TableCell width={50}></TableCell><TableCell>Collection #</TableCell><TableCell>Date</TableCell>
        <TableCell>OR #</TableCell><TableCell align="right">Amount</TableCell><TableCell>Status</TableCell>
        <TableCell align="right">Actions</TableCell>
      </TableRow></TableHead>
        <TableBody>{items.map((item: any) => (
          <TableRow key={item.id} hover onClick={() => handleEdit(item.id)} sx={{ cursor: 'pointer' }}>
            <TableCell><CollectionIcon color="action" fontSize="small" /></TableCell>
            <TableCell><Typography variant="body2" fontWeight="medium">{item.collectionNumber}</Typography></TableCell>
            <TableCell>{item.collectionDate ? new Date(item.collectionDate).toLocaleDateString() : '—'}</TableCell>
            <TableCell>{item.manualORNumber || '—'}</TableCell>
            <TableCell align="right">{Number(item.amount || 0).toFixed(2)}</TableCell>
            <TableCell><Chip label={item.isCancelled ? 'Cancelled' : 'Active'} size="small" color={item.isCancelled ? 'error' : 'success'} /></TableCell>
            <TableCell align="right">
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEdit(item.id) }}><EditIcon fontSize="small" /></IconButton>
              <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDelete(item.id) }}><DeleteIcon fontSize="small" /></IconButton>
            </TableCell>
          </TableRow>))}
          {items.length === 0 && <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}><Typography variant="body2" color="text.secondary">No collections found.</Typography></TableCell></TableRow>}
        </TableBody></Table></TableContainer>)
}

import { Delete as DeleteIcon, Edit as EditIcon, Checklist as CountIcon } from '@mui/icons-material'
import { Box, CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React from 'react'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useStockCountHubStore } from '../store/use-stock-count-hub-store'

export const StockCountList: React.FC = () => {
  const { searchKeyword, setSelectedId, setIsFormOpen } = useStockCountHubStore()
  const { useList, useDeleteMutation } = useMasterfile('stockCount')
  const { data, isLoading, isError } = useList({ searchKeyword })
  const deleteMutation = useDeleteMutation()
  const handleEdit = (id: number) => { setSelectedId(id); setIsFormOpen(true) }
  const handleDelete = async (id: number) => { if (window.confirm('Delete?')) await deleteMutation.mutateAsync(id) }
  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress size={32} /></Box>
  if (isError) return <Typography color="error">Failed to load stock count records.</Typography>
  const items = (data as any)?.items || []
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 'calc(100vh - 250px)' }}>
      <Table stickyHeader size="small"><TableHead><TableRow>
        <TableCell width={50}></TableCell><TableCell>Count #</TableCell><TableCell>Date</TableCell>
        <TableCell>Remarks</TableCell><TableCell align="right">Actions</TableCell>
      </TableRow></TableHead>
        <TableBody>{items.map((item: any) => (
          <TableRow key={item.id} hover onClick={() => handleEdit(item.id)} sx={{ cursor: 'pointer' }}>
            <TableCell><CountIcon color="action" fontSize="small" /></TableCell>
            <TableCell><Typography variant="body2" fontWeight="medium">{item.stockCountNumber || `SC-${item.id}`}</Typography></TableCell>
            <TableCell>{item.stockCountDate ? new Date(item.stockCountDate).toLocaleDateString() : '—'}</TableCell>
            <TableCell>{item.remarks || '—'}</TableCell>
            <TableCell align="right">
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEdit(item.id) }}><EditIcon fontSize="small" /></IconButton>
              <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDelete(item.id) }}><DeleteIcon fontSize="small" /></IconButton>
            </TableCell></TableRow>))}
          {items.length === 0 && <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4 }}><Typography variant="body2" color="text.secondary">No stock count records found.</Typography></TableCell></TableRow>}
        </TableBody></Table></TableContainer>)
}

import { Delete as DeleteIcon, Edit as EditIcon, MoneyOff as DisbIcon } from '@mui/icons-material'
import { Box, Chip, CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React from 'react'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useDisbursementHubStore } from '../store/use-disbursement-hub-store'

export const DisbursementList: React.FC = () => {
  const { searchKeyword, setSelectedId, setIsFormOpen } = useDisbursementHubStore()
  const { useList, useDeleteMutation } = useMasterfile('disbursement')
  const { data, isLoading, isError } = useList({ searchKeyword })
  const deleteMutation = useDeleteMutation()
  const handleEdit = (id: number) => { setSelectedId(id); setIsFormOpen(true) }
  const handleDelete = async (id: number) => { if (window.confirm('Delete this disbursement?')) await deleteMutation.mutateAsync(id) }
  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress size={32} /></Box>
  if (isError) return <Typography color="error">Failed to load disbursements.</Typography>
  const items = (data as any)?.items || []
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 'calc(100vh - 250px)' }}>
      <Table stickyHeader size="small"><TableHead><TableRow>
        <TableCell width={50}></TableCell><TableCell>Disbursement #</TableCell><TableCell>Date</TableCell>
        <TableCell>Type</TableCell><TableCell align="right">Amount</TableCell><TableCell>Return</TableCell>
        <TableCell align="right">Actions</TableCell>
      </TableRow></TableHead>
        <TableBody>{items.map((item: any) => (
          <TableRow key={item.id} hover onClick={() => handleEdit(item.id)} sx={{ cursor: 'pointer' }}>
            <TableCell><DisbIcon color="action" fontSize="small" /></TableCell>
            <TableCell><Typography variant="body2" fontWeight="medium">{item.disbursementNumber}</Typography></TableCell>
            <TableCell>{item.disbursementDate ? new Date(item.disbursementDate).toLocaleDateString() : '—'}</TableCell>
            <TableCell>{item.disbursementType || '—'}</TableCell>
            <TableCell align="right">{Number(item.amount || 0).toFixed(2)}</TableCell>
            <TableCell><Chip label={item.isReturn ? 'Return' : 'Normal'} size="small" color={item.isReturn ? 'warning' : 'default'} /></TableCell>
            <TableCell align="right">
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEdit(item.id) }}><EditIcon fontSize="small" /></IconButton>
              <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDelete(item.id) }}><DeleteIcon fontSize="small" /></IconButton>
            </TableCell></TableRow>))}
          {items.length === 0 && <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}><Typography variant="body2" color="text.secondary">No disbursements found.</Typography></TableCell></TableRow>}
        </TableBody></Table></TableContainer>)
}

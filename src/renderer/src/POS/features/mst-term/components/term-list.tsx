import { Delete as DeleteIcon, Edit as EditIcon, EventNote as TermIcon } from '@mui/icons-material'
import { Box, CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React from 'react'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useTermHubStore } from '../store/use-term-hub-store'

export const TermList: React.FC = () => {
  const { searchKeyword, setSelectedId, setIsFormOpen } = useTermHubStore()
  const { useList, useDeleteMutation } = useMasterfile('term')
  const { data, isLoading, isError } = useList({ searchKeyword })
  const deleteMutation = useDeleteMutation()
  const handleEdit = (id: number) => { setSelectedId(id); setIsFormOpen(true) }
  const handleDelete = async (id: number) => { if (window.confirm('Delete this term?')) await deleteMutation.mutateAsync(id) }
  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress size={32} /></Box>
  if (isError) return <Typography color="error">Failed to load terms.</Typography>
  const items = (data as any)?.items || []
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 'calc(100vh - 250px)' }}>
      <Table stickyHeader size="small"><TableHead><TableRow><TableCell width={50}></TableCell><TableCell>Name</TableCell><TableCell align="right">Days</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
        <TableBody>{items.map((item: any) => (<TableRow key={item.id} hover onClick={() => handleEdit(item.id)} sx={{ cursor: 'pointer' }}><TableCell><TermIcon color="action" fontSize="small" /></TableCell><TableCell><Typography variant="body2" fontWeight="medium">{item.name}</Typography></TableCell><TableCell align="right">{item.numberOfDays}</TableCell><TableCell align="right"><IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEdit(item.id) }}><EditIcon fontSize="small" /></IconButton><IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDelete(item.id) }}><DeleteIcon fontSize="small" /></IconButton></TableCell></TableRow>))}
          {items.length === 0 && <TableRow><TableCell colSpan={4} align="center" sx={{ py: 4 }}><Typography variant="body2" color="text.secondary">No terms found.</Typography></TableCell></TableRow>}
        </TableBody></Table></TableContainer>)
}

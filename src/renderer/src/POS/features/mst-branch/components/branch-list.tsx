import { Delete as DeleteIcon, Edit as EditIcon, Store as StoreIcon } from '@mui/icons-material'
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import React from 'react'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useBranchHubStore } from '../store/use-branch-hub-store'

export const BranchList: React.FC = () => {
  const { searchKeyword, setSelectedBranchId, setIsFormOpen } = useBranchHubStore()
  const { useList, useDeleteMutation } = useMasterfile('branch')
  
  const { data, isLoading, isError } = useList({ searchKeyword })
  const deleteMutation = useDeleteMutation()

  const handleEdit = (id: number) => {
    setSelectedBranchId(id)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      await deleteMutation.mutateAsync(id)
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (isError) {
    return <Typography color="error">Failed to load branches.</Typography>
  }

  const branches = (data as any)?.items || []

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 'calc(100vh - 250px)' }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell width={50}></TableCell>
            <TableCell>Branch Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Is Default</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {branches.map((branch: any) => (
            <TableRow key={branch.id} hover onClick={() => handleEdit(branch.id)} sx={{ cursor: 'pointer' }}>
              <TableCell>
                <StoreIcon color="primary" fontSize="small" />
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {branch.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Code: {branch.id}
                </Typography>
              </TableCell>
              <TableCell>{branch.address || 'N/A'}</TableCell>
              <TableCell>
                {branch.isDefault ? (
                  <Chip label="Default" size="small" color="primary" />
                ) : null}
              </TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEdit(branch.id); }}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDelete(branch.id); }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {branches.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No branches found.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

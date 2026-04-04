import { Delete as DeleteIcon, Edit as EditIcon, Store as StoreIcon } from '@mui/icons-material'
import {
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
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

  const [deleteId, setDeleteId] = React.useState<number | null>(null)

  const handleEdit = (id: number) => {
    setSelectedBranchId(id)
    setIsFormOpen(true)
  }

  const handleDelete = (id: number) => {
    setDeleteId(id)
  }

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId)
      setDeleteId(null)
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
    <>
      <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 'calc(100vh - 250px)' }} className="bg-white">
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell width={50}></TableCell>
            <TableCell>Branch</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Default</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {branches.map((branch: any) => (
            <TableRow key={branch.id} hover onClick={() => handleEdit(branch.id)} sx={{ cursor: 'pointer' }}>
              <TableCell>
                <StoreIcon color="primary" sx={{ fontSize: 25 }} />
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {branch.name}
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
                  <EditIcon sx={{ fontSize: 25 }} />
                </IconButton>
                <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDelete(branch.id); }}>
                  <DeleteIcon sx={{ fontSize: 25 }}/>
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

      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this branch? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

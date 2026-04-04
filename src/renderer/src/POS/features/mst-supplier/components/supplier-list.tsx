import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  LocalShipping as SupplierIcon
} from '@mui/icons-material'
import {
  Box,
  Button,
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
  TableRow,
  Typography
} from '@mui/material'
import React from 'react'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useSupplierHubStore } from '../store/use-supplier-hub-store'

export const SupplierList: React.FC = () => {
  const { searchKeyword, setSelectedSupplierId, setIsFormOpen } = useSupplierHubStore()
  const { useList, useDeleteMutation } = useMasterfile('supplier')

  const { data, isLoading, isError } = useList({ searchKeyword })
  const deleteMutation = useDeleteMutation()

  const handleEdit = (id: number) => {
    setSelectedSupplierId(id)
    setIsFormOpen(true)
  }

  const [deleteId, setDeleteId] = React.useState<number | null>(null)
  const handleDelete = (id: number) => setDeleteId(id)
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
    return <Typography color="error">Failed to load suppliers.</Typography>
  }

  const suppliers = (data as any)?.items || []

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
              <TableCell>Supplier Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier: any) => (
              <TableRow
                key={supplier.id}
                hover
                onClick={() => handleEdit(supplier.id)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>
                  <SupplierIcon color="action" sx={{ fontSize: 25 }} />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {supplier.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    TIN: {supplier.tin || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>{supplier.address || 'N/A'}</TableCell>
                <TableCell>
                  {supplier.cellphoneNumber || supplier.telephoneNumber || 'N/A'}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(supplier.id)
                    }}
                  >
                    <EditIcon sx={{ fontSize: 25 }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(supplier.id)
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 25 }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {suppliers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No suppliers found.
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
          <DialogContentText>Delete this supplier? This cannot be undone.</DialogContentText>
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


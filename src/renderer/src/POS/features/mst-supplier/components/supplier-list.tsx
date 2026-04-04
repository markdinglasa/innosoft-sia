import React from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Typography, 
  Box,
  CircularProgress
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, LocalShipping as SupplierIcon } from '@mui/icons-material'
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

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
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
    return <Typography color="error">Failed to load suppliers.</Typography>
  }

  const suppliers = (data as any)?.items || []

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 'calc(100vh - 250px)' }}>
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
            <TableRow key={supplier.id} hover onClick={() => handleEdit(supplier.id)} sx={{ cursor: 'pointer' }}>
              <TableCell>
                <SupplierIcon color="action" fontSize="small" />
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
              <TableCell>{supplier.cellphoneNumber || supplier.telephoneNumber || 'N/A'}</TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEdit(supplier.id); }}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDelete(supplier.id); }}>
                  <DeleteIcon fontSize="small" />
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
  )
}

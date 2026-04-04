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
  Chip,
  Box,
  CircularProgress
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, PersonPin as CustomerIcon } from '@mui/icons-material'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useCustomerHubStore } from '../store/use-customer-hub-store'

export const CustomerList: React.FC = () => {
  const { searchKeyword, setSelectedCustomerId, setIsFormOpen } = useCustomerHubStore()
  const { useList, useDeleteMutation } = useMasterfile('customer')
  
  const { data, isLoading, isError } = useList({ searchKeyword })
  const deleteMutation = useDeleteMutation()

  const handleEdit = (id: number) => {
    setSelectedCustomerId(id)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
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
    return <Typography color="error">Failed to load customers.</Typography>
  }

  const customers = (data as any)?.items || []

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 'calc(100vh - 250px)' }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell width={50}></TableCell>
            <TableCell>Customer Name</TableCell>
            <TableCell>Contact Details</TableCell>
            <TableCell>TIN</TableCell>
            <TableCell align="right">Credit Limit</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer: any) => (
            <TableRow key={customer.id} hover onClick={() => handleEdit(customer.id)} sx={{ cursor: 'pointer' }}>
              <TableCell>
                <CustomerIcon color="primary" fontSize="small" />
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {customer.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {customer.customerCode || 'No Code'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="caption" display="block">{customer.contactPerson}</Typography>
                <Typography variant="caption" color="text.secondary">{customer.contactNumber}</Typography>
              </TableCell>
              <TableCell>{customer.tin || 'N/A'}</TableCell>
              <TableCell align="right">{Number(customer.creditLimit).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEdit(customer.id); }}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDelete(customer.id); }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {customers.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No customers found.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

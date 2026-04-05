import { PersonPin as CustomerIcon, Delete as DeleteIcon } from '@mui/icons-material'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material'
import { ButtonType } from '@shared/types'
import React from 'react'
import CircleButton from '../../../components/inputs/circle-button'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useCustomerHubStore } from '../store/use-customer-hub-store'

export const CustomerList: React.FC = () => {
  const { searchKeyword, setSelectedCustomerId, setIsFormOpen } = useCustomerHubStore()
  const { useList, useDeleteMutation } = useMasterfile('customer')

  const [page, setPage] = React.useState(0)
  const { data, isLoading, isError } = useList({ searchKeyword, page: page + 1, take: 30 })

  // Reset page when search changes
  React.useEffect(
    function resetPageOnSearch() {
      setPage(0)
    },
    [searchKeyword]
  )

  const deleteMutation = useDeleteMutation()

  const handleEdit = (id: number) => {
    setSelectedCustomerId(id)
    setIsFormOpen(true)
  }

  const [deleteId, setDeleteId] = React.useState<number | null>(null)
  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
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
    return <Typography color="error">Failed to load customers.</Typography>
  }

  const customers = (data as any)?.items || []

  return (
    <>
      <TableContainer component={Paper} variant="outlined">
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell width={50}></TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Contact Details</TableCell>
              <TableCell>TIN</TableCell>
              <TableCell align="right">Credit Limit</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer: any) => (
              <TableRow
                key={customer.id}
                hover
                onClick={() => handleEdit(customer.id)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>
                  <CustomerIcon color="primary" sx={{ fontSize: 25 }} />
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
                  <Typography variant="caption" display="block">
                    {customer.contactPerson}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {customer.contactNumber}
                  </Typography>
                </TableCell>
                <TableCell>{customer.tin || 'N/A'}</TableCell>
                <TableCell align="right">
                  {Number(customer.creditLimit).toLocaleString(undefined, {
                    minimumFractionDigits: 2
                  })}
                </TableCell>
                <TableCell align="right">
                  <CircleButton
                    icon={<DeleteIcon sx={{ fontSize: 25 }} />}
                    onClick={(e) => handleDelete(e, customer.id)}
                    type={ButtonType.button}
                  />
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
        <TablePagination
          rowsPerPageOptions={[30]}
          component="div"
          count={(data as any)?.meta?.totalItems || 0}
          rowsPerPage={30}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
        />
      </TableContainer>

      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Delete this customer? This cannot be undone.</DialogContentText>
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


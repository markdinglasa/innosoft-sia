import { PersonPin as CustomerIcon, Delete as DeleteIcon } from '@mui/icons-material'
import {
  Button,
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
import { SystemPermissions } from '@shared/constants/permissions'
import { ButtonType, ToastType } from '@shared/types'
import { displayToast } from '@shared/utils'
import React from 'react'
import TableSkeleton from '../../../components/data-display/table-skeleton'
import CircleButton from '../../../components/inputs/circle-button'
import { useAccessControl } from '../../../hooks'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useCustomerHubStore } from '../store/use-customer-hub-store'

export const CustomerList: React.FC = () => {
  const { searchKeyword, setSelectedCustomerId, setIsFormOpen } = useCustomerHubStore()
  const { useList, useDeleteMutation } = useMasterfile('customer')

  const [page, setPage] = React.useState(0)
  const { data, isLoading, isError } = useList({ searchKeyword, page: page + 1, take: 30 })

  // permissions
  const { hasPermission } = useAccessControl()
  const canDelete = hasPermission(SystemPermissions.CUSTOMER_REMOVE)
  const canEdit = hasPermission(SystemPermissions.CUSTOMER_EDIT)

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
            <TableSkeleton isLoading={isLoading} columns={6} rows={15}>
              {customers.map((customer: any) => (
                <TableRow
                  key={customer.id}
                  hover
                  onClick={() => {
                    if (!canEdit) {
                      displayToast(
                        'You do not have permission to edit this customer.',
                        ToastType.info
                      )
                      return
                    }
                    handleEdit(customer.id)
                  }}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <CustomerIcon color="primary" sx={{ fontSize: 25 }} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {customer.name}
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
                      disabled={!canDelete}
                      icon={<DeleteIcon sx={{ fontSize: 25 }} />}
                      onClick={(e) => handleDelete(e, customer.id)}
                      type={ButtonType.button}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {isError && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="error">Failed to load customers.</Typography>
                  </TableCell>
                </TableRow>
              )}
              {customers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No customers found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableSkeleton>
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
            color="primary"
            variant="contained"
            startIcon={<DeleteIcon sx={{ fontSize: 25 }} />}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}


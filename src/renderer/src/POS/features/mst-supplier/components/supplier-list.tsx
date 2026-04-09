import { Delete as DeleteIcon, LocalShipping as SupplierIcon } from '@mui/icons-material'
import {
  Button,
  Checkbox,
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
import { useAccessControl, useMasterfile } from '../../../hooks'
import { useSupplierHubStore } from '../store/use-supplier-hub-store'

export const SupplierList: React.FC = () => {
  const { searchKeyword, setSelectedSupplierId, setIsFormOpen } = useSupplierHubStore()
  const { useList, useDeleteMutation } = useMasterfile('supplier')

  const [page, setPage] = React.useState(0)
  const { data, isLoading, isError } = useList({ searchKeyword, page: page + 1, take: 30 })

  // permissions
  const { hasPermission } = useAccessControl()
  const canEdit = hasPermission(SystemPermissions.SUPPLIER_EDIT)
  const canDelete = hasPermission(SystemPermissions.SUPPLIER_REMOVE)

  // Reset page when search changes
  React.useEffect(
    function resetPageOnSearch() {
      setPage(0)
    },
    [searchKeyword]
  )

  const deleteMutation = useDeleteMutation()

  const handleEdit = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    setSelectedSupplierId(id)
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

  const suppliers = (data as any)?.items || []

  return (
    <>
      <TableContainer component={Paper} variant="outlined">
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell width={50}></TableCell>
              <TableCell>Supplier </TableCell>
              <TableCell>Address</TableCell>
              <TableCell align="right">Contact Number</TableCell>
              <TableCell align="right">Default</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableSkeleton isLoading={isLoading} columns={6} rows={15}>
              {suppliers.map((supplier: any) => (
                <TableRow
                  key={supplier.id}
                  hover
                  onClick={(e) => {
                    if (!canEdit) {
                      displayToast(
                        'You do not have permission to edit this supplier.',
                        ToastType.info
                      )
                      return
                    }
                    handleEdit(e, supplier.id)
                  }}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <SupplierIcon color="primary" sx={{ fontSize: 25 }} />
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
                  <TableCell align="right">{supplier.contactNumber || 'N/A'}</TableCell>
                  <TableCell align="right">
                    <Checkbox
                      checked={!!supplier.isDefault}
                      readOnly
                      size="small"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <CircleButton
                      disabled={!canDelete}
                      icon={<DeleteIcon sx={{ fontSize: 25 }} />}
                      onClick={(e) => handleDelete(e, supplier.id)}
                      type={ButtonType.button}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {isError && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="error">Failed to load suppliers.</Typography>
                  </TableCell>
                </TableRow>
              )}
              {!isError && suppliers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No suppliers found.
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
          <DialogContentText>Delete this supplier? This cannot be undone.</DialogContentText>
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


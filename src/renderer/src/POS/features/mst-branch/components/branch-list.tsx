import { Delete as DeleteIcon, Store as StoreIcon } from '@mui/icons-material'
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
import { MstBranchEntity } from 'src/main/entities'
import TableSkeleton from '../../../components/data-display/table-skeleton'
import CircleButton from '../../../components/inputs/circle-button'
import { useAccessControl, useMasterfile } from '../../../hooks'
import { useBranchHubStore } from '../store/use-branch-hub-store'

export const BranchList: React.FC = () => {
  // permissions
  const { hasPermission } = useAccessControl()
  const canDelete = hasPermission(SystemPermissions.BRANCH_REMOVE)
  const canEdit = hasPermission(SystemPermissions.BRANCH_EDIT)
  // hooks
  const { searchKeyword, setSelectedBranchId, setIsFormOpen } = useBranchHubStore()
  const { useList, useDeleteMutation } = useMasterfile('branch')

  const [page, setPage] = React.useState(0)
  const { data, isLoading, isError } = useList({ searchKeyword, page: page + 1, take: 30 })

  // Reset to first page on search
  React.useEffect(
    function resetPageOnSearch() {
      setPage(0)
    },
    [searchKeyword]
  )

  const deleteMutation = useDeleteMutation()
  const [deleteId, setDeleteId] = React.useState<number | null>(null)

  const handleEdit = (id: number) => {
    setSelectedBranchId(id)
    setIsFormOpen(true)
  }

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

  const branches = data?.items || []

  return (
    <>
      <TableContainer component={Paper} variant="outlined">
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell width={50}></TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Address</TableCell>
              <TableCell align="right">Default</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableSkeleton isLoading={isLoading} columns={5} rows={15}>
              {branches.map((branch: MstBranchEntity) => (
                <TableRow
                  key={branch.id}
                  hover
                  onClick={() => {
                    if (!canEdit) {
                      displayToast(
                        'You do not have permission to delete this branch.',
                        ToastType.info
                      )
                      return
                    }
                    handleEdit(branch.id)
                  }}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <StoreIcon color="primary" sx={{ fontSize: 25 }} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {branch.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{branch.address || 'N/A'}</TableCell>
                  <TableCell align="right">
                    <Checkbox checked={!!branch.isDefault} readOnly size="small" color="primary" />
                  </TableCell>
                  <TableCell align="right">
                    <CircleButton
                      disabled={!canDelete}
                      icon={<DeleteIcon sx={{ fontSize: 25 }} />}
                      onClick={(e) => handleDelete(e, branch.id)}
                      type={ButtonType.button}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {isError && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="error">Failed to load branches.</Typography>
                  </TableCell>
                </TableRow>
              )}
              {!isError && branches.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No branches found.
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
          <DialogContentText>
            Are you sure you want to delete this branch? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button
            onClick={confirmDelete}
            color="primary"
            variant="contained"
            disabled={deleteMutation.isPending}
            startIcon={<DeleteIcon sx={{ fontSize: 25 }} />}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}


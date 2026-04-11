import { Delete as DeleteIcon, TableChart as GroupIcon } from '@mui/icons-material'
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
import { useSelector } from 'react-redux'
import TableSkeleton from '../../../components/data-display/table-skeleton'
import CircleButton from '../../../components/inputs/circle-button'
import { useAccessControl } from '../../../hooks'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useTableGroupHubStore } from '../store/use-table-group-hub-store'

export const TableGroupList: React.FC = () => {
  const { searchKeyword, setSelectedId, setIsFormOpen } = useTableGroupHubStore()
  const activeBranch = useSelector((state: any) => state.POS.manager.activeBranch)
  const { useList, useDeleteMutation } = useMasterfile('tableGroup')
  const [page, setPage] = React.useState(0)
  const { data, isLoading, isError } = useList({
    searchKeyword,
    page: page + 1,
    take: 30,
    filters: activeBranch ? [{ field: 'branchId', value: activeBranch.id, operator: 'equal' }] : []
  })

  // permissions
  const { hasPermission } = useAccessControl()
  const canDelete = hasPermission(SystemPermissions.TABLE_GROUP_REMOVE)
  const canEdit = hasPermission(SystemPermissions.TABLE_GROUP_EDIT)

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
    setSelectedId(id)
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

  const items = (data as any)?.items || []
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
              <TableCell>Table Group</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableSkeleton isLoading={isLoading} columns={3} rows={3}>
              {items.map((item: any) => (
                <TableRow
                  key={item.id}
                  hover
                  onClick={(e) => {
                    if (!canEdit) {
                      displayToast(
                        'You do not have permission to edit this table group.',
                        ToastType.error
                      )
                      return
                    }
                    handleEdit(e, item.id)
                  }}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <GroupIcon color="primary" sx={{ fontSize: 25 }} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {item.name}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <CircleButton
                      disabled={!canDelete}
                      icon={<DeleteIcon sx={{ fontSize: 25 }} />}
                      onClick={(e) => handleDelete(e, item.id)}
                      type={ButtonType.button}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {isError && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="error">Failed to load table groups.</Typography>
                  </TableCell>
                </TableRow>
              )}
              {!isError && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No table groups found.
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
          <DialogContentText>Delete this table group? This cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button
            onClick={confirmDelete}
            color="primary"
            startIcon={<DeleteIcon sx={{ fontSize: 25 }} />}
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


import { Delete as DeleteIcon, EventNote as TermIcon } from '@mui/icons-material'
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
import { useTermHubStore } from '../store/use-term-hub-store'

export const TermList: React.FC = () => {
  const { searchKeyword, setSelectedId, setIsFormOpen } = useTermHubStore()
  const { useList, useDeleteMutation } = useMasterfile('term')
  const [page, setPage] = React.useState(0)
  const { data, isLoading, isError } = useList({ searchKeyword, page: page + 1, take: 30 })

  // permissions
  const { hasPermission } = useAccessControl()
  const canEdit = hasPermission(SystemPermissions.TERM_EDIT)
  const canDelete = hasPermission(SystemPermissions.TERM_REMOVE)

  // Reset page when search changes
  React.useEffect(
    function resetPageOnSearch() {
      setPage(0)
    },
    [searchKeyword]
  )

  const deleteMutation = useDeleteMutation()
  const handleEdit = (id: number) => {
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
              <TableCell>Term</TableCell>
              <TableCell align="right">Days</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableSkeleton isLoading={isLoading} columns={4} rows={15}>
              {items.map((item: any) => (
                <TableRow
                  key={item.id}
                  hover
                  onClick={() => {
                    if (!canEdit) {
                      displayToast('You do not have permission to edit this term.', ToastType.info)
                      return
                    }
                    handleEdit(item.id)
                  }}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <TermIcon color="primary" sx={{ fontSize: 25 }} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {item.name}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{item.numberOfDays}</TableCell>
                  <TableCell align="right">
                    <CircleButton
                      disabled={!canDelete}
                      icon={<DeleteIcon sx={{ fontSize: 25 }} />}
                      onClick={(e) => handleDelete(e, item?.id)}
                      type={ButtonType.button}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {isError && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="error">Failed to load term(s).</Typography>
                  </TableCell>
                </TableRow>
              )}
              {!isError && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No term(s) found.
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
          <DialogContentText>Delete this term? This cannot be undone.</DialogContentText>
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


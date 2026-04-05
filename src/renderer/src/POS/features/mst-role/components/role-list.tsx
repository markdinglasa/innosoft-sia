import { Delete as DeleteIcon, Security as SecurityIcon } from '@mui/icons-material'
import {
  Box,
  Button,
  Chip,
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
import { useRoleHubStore } from '../store/use-role-hub-store'

export const RoleList: React.FC = () => {
  const { searchKeyword, setSelectedRoleId, setIsFormOpen } = useRoleHubStore()
  const { useList, useDeleteMutation } = useMasterfile('role')

  const [page, setPage] = React.useState(0)
  const { data, isLoading, isError } = useList({ searchKeyword, page: page + 1, take: 30 })

  // Reset page when search changes
  React.useEffect(function resetPageOnSearch() {
    setPage(0)
  }, [searchKeyword])
  
  const deleteMutation = useDeleteMutation()

  const handleEdit = (id: number) => {
    setSelectedRoleId(id)
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
    return <Typography color="error">Failed to load roles.</Typography>
  }

  const roles = (data as any)?.items || []

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
              <TableCell>Role Name</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role: any) => (
              <TableRow
                key={role.id}
                hover
                onClick={() => handleEdit(role.id)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>
                  <SecurityIcon color="primary" sx={{ fontSize: 25 }} />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {role.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {role.description || 'No description'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={`${role.permissions?.length || 0} Rights`}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <CircleButton
                    onClick={() => handleDelete(role.id)}
                    icon={<DeleteIcon sx={{ fontSize: 25 }} />}
                    type={ButtonType.button}
                  />
                </TableCell>
              </TableRow>
            ))}
            {roles.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No roles found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[30]}
        component="div"
        count={(data as any)?.meta?.totalItems || 0}
        rowsPerPage={30}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
      />


      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Delete this role? This cannot be undone.</DialogContentText>
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


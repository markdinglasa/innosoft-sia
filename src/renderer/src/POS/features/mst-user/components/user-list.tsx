import { Delete as DeleteIcon, Edit as EditIcon, Person as PersonIcon } from '@mui/icons-material'
import { Button, 
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useUserHubStore } from '../store/use-user-hub-store'

export const UserList: React.FC = () => {
  const { searchKeyword, setSelectedUserId, setIsFormOpen } = useUserHubStore()
  const { useList, useDeleteMutation } = useMasterfile('user')
  
  const { data, isLoading, isError } = useList({ searchKeyword })
  const deleteMutation = useDeleteMutation()

  const handleEdit = (id: number) => {
    setSelectedUserId(id)
    setIsFormOpen(true)
  }

  const [deleteId, setDeleteId] = React.useState<number | null>(null)
  const handleDelete = (id: number) => setDeleteId(id)
  const confirmDelete = async () => { if(deleteId) { await deleteMutation.mutateAsync(deleteId); setDeleteId(null); } }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (isError) {
    return <Typography color="error">Failed to load users.</Typography>
  }

  const users = (data as any)?.items || []

  return (
    <>
    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 'calc(100vh - 250px)' }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell width={50}></TableCell>
            <TableCell>Full Name</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user: any) => (
            <TableRow key={user.id} hover onClick={() => handleEdit(user.id)} sx={{ cursor: 'pointer' }}>
              <TableCell>
                <PersonIcon color="action" sx={{ fontSize: 25 }} />
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {user.fullName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              </TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>
                <Chip label={user.type} size="small" variant="outlined" />
              </TableCell>
              <TableCell>
                <Chip 
                  label={user.status} 
                  size="small" 
                  color={user.status === 'Active' ? 'success' : 'default'} 
                />
              </TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEdit(user.id); }}>
                  <EditIcon sx={{ fontSize: 25 }} />
                </IconButton>
                <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDelete(user.id); }}>
                  <DeleteIcon sx={{ fontSize: 25 }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No users found.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>

      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}><DialogTitle>Confirm Delete</DialogTitle><DialogContent><DialogContentText>Delete this user? This cannot be undone.</DialogContentText></DialogContent><DialogActions><Button onClick={() => setDeleteId(null)}>Cancel</Button><Button onClick={confirmDelete} color="error" variant="contained" disabled={deleteMutation.isPending}>{deleteMutation.isPending ? 'Deleting...' : 'Delete'}</Button></DialogActions></Dialog>
    </>
  )
}

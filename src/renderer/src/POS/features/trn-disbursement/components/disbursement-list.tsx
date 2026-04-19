import { Delete as DeleteIcon, MoneyOff as DisbIcon, Edit as EditIcon, Print as PrintIcon } from '@mui/icons-material'
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
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Tooltip
} from '@mui/material'
import React from 'react'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useDisbursementHubStore } from '../store/use-disbursement-hub-store'
import { useDisbursement } from '../hooks/use-disbursement'

export const DisbursementList: React.FC = () => {
  const { searchKeyword, setSelectedId, setIsFormOpen } = useDisbursementHubStore()
  const { useList, useDeleteMutation } = useMasterfile('disbursement')
  const { usePrintReceipt } = useDisbursement()
  const printMutation = usePrintReceipt()
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
    setSelectedId(id)
    setIsFormOpen(true)
  }

  const handlePrint = (id: number) => {
    printMutation.mutate(id)
  }

  const [deleteId, setDeleteId] = React.useState<number | null>(null)
  const handleDelete = (id: number) => setDeleteId(id)
  const confirmDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }

  if (isLoading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={32} />
      </Box>
    )

  if (isError) return <Typography color="error">Failed to load disbursements.</Typography>

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
              <TableCell>Disbursement #</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Return</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item: any) => (
              <TableRow
                key={item.id}
                hover
                onClick={() => handleEdit(item.id)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>
                  <DisbIcon color="action" sx={{ fontSize: 25 }} />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {item.disbursementNumber}
                  </Typography>
                </TableCell>
                <TableCell>
                  {item.disbursementDate
                    ? new Date(item.disbursementDate).toLocaleDateString()
                    : '—'}
                </TableCell>
                <TableCell>{item.disbursementType || '—'}</TableCell>
                <TableCell align="right">{Number(item.amount || 0).toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={item.isReturn ? 'Return' : 'Normal'}
                    size="small"
                    color={item.isReturn ? 'warning' : 'default'}
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Print Receipt">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePrint(item.id)
                      }}
                      disabled={printMutation.isPending}
                    >
                      <PrintIcon sx={{ fontSize: 25 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(item.id)
                      }}
                    >
                      <EditIcon sx={{ fontSize: 25 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(item.id)
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 25 }} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No disbursements found.
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
          <DialogContentText>Delete this disbursement? This cannot be undone.</DialogContentText>
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


import {
  ReceiptLong as CollectionIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon
} from '@mui/icons-material'
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
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import TableSkeleton from '../../../components/data-display/table-skeleton'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useCollectionExport } from '../hooks/use-collection-export'
import { useCollectionHubStore } from '../store/use-collection-hub-store'
import { CollectionPreview } from './collection-preview'

export const CollectionList: React.FC = () => {
  const { searchKeyword, setSelectedId, setIsFormOpen } = useCollectionHubStore()
  const { useList, useGet, useDeleteMutation } = useMasterfile('collection')
  const [page, setPage] = React.useState(0)
  const { data, isLoading, isError } = useList({ searchKeyword, page: page + 1, take: 30 })

  const [previewId, setPreviewId] = useState<number | null>(null)
  const { data: previewData } = useGet(previewId)
  const { exportToPDF, exportToCSV, exportToXLSX } = useCollectionExport()

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
  if (isError) return <Typography color="error">Failed to load collections.</Typography>
  const items = data?.items || []
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
              <TableCell>Collection #</TableCell>
              <TableCell>Collection Date</TableCell>
              <TableCell>OR #</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableSkeleton isLoading={isLoading} rows={30} columns={7}>
              {items.map((item: any) => (
                <TableRow
                  key={item.id}
                  hover
                  onClick={() => handleEdit(item.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <CollectionIcon color="action" sx={{ fontSize: 25 }} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {item.collectionNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {item.collectionDate ? new Date(item.collectionDate).toLocaleDateString() : '—'}
                  </TableCell>
                  <TableCell>{item.manualORNumber || '—'}</TableCell>
                  <TableCell align="right">{Number(item.amount || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.isCancelled ? 'Cancelled' : 'Active'}
                      size="small"
                      color={item.isCancelled ? 'error' : 'success'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="info"
                      onClick={(e) => {
                        e.stopPropagation()
                        setPreviewId(item.id)
                      }}
                    >
                      <ViewIcon sx={{ fontSize: 25 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(item.id)
                      }}
                    >
                      <EditIcon sx={{ fontSize: 25 }} />
                    </IconButton>
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
                  </TableCell>
                </TableRow>
              ))}
              {isError && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="error">Failed to load collection(s).</Typography>
                  </TableCell>
                </TableRow>
              )}
              {!isError && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No collection(s) found.
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
          count={data?.meta?.totalItems || 0}
          rowsPerPage={30}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
        />
      </TableContainer>

      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Delete this collection? This cannot be undone.</DialogContentText>
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

      <CollectionPreview
        open={previewId !== null}
        onClose={() => setPreviewId(null)}
        data={previewData}
        onExport={(format) => {
          const filename = `Collection_${previewData.collectionNumber}`
          if (format === 'pdf') exportToPDF('receipt-content', filename)
          if (format === 'csv') exportToCSV(previewData, filename)
          if (format === 'xlsx') exportToXLSX(previewData, filename)
        }}
      />
    </>
  )
}


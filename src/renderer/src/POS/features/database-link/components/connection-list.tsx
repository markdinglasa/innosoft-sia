import {
  Add,
  ErrorOutlineOutlined
} from '@mui/icons-material'
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle
} from '@mui/material'
import { colors } from '@shared/styles'
import { Fragment, lazy, Suspense, useState } from 'react'
import { DBConfig } from '../../../../../../shared/types'
import {
  useActivateConnection,
  useDeleteConnection,
  useSyncSchema
} from '../api/react-queries/connection.queries'
import { ConnectionCardSkeleton } from "./connection-card-skeleton"
import { DatabaseLinkFormSkeleton } from "./database-link-form-skeleton"

interface ConnectionListProps {
  connections: DBConfig[]
  onRefresh: () => void
  loading?: boolean
}

const ConnectionCard = lazy(() => import('./connection-card'))
const DatabaseLinkForm = lazy(() => import('./database-link-form'))

export default function ConnectionList({
  connections,
  onRefresh,
  loading: parentLoading
}: ConnectionListProps) {
  const [showForm, setShowForm] = useState(false)
  const activateMutation = useActivateConnection()
  const deleteMutation = useDeleteConnection()
  const syncMutation = useSyncSchema()

  const loading =
    parentLoading ||
    activateMutation.isPending ||
    deleteMutation.isPending ||
    syncMutation.isPending
  const error =
    syncMutation.error?.message || activateMutation.error?.message || deleteMutation.error?.message

  const onActivate = (id: string) => {
    activateMutation.mutate(id, {
      onSuccess: () => onRefresh()
    })
  }

  const [deleteId, setDeleteId] = useState<string | null>(null)

  const onDelete = (id: string) => {
    setDeleteId(id)
  }

  const confirmDelete = () => {
    if (!deleteId) return
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        setDeleteId(null)
        onRefresh()
      }
    })
  }

  const onSync = () => {
    syncMutation.mutate()
  }

  const hasActiveConnection = connections.some((conn) => conn.isActive)

  if (connections.length === 0 && !showForm) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No database connections configured yet.
        </Typography>
        <Button variant="contained" onClick={() => setShowForm(true)} sx={{ mt: 2 }}>
          New Connection
        </Button>
      </Box>
    )
  }

  if (showForm) {
    return (
      <Suspense fallback={<DatabaseLinkFormSkeleton/>}>
        <DatabaseLinkForm
          onCancel={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false)
            onRefresh()
          }}
      />
      </Suspense>
    )
  }

  if (syncMutation.isPending) {
    return (
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
        open={syncMutation.isPending}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6">Syncing Database Schema...</Typography>
      </Backdrop>
    )
  }

  return (
    <Container
      sx={{
        width: '100%',
        minHeight: '50rem',
        maxHeight: 'calc(100vh - 40rem)',
        borderRadius: '2rem',
        position: 'relative',
        bgcolor: colors.white
      }}
    >
      <Box
        sx={{
          position: 'sticky',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 1
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ paddingY: '3rem' }}>
          Configured Connections
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="outlined"
            onClick={() => setShowForm(true)}
            disabled={loading}
            className="gap-2 flex flex-row"
          >
            <Add sx={{ fontSize:25 }} />
            New Connection
          </Button>

          {hasActiveConnection && (
            <Button
              variant="contained"
              onClick={onSync}
              disabled={loading}
            >
              Next
            </Button>
          )}
        </Stack>
      </Box>

      {error && (
        <Box
          sx={{
            width: '100%',
            height: '5rem',
            bgcolor: colors.palette.red['050'],
            borderRadius: '1rem',
            mb: '2rem',
            placeItems: 'center',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ErrorOutlineOutlined
            sx={{ width: '2rem', height: '2rem', color: colors.palette.red['500'] }}
          />
          <Typography color="error" align="center">
            {error}
          </Typography>
        </Box>
      )}
      <Box sx={{ overflowY: 'auto', position: 'relative', height: '50rem' }}>
        <Stack spacing={2}>
          {connections.map((connection, index) => (
           <Fragment key={index}>
            <Suspense fallback={<ConnectionCardSkeleton/>}>
              <ConnectionCard
                connection={connection}
                isLoading={loading}
                onDelete={onDelete}
                onActivate={onActivate}
              />
            </Suspense>
           </Fragment>
          ))}
        </Stack>
      </Box>

      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this connection? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
  
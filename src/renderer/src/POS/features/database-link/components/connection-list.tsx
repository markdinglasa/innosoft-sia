import { Add, Delete as DeleteIcon, ErrorOutlineOutlined, PowerSettingsNew as PowerIcon } from '@mui/icons-material'
import {
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Stack,
  Typography
} from '@mui/material'
import { colors } from "@shared/styles"
import { useCallback, useState } from "react"
import { useDispatch } from "react-redux"
import { DBConfig, SqlChannel } from '../../../../../../shared/types'
import { setActivePage } from "../../../store/manager"
import { POSPages } from "../../../types/pages"
import DatabaseLinkForm from "./database-link-form"

interface ConnectionListProps {
  connections: DBConfig[]
  onRefresh: () => void
}

export default function ConnectionList({ connections, onRefresh }: ConnectionListProps) {

    const [showForm, setShowForm] = useState(false)
    const [syncing, setSyncing] = useState(false)
    const [error, setError] = useState('')
    const dispatch = useDispatch()

      const fetchConnections = useCallback(async () => {
        const response = await window.electron.sql.get(SqlChannel.getConnections)
        if (response.IsSomething) {
         // setConnections(response.Data || [])
        }
      }, [])
    
  const onActivate = async (id: string) => {
    const response = await window.electron.sql.post(SqlChannel.activateConnection, id)
    if (response.IsSomething) {
      onRefresh()
    } else {
      alert(response.Message || 'Failed to activate connection')
    }
  }

  const onDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this connection?')) return
    const response = await window.electron.sql.post(SqlChannel.deleteConnection, id)
    if (response.IsSomething) {
      onRefresh()
    } else {
      alert(response.Message || 'Failed to delete connection')
    }
  }



  const hasActiveConnection = connections.some(conn => conn.isActive)

  const onProceed = async () => {
    try {
      setSyncing(true)
      setError('')
      const response = await window.electron.sql.post(SqlChannel.syncSchema)
      if (response.IsSomething) {
        // Navigate to login after successful sync using Redux
        dispatch(setActivePage(POSPages.LOGIN))
      } else {
        setError(response.Message || 'Failed to synchronize database schema')
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during sync')
    } finally {
      setSyncing(false)
    }
  }

  if (connections.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No database connections configured yet.
        </Typography>
      </Box>
    )
  }

  if (showForm) {
    return (
      <DatabaseLinkForm 
        onCancel={() => setShowForm(false)} 
        onSuccess={() => {
          setShowForm(false)
          fetchConnections()
        }} 
      />
    )
  }

  if (syncing) {
    return <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, display: 'flex', flexDirection: 'column', gap: 2 }}
        open={syncing}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6">Syncing Database Schema...</Typography>
      </Backdrop>
  }

  return (
    <Container sx={{width:'100%', minHeight:'60rem', maxHeight:'calc(100vh - 40rem)', borderRadius:'2rem', position:'relative', bgcolor:colors.white}}>
    <Box sx={{position:'sticky', display:'flex', flexDirection:'row', alignItems:'center',justifyContent:'space-between',zIndex:1}}>
        <Typography variant="h5" gutterBottom sx={{ paddingY:'3rem'}}>
          Configured Connections
        </Typography>
         <Stack direction="row"  spacing={2} justifyContent="center" >
          <Button
            variant="outlined"
            onClick={() => setShowForm(true)}
            size="large"
            sx={{ height: '4rem', gap:'1rem', borderRadius: '1rem', px: 4, bgcolor: 'white' }}
          >
            <Add sx={{width:'2rem', height:'2rem'}}/>
            New Connection
          </Button>
          
          {hasActiveConnection && (
            <Button
              variant="contained"
              onClick={onProceed}
              size="large"
              sx={{ height: '4rem', borderRadius: '1rem', px: 6 }}
            >
              Next
            </Button>
          )}
        </Stack>
      </Box>
          {error && (
    <Box sx={{width:'100%', height:'5rem', bgcolor:colors.palette.red['050'], borderRadius:'1rem', mb:'2rem', placeItems:'center', display:'flex', gap:'1rem', alignItems:'center', justifyContent:'center'}}>
      <ErrorOutlineOutlined sx={{width:'2rem', height:'2rem', color:colors.palette.red['500']}}/>
        <Typography color="error" align="center" >
        {error}
      </Typography>
      </Box>
    )}
    <Box sx={{overflowY:'auto', position:'relative', height:'50rem', }}>


      <Stack spacing={2}>
        {connections.map((conn) => (
          <Card key={conn.id} variant="outlined" sx={{ 
            borderColor: conn.isActive ? 'primary.main' : 'divider',
            borderWidth: conn.isActive ? 2 : 1,
            bgcolor:colors.palette.neutral['050']
          }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6">
                    {conn.server} ({conn.name})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    User: {conn.user} | Port: {conn.port}
                  </Typography>
                </Box>
                <Box>
                  {conn.isActive ? (
                    <Chip label="ACTIVE" color="primary" variant="filled" />
                  ) : (
                    <Chip label="INACTIVE" variant="outlined" />
                  )}
                </Box>
              </Stack>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
              <IconButton 
                color="error" 
                onClick={() => onDelete(conn.id)}
                disabled={syncing || conn.isActive}
                sx={{height:'4rem', width:'4rem'}}
              >
                <DeleteIcon  sx={{height:'2rem', width:'2rem'}}/>
              </IconButton>
              {!conn.isActive && (
                <Button
                  variant="outlined"
                  sx={{height:'4rem'}}
                  startIcon={<PowerIcon />}
                  onClick={() => onActivate(conn.id)}
                  disabled={syncing}
                >
                  Activate
                </Button>
              )}
            </CardActions>
          </Card>
        ))}
      </Stack>
    </Box>
 </Container>
  )
}

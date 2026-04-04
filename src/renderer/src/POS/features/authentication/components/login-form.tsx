import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { AppDispatch, ToastType } from '@shared/types'
import { displayToast } from "@shared/utils"
import { format } from 'date-fns'
import { memo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setActivePage } from '../../../store/manager'
import { POSPages } from '../../../types/pages'
import { useAuth } from '../hooks/use-auth'

function LoginForm() {
  const dispatch = useDispatch<AppDispatch>()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginDate, setLoginDate] = useState(format(new Date(), 'yyyy-MM-dd'))

  // Override Modal State
  const [showOverride, setShowOverride] = useState(false)
  const [overrideUsername, setOverrideUsername] = useState('')
  const [overridePassword, setOverridePassword] = useState('')
  const [error, setError]  = useState<string|null>(null)
  // mutations
  const { login, isLoading, error: authError } = useAuth()

  const handleSubmit = async (e?: React.FormEvent, override?: any) => {
    e?.preventDefault()
    try {
      await login({
        username,
        password,
        loginDate,
        override
      })
      displayToast('Welcome back!', ToastType.success)
      setShowOverride(false)
    } catch (err: any) {
      const errMessage = authError?.message || err?.message || err?.error?.message || err?.toString() || 'Sorry, Something went wrong.'
      
      if (err?.statusCode === 403 && err?.metadata?.requireOverride) {
        setShowOverride(true)
      } else {
        setError(errMessage)
      }
    }
  }

  const handleOverrideSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit(undefined, {
      username: overrideUsername,
      password: overridePassword
    })
  }

  const handleDatabaseLink = () => {
    try {
      dispatch(setActivePage(POSPages.DATABASE_LINK))
    } catch (error: unknown) {
     displayToast((error as Error).message || 'Sorry, Something went wrong.', ToastType.error)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: '30rem', width: '100%', mx: 'auto', mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom color="primary" fontWeight="bold">
          Sign In
        </Typography>
        {error && <Alert severity="error" color="error" sx={{mb:'1rem'}}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
        <Stack direction={'row'} gap={'2rem'} alignItems={'center'}>
          <TextField
            fullWidth
            label="Business Date"
            type="date"
            margin="normal"
            value={loginDate}
            onChange={(e) => setLoginDate(e.target.value)}
            required
          />
          <Button
            variant="contained"
            type="submit"
            sx={{mt:'7px'}}
           onClick={() => setLoginDate(format(new Date(), 'yyyy-MM-dd'))}
          >
           Today
          </Button>
        </Stack>
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={isLoading}
            sx={{ mt: 2, py: 1.5,width:'100%' }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button onClick={handleDatabaseLink} color="inherit" size="medium" sx={{width:'100%'}}>
            Connections
          </Button>
        </Box>
      </Paper>

      {/* Manager Override Modal */}
      <Dialog open={showOverride} onClose={() => setShowOverride(false)}>
        <form onSubmit={handleOverrideSubmit}>
          <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold' }}>
            Manager Override Required
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" gutterBottom>
              The selected business date ({loginDate}) is already closed. A manager must authorize
              this session.
            </Typography>
            <TextField
              fullWidth
              label="Manager Username"
              margin="dense"
              value={overrideUsername}
              onChange={(e) => setOverrideUsername(e.target.value)}
              required
              autoFocus
            />
            <TextField
              fullWidth
              label="Manager Password"
              type="password"
              margin="dense"
              value={overridePassword}
              onChange={(e) => setOverridePassword(e.target.value)}
              required
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setShowOverride(false)}>Cancel</Button>
            <Button variant="contained" color="error" type="submit" disabled={isLoading}>
              Authorize & Login
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

export default memo(LoginForm)

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import { AppDispatch } from '@shared/types'
import { format } from 'date-fns'
import { memo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
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

  const { login, isLoading } = useAuth()

  const handleSubmit = async (e?: React.FormEvent, override?: any) => {
    e?.preventDefault()
    try {
      await login({
        username,
        password,
        loginDate,
        override
      })
      toast.success('Welcome back!')
      setShowOverride(false)
    } catch (error: any) {
      if (error.statusCode === 403 && error.metadata?.requireOverride) {
        setShowOverride(true)
      } else {
        toast.error(error.message || 'Invalid credentials')
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
      toast.error((error as Error).message || 'Sorry, Something went wrong.')
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%', mx: 'auto', mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom color="primary" fontWeight="bold">
          iPOS Login
        </Typography>
        <form onSubmit={handleSubmit}>
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
          <TextField
            fullWidth
            label="Business Date"
            type="date"
            margin="normal"
            value={loginDate}
            onChange={(e) => setLoginDate(e.target.value)}
            required
            InputLabelProps={{ shrink: true }}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={isLoading}
            sx={{ mt: 3, py: 1.5 }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button onClick={handleDatabaseLink} color="inherit" size="small">
            Database Link
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

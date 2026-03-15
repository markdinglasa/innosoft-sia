import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography
} from '@mui/material'
import { useIpcInvoke } from '@shared/hooks/ipc/useIpcInvoke'

export const Login = () => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  
  // Utilize our new IPC Error handling hook
  const { execute: login, loading } = useIpcInvoke('auth:login')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // The hook automatically toasts errors if success is false
    const user = await login({ userName, password })
    
    if (user) {
      // TODO: Integrate react-auth-kit or Redux store to save the session
      console.log('Login successful!', user)
    }
  }

  return (
    <Box className="flex h-screen w-full items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-8">
          <Box className="mb-6 text-center">
            <Typography variant="h4" className="font-bold text-gray-800">
              Welcome Back
            </Typography>
            <Typography variant="body2" className="text-gray-500 mt-2">
              Please enter your credentials to login to iSIA
            </Typography>
          </Box>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              disabled={loading}
            />
            
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              className="mt-4 h-12 relative"
              disabled={loading || !userName || !password}
            >
              {loading ? (
                <CircularProgress size={24} className="absolute text-white" />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

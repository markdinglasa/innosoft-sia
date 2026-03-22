import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import { memo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { DBConfig, SqlChannel } from '../../../../../../shared/types'

function DatabaseLinkPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<DBConfig>({
    defaultValues: {
      server: '',
      name: '',
      user: '',
      password: '',
      port: 1433
    }
  })

  const onSubmit = async (data: DBConfig) => {
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      
      const payload: DBConfig = {
        ...data,
        port: Number(data.port)
      }

      const response = await window.electron.sql.post(SqlChannel.setConnection, payload)
      
      if (response.IsSomething) {
        setSuccess('Database connection configured successfully!')
      } else {
        setError(response.Message || 'Failed to configure database connection')
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Database Link
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4, fontSize:16}}>
          Configure your Database connection details.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="server"
            control={control}
            rules={{ required: 'Server is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                sx={{fontSize:16}}
                fullWidth
                margin="normal"
                label="Server"
                placeholder="e.g., localhost or 192.168.1.100"
                error={!!errors.server}
                helperText={errors.server?.message}
                disabled={loading}
              />
            )}
          />

          <Controller
            name="name"
            control={control}
            rules={{ required: 'Database name is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                margin="normal"
                label="Database Name"
                placeholder="e.g., INNOSOFT_POS"
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={loading}
              />
            )}
          />

          <Controller
            name="user"
            control={control}
            rules={{ required: 'Username is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                margin="normal"
                label="Username"
                placeholder="e.g., sa"
                error={!!errors.user}
                helperText={errors.user?.message}
                disabled={loading}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{ required: 'Password is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                margin="normal"
                label="Password"
                type="password"
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={loading}
              />
            )}
          />

          <Controller
            name="port"
            control={control}
            rules={{ 
              required: 'Port is required',
              min: { value: 1, message: 'Port must be greater than 0' }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                margin="normal"
                label="Port"
                type="number"
                error={!!errors.port}
                helperText={errors.port?.message}
                disabled={loading}
              />
            )}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            sx={{ mt: 4, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Connection'}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default memo(DatabaseLinkPage)
import { Save } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { memo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { DBConfig } from '../../../../../../shared/types'
import { AccessControl } from "../../../components/utils"
import { useSaveConnection, useTestConnection } from '../api/react-queries/connection.queries'

interface DatabaseLinkFormProps {
  onCancel: () => void
  onSuccess: () => void
}

function DatabaseLinkForm(props: DatabaseLinkFormProps) {
  const { onCancel, onSuccess: onSuccessCb } = props
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const testMutation = useTestConnection()
  const saveMutation = useSaveConnection()

  const loading = saveMutation.isPending
  const testing = testMutation.isPending

  const {
    control,
    handleSubmit,
    reset,
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

  const onTest = (data: DBConfig) => {
    setError('')
    setSuccess('')
    testMutation.mutate(
      { ...data, port: Number(data.port) },
      {
        onSuccess: () => setSuccess('Connection test successful!'),
        onError: (err: any) => setError(err.message || 'Connection test failed')
      }
    )
  }

  const onSubmit = (data: DBConfig) => {
    setError('')
    setSuccess('')
    saveMutation.mutate(
      { ...data, port: Number(data.port) },
      {
        onSuccess: () => {
          setSuccess('Database connection saved successfully!')
          reset({ server: '', name: '', user: '', password: '', port: 1433 })
          onSuccessCb()
        },
        onError: (err: any) => setError(err.message || 'Failed to save database connection')
      }
    )
  }

  return (
    <Container maxWidth="md" sx={{ mt: 2, mb: 2 }}>
      <Stack spacing={4}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: '2rem' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            New Connection
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Configure a new Database connection.
          </Typography>
          <AccessControl condition={!!error}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          </AccessControl>
          <AccessControl condition={!!success}>
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          </AccessControl>
          <Box component="form" noValidate>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Controller
                name="server"
                control={control}
                rules={{ required: 'Server is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    margin="normal"
                    label="Server"
                    placeholder="e.g., localhost"
                    error={!!errors.server}
                    helperText={errors.server?.message}
                    disabled={loading || testing}
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
                    disabled={loading || testing}
                  />
                )}
              />
            </Stack>
            <Stack direction="row" spacing={2}>
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
                    disabled={loading || testing}
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
                    disabled={loading || testing}
                  />
                )}
              />
            </Stack>
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
                  disabled={loading || testing}
                />
              )}
            />
            <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mt: 4 }}>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                disabled={loading || testing}
                onClick={handleSubmit(onTest)}
                sx={{ height: '4rem' }}
              >
                {testing ? <CircularProgress size={24} color="inherit" /> : 'Test Connection'}
              </Button>
              <Stack direction="row" spacing={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="inherit"
                  size="large"
                  disabled={loading || testing}
                  onClick={onCancel}
                  sx={{ height: '4rem' }}
                >
                  Cancel
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading || testing}
                  onClick={handleSubmit(onSubmit)}
                  sx={{ height: '4rem', gap: '1rem', width: 'fit' }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <>
                      <Save sx={{ width: '2rem', height: '2rem' }} />
                      Save Connection
                    </>
                  )}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Stack>
    </Container>
  )
}

export default memo(DatabaseLinkForm)

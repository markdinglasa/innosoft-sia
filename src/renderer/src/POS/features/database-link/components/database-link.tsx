import { Box, Container } from '@mui/material'
import { memo } from 'react'
import { useGetConnections } from '../api/react-queries/connection.queries'
import ConnectionList from './connection-list'

function DatabaseLink() {
  const { data: connections = [], refetch, isLoading: loading } = useGetConnections()

  return (
    <Container
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 2,
        gap: '2rem'
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 'md' }}>
        <ConnectionList connections={connections} onRefresh={refetch} loading={loading} />
      </Box>
    </Container>
  )
}

export default memo(DatabaseLink)

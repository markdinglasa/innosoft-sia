import { Box } from '@mui/material'
import { memo } from 'react'
import PublicLayout from '../../../components/layout/public-layout'
import { useGetConnections } from '../api/react-queries/connection.queries'
import ConnectionList from './connection-list'

function DatabaseLink() {
  const { data: connections = [], refetch, isLoading: loading } = useGetConnections()

  return (
    <PublicLayout>
      <Box sx={{ width: '100%', height: 'fit', maxWidth: 'md', py: 6 }}>
        <ConnectionList connections={connections} onRefresh={refetch} loading={loading} />
      </Box>
    </PublicLayout>
  )
}

export default memo(DatabaseLink)


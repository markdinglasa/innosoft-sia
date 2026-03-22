import {
  Box,
  Container
} from "@mui/material"
import { DBConfig, SqlChannel } from "@shared/types"
import { memo, useCallback, useEffect, useState } from "react"

import ConnectionList from "./connection-list"

function DatabaseLink() {

  const [connections, setConnections] = useState<DBConfig[]>([])


  const fetchConnections = useCallback(async () => {
    const response = await window.electron.sql.get(SqlChannel.getConnections)
    if (response.IsSomething) {
      setConnections(response.Data || [])
    }
  }, [])

  useEffect(() => {
    fetchConnections()
  }, [fetchConnections])


  return (
    <Container sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 2, gap: '2rem' }}>
      <Box sx={{ width: '100%', maxWidth: 'md' }}>
        <ConnectionList 
          connections={connections} 
          onRefresh={fetchConnections} 
          
        />
      </Box>
    </Container>
  )
}

export default memo(DatabaseLink)
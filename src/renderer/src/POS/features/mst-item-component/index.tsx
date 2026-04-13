import { Box, Paper } from '@mui/material'
import React from 'react'
import PageLayout from '../../components/layout/page-layout'
import { ItemComponentForm } from './components/item-component-form'
import { ItemComponentList } from './components/item-component-list'

const ItemComponentHub: React.FC = () => {
  return (
    <PageLayout title="Item Components">
      <Paper
        variant="outlined"
        sx={{
          display: 'flex',
          height: 'calc(100vh - 180px)',
          overflow: 'hidden',
          borderRadius: 2
        }}
      >
        {/* Left panel: Uninventoriable item picker */}
        <Box
          sx={{
            width: { xs: '100%', md: 300, lg: 340 },
            minWidth: { md: 260 },
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden'
          }}
        >
          <ItemComponentList />
        </Box>

        {/* Right panel: BOM form / component list */}
        <Box sx={{ flexGrow: 1, height: '100%', overflow: 'auto' }}>
          <ItemComponentForm />
        </Box>
      </Paper>
    </PageLayout>
  )
}

export default ItemComponentHub


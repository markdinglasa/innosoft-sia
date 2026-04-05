import { Box, Grid, Typography } from '@mui/material'
import React from 'react'
import PageLayout from '../../components/layout/page-layout'
import { CartTable } from './components/cart-pane/cart-table'
import { SummaryPane } from './components/summary-pane/summary-pane'
import { useOrder } from './hooks/use-order'

const OrderHub: React.FC = () => {
  // Initialize calculations effect via custom hook
  useOrder()

  return (
    <PageLayout title="Ordering">
      <Grid container spacing={2} sx={{ height: 'calc(100vh - 160px)', overflow: 'hidden' }}>
        {/* Left: Cart Selection & Modification (Items) */}
        <Grid
          item
          xs={12}
          md={7}
          lg={8}
          sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <CartTable />
          <Box
            sx={{
              p: 1.5,
              display: 'flex',
              gap: 1,
              bgcolor: 'grey.50',
              borderBottom: 1,
              borderLeft: 1,
              borderRight: 1,
              borderColor: 'divider',
              borderRadius: '0 0 8px 8px'
            }}
          >
            <Typography variant="caption">
              Alt + S: Search | F12: Tendering | Alt + C: Clear Cart
            </Typography>
          </Box>
        </Grid>

        {/* Right: Summary & Quick Catalog Access */}
        <Grid
          item
          xs={12}
          md={5}
          lg={4}
          sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}
        >
            <SummaryPane />
        </Grid>
      </Grid>
       {/* this should be a modal on click search item button 
       <CatalogPane /> */}
    </PageLayout>
  )
}

export default OrderHub


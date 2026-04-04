import { Home as HomeIcon, ShoppingCart as OrderIcon } from '@mui/icons-material'
import { Box, Breadcrumbs, Grid, Link, Paper, Typography } from '@mui/material'
import React from 'react'
import PageLayout from '../../components/layout/page-layout'
import { CartTable } from './components/cart-pane/cart-table'
import { CatalogPane } from './components/catalog-pane/catalog-pane'
import { SummaryPane } from './components/summary-pane/summary-pane'
import { useOrder } from './hooks/use-order'

const OrderHub: React.FC = () => {
  // Initialize calculations effect via custom hook
  useOrder()

  return (
    <PageLayout title="Order Entry">
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" sx={{ display: 'flex', alignItems: 'center' }} color="inherit" href="/">
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography sx={{ display: 'flex', alignItems: 'center' }} color="text.primary">
            <OrderIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Active Transaction
          </Typography>
        </Breadcrumbs>
      </Box>

      <Grid container spacing={2} sx={{ height: 'calc(100vh - 160px)', overflow: 'hidden' }}>
        {/* Left: Cart Selection & Modification (Items) */}
        <Grid item xs={12} md={7} lg={8} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper', borderRadius: '8px 8px 0 0', border: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle1" fontWeight="bold">Current Transaction</Typography>
            <Typography variant="caption" color="text.secondary">Terminal: #001 | Shift ID: AUTO</Typography>
          </Box>
          <CartTable />
          <Box sx={{ p: 1.5, display: 'flex', gap: 1, bgcolor: 'grey.50', borderBottom: 1, borderLeft: 1, borderRight: 1, borderColor: 'divider', borderRadius: '0 0 8px 8px' }}>
             <Typography variant="caption">Alt + S: Search | F12: Tendering | Alt + C: Clear Cart</Typography>
          </Box>
        </Grid>

        {/* Right: Summary & Quick Catalog Access */}
        <Grid item xs={12} md={5} lg={4} sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
          <Box sx={{ height: '220px' }}>
            <SummaryPane />
          </Box>
          <Paper variant="outlined" sx={{ flexGrow: 1, p: 2, overflow: 'hidden', borderRadius: 2 }}>
            <CatalogPane />
          </Paper>
        </Grid>
      </Grid>
    </PageLayout>
  )
}

export default OrderHub

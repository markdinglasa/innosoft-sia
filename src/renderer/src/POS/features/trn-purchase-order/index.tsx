import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  InputAdornment,
  Paper,
  TextField
} from '@mui/material'
import React from 'react'
import PageLayout from '../../components/layout/page-layout'
import CatalogParser from './components/catalog-parser'
import PurchaseOrderForm from './components/purchase-order-form'
import { PurchaseOrderList } from './components/purchase-order-list'
import { usePurchaseOrderHubStore } from './store/use-purchase-order-hub-store'

const PurchaseOrderHub: React.FC = () => {
  const { searchKeyword, setSearchKeyword, isFormOpen, setIsFormOpen, setSelectedId } =
    usePurchaseOrderHubStore()
  const handleCreate = () => {
    setSelectedId(null)
    setIsFormOpen(true)
  }
  const [isCatalogOpen, setIsCatalogOpen] = React.useState(false)

  return (
    <PageLayout title="Purchase Order Management">
      <Box sx={{ mb: 3 }}>
        <Paper
          variant="outlined"
          sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', bgcolor: 'background.paper' }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search purchase orders..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 25 }} />
                </InputAdornment>
              )
            }}
          />
          <Button
            variant="outlined"
            onClick={() => setIsCatalogOpen(true)}
            sx={{ px: 3, whiteSpace: 'nowrap' }}
          >
            Import Catalog
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: 25 }} />}
            onClick={handleCreate}
            sx={{ px: 3, whiteSpace: 'nowrap' }}
          >
            New PO
          </Button>
        </Paper>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <PurchaseOrderList />
      </Box>

      {/* Catalog Import Dialog */}
      <Dialog open={isCatalogOpen} onClose={() => setIsCatalogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Supplier Catalog Management</DialogTitle>
        <DialogContent>
          <CatalogParser supplierId={0} onSuccess={() => setIsCatalogOpen(false)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCatalogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Drawer
        anchor="right"
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 600, md: 800 }, borderRadius: '12px 0 0 12px' }
        }}
      >
        <PurchaseOrderForm />
      </Drawer>
    </PageLayout>
  )
}
export default PurchaseOrderHub


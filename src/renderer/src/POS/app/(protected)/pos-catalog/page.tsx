import { Box, Typography } from '@mui/material'
import { SFC } from '@shared/types'

export const POSCatalog: SFC = () => {
  return (
    <Box className="flex h-full w-full flex-col p-6">
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Product Catalog
      </Typography>
      
      {/* Category Tabs Placeholder */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, overflowX: 'auto' }}>
        {['Favorites', 'Beverages', 'Meals', 'Snacks', 'Desserts'].map(cat => (
          <Box key={cat} sx={{ minWidth: 100, p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 2, textAlign: 'center', cursor: 'pointer' }}>
            <Typography variant="button">{cat}</Typography>
          </Box>
        ))}
      </Box>

      {/* Products Grid Placeholder */}
      <Box className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4,5,6,7,8].map(item => (
          <Box key={item} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, minHeight: 150, display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'transform 0.1s', '&:hover': { transform: 'scale(1.02)' } }}>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">Product Image</Typography>
            </Box>
            <Typography variant="h6" sx={{ mt: 2, lineHeight: 1 }}>Item name {item}</Typography>
            <Typography color="secondary" sx={{ fontWeight: 'bold' }}>₱150.00</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default POSCatalog

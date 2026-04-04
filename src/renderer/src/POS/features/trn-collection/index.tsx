import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material'
import { Box, Button, Drawer, InputAdornment, Paper, TextField } from '@mui/material'
import React from 'react'
import PageLayout from '../../components/layout/page-layout'
import { CollectionList } from './components/collection-list'
import { useCollectionHubStore } from './store/use-collection-hub-store'

const CollectionHub: React.FC = () => {
  const { searchKeyword, setSearchKeyword, isFormOpen, setIsFormOpen, setSelectedId } =
    useCollectionHubStore()
  const handleCreate = () => {
    setSelectedId(null)
    setIsFormOpen(true)
  }
  return (
    <PageLayout title="Collection Management">
      <Box sx={{ mb: 3 }}>
        <Paper
          variant="outlined"
          sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', bgcolor: 'background.paper' }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search collections..."
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
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: 25 }} />}
            onClick={handleCreate}
            sx={{ px: 3, whiteSpace: 'nowrap' }}
          >
            New Collection
          </Button>
        </Paper>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <CollectionList />
      </Box>
      <Drawer
        anchor="right"
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 500, md: 600 }, borderRadius: '12px 0 0 12px' }
        }}
      >
        <Box sx={{ p: 3 }}>
          <em>Collection form — coming soon</em>
        </Box>
      </Drawer>
    </PageLayout>
  )
}
export default CollectionHub


import { Extension as ComponentIcon, Search as SearchIcon } from '@mui/icons-material'
import {
  Box,
  Chip,
  Divider,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  TablePagination,
  TextField,
  Typography
} from '@mui/material'
import React from 'react'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useItemComponentHubStore } from '../store/use-item-component-hub-store'

export const ItemComponentList: React.FC = () => {
  const { searchKeyword, setSearchKeyword, selectedParentId, setSelectedParent } =
    useItemComponentHubStore()

  const { useList } = useMasterfile('item')
  const [page, setPage] = React.useState(0)

  // Fetch only uninventoriable items (finished products / BOM parents)
  const { data, isLoading, isError } = useList({
    searchKeyword,
    page: page + 1,
    take: 20,
    filters: [{ isInventory: false }]
  })

  React.useEffect(
    function resetPageOnSearch() {
      setPage(0)
    },
    [searchKeyword]
  )

  const items = (data as any)?.items || []

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRight: 1,
        borderColor: 'divider'
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, bgcolor: 'primary.dark', color: 'white', height: '6.5rem' }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Products
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          Select an item to manage its components
        </Typography>
      </Box>

      {/* Search */}
      <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search finished products..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 20 }} />
              </InputAdornment>
            )
          }}
        />
      </Box>

      {/* List */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {isLoading && (
          <List disablePadding>
            {Array.from({ length: 8 }).map((_, i) => (
              <React.Fragment key={i}>
                <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Skeleton variant="circular" width={32} height={32} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="70%" />
                    <Skeleton variant="text" width="40%" />
                  </Box>
                </Box>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}

        {isError && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="error" variant="body2">
              Failed to load items.
            </Typography>
          </Box>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <ComponentIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No uninventoriable items found.
            </Typography>
            <Typography variant="caption" color="text.disabled">
              Items with &quot;Is Inventory&quot; disabled will appear here.
            </Typography>
          </Box>
        )}

        {!isLoading && !isError && items.length > 0 && (
          <List disablePadding>
            {items.map((item: any, idx: number) => (
              <React.Fragment key={item.id}>
                <ListItemButton
                  selected={selectedParentId === item.id}
                  onClick={() => setSelectedParent(item.id, item.name)}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <ComponentIcon
                      color={selectedParentId === item.id ? 'primary' : 'action'}
                      sx={{ fontSize: 24 }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    secondaryTypographyProps={{ component: 'div' }}
                    primary={
                      <Typography
                        variant="body2"
                        fontWeight={selectedParentId === item.id ? 'bold' : 'medium'}
                        noWrap
                      >
                        {item.name}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 0.25, flexWrap: 'wrap' }}>
                        {item.itemGroup?.name && (
                          <Chip
                            label={item.itemGroup.name}
                            size="small"
                            sx={{ fontSize: 10, height: 18 }}
                          />
                        )}
                        {item.code && (
                          <Typography variant="caption" color="text.disabled">
                            {item.code}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItemButton>
                {idx < items.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>

      {/* Pagination */}
      <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
        <TablePagination
          rowsPerPageOptions={[20]}
          component="div"
          count={(data as any)?.meta?.totalItems || 0}
          rowsPerPage={20}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
        />
      </Box>
    </Box>
  )
}


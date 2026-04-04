import { Search as SearchIcon } from '@mui/icons-material'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import { useMasterfile } from '../../../../hooks/use-masterfile'
import { useOrderHubStore } from '../../store/use-order-hub-store'

export const CatalogPane: React.FC = () => {
  const [search, setSearch] = useState('')
  const { addItem } = useOrderHubStore()
  const { useList } = useMasterfile('item')

  const { data, isLoading } = useList({
    searchKeyword: search,
    take: 24 // Show a manageable grid by default
  })

  const items = (data as any)?.items || []

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Search items or scan barcode..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          )
        }}
      />

      <Box sx={{ flexGrow: 1, overflow: 'auto', pr: 1 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={1.5}>
            {items.map((item: any) => (
              <Grid item xs={6} sm={4} md={3} key={item.id}>
                <Card
                  variant="outlined"
                  sx={{
                    height: '100%',
                    borderRadius: 1.5,
                    transition: 'transform 0.1s',
                    '&:active': { transform: 'scale(0.95)' }
                  }}
                >
                  <CardActionArea onClick={() => addItem(item)} sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 1.5 }}>
                      <Typography variant="body2" fontWeight="bold" noWrap>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" noWrap>
                        {item.itemCode}
                      </Typography>
                      <Box
                        sx={{
                          mt: 1.5,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <Chip
                          label={item.category || 'General'}
                          size="small"
                          sx={{ height: 20, fontSize: 10 }}
                        />
                        <Typography variant="subtitle2" color="primary" fontWeight="bold">
                          {Number(item.price).toFixed(2)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
            {items.length === 0 && (
              <Box sx={{ p: 4, width: '100%', textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No items match your search.
                </Typography>
              </Box>
            )}
          </Grid>
        )}
      </Box>
    </Box>
  )
}


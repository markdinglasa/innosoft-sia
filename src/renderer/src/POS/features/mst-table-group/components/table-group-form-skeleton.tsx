import { Box, Grid, Skeleton } from '@mui/material'

export function TableGroupFormSkeleton() {
  return (
    <Box sx={{ p: 3, flexGrow: 1 }}>
      <Grid container spacing={2}>
        {Array.from({ length: 1 }).map((_, index) => (
          <Grid key={index} item xs={12}>
            <Skeleton variant="rectangular" height={40} width="100%" sx={{ borderRadius: 1 }} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}


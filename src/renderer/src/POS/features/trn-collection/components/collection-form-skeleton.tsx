import { Box, Grid, Skeleton } from '@mui/material'

export function CollectionFormSkeleton() {
  return (
    <Box sx={{ p: 3, flexGrow: 1 }}>
      <Grid container spacing={2}>
        {/* Header Skeleton */}
        <Grid item xs={12}>
          <Skeleton variant="rectangular" height={50} width="100%" sx={{ borderRadius: 1 }} />
        </Grid>

        {/* Basic Info Fields */}
        <Grid item xs={12} sm={6}>
          <Skeleton variant="rectangular" height={40} width="100%" sx={{ borderRadius: 1 }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Skeleton variant="rectangular" height={40} width="100%" sx={{ borderRadius: 1 }} />
        </Grid>

        <Grid item xs={12}>
          <Skeleton variant="rectangular" height={40} width="100%" sx={{ borderRadius: 1 }} />
        </Grid>

        <Grid item xs={12}>
          <Skeleton variant="rectangular" height={40} width="100%" sx={{ borderRadius: 1 }} />
        </Grid>

        {/* Lines / Payments section placeholder */}
        <Grid item xs={12}>
          <Skeleton variant="text" sx={{ fontSize: '1.2rem', my: 2 }} width="40%" />
        </Grid>

        <Grid item xs={12}>
          <Skeleton variant="rectangular" height={100} width="100%" sx={{ borderRadius: 1 }} />
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12} sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Skeleton variant="rectangular" height={45} width="100%" sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" height={45} width="100%" sx={{ borderRadius: 1 }} />
        </Grid>
      </Grid>
    </Box>
  )
}


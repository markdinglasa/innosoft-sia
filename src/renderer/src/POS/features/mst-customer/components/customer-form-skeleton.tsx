import { Box, Divider, Grid, Skeleton } from '@mui/material'

export function CustomerFormSkeleton() {
  return (
    <Box sx={{ p: 3, flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Skeleton variant="rectangular" height={40} width="100%" sx={{ borderRadius: 1 }} />
        </Grid>

        <Grid item xs={6}>
          <Skeleton variant="rectangular" height={40} width="100%" sx={{ borderRadius: 1 }} />
        </Grid>
        <Grid item xs={12}>
          <Skeleton variant="rectangular" height={40} width="100%" sx={{ borderRadius: 1 }} />
        </Grid>
        <Grid item xs={6}>
          <Skeleton variant="rectangular" height={40} width="100%" sx={{ borderRadius: 1 }} />
        </Grid>
        <Grid item xs={6}>
          <Skeleton variant="rectangular" height={40} width="100%" sx={{ borderRadius: 1 }} />
        </Grid>
        <Divider sx={{ width: '100%', my: 2 }} />
        <Grid item xs={6}>
          <Skeleton variant="rectangular" height={40} width="100%" sx={{ borderRadius: 1 }} />
        </Grid>
        <Grid item xs={6}>
          <Skeleton variant="rectangular" height={40} width="100%" sx={{ borderRadius: 1 }} />
        </Grid>
        <Grid item xs={12}>
          <Skeleton variant="rectangular" height={40} width="100%" sx={{ borderRadius: 1 }} />
        </Grid>
        <Grid item xs={6}>
          <Skeleton variant="rectangular" height={40} width="100%" sx={{ borderRadius: 1 }} />
        </Grid>
      </Grid>
    </Box>
  )
}


import { Box, Divider, Grid, Skeleton } from '@mui/material'
import React from 'react'

export const DisbursementFormSkeleton: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>
        {/* Basic Info Section Skeleton */}
        <Grid item xs={6}>
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="rectangular" height={40} />
        </Grid>
        <Grid item xs={6}>
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="rectangular" height={40} />
        </Grid>
        <Grid item xs={12}>
          <Skeleton variant="text" width="30%" height={20} />
          <Skeleton variant="rectangular" height={40} />
        </Grid>
        <Grid item xs={12}>
          <Skeleton variant="text" width="40%" height={20} />
          <Skeleton variant="rectangular" height={40} />
        </Grid>

        <Divider sx={{ width: '100%', my: 3 }} />

        {/* Accounting Section Skeleton */}
        <Grid item xs={12}>
          <Skeleton variant="text" width="50%" height={30} />
        </Grid>
        <Grid item xs={6}>
          <Skeleton variant="rectangular" height={40} />
        </Grid>
        <Grid item xs={6}>
          <Skeleton variant="rectangular" height={40} />
        </Grid>

        <Divider sx={{ width: '100%', my: 3 }} />

        {/* Approvals Section Skeleton */}
        <Grid item xs={4}>
          <Skeleton variant="rectangular" height={40} />
        </Grid>
        <Grid item xs={4}>
          <Skeleton variant="rectangular" height={40} />
        </Grid>
        <Grid item xs={4}>
          <Skeleton variant="rectangular" height={40} />
        </Grid>
      </Grid>
    </Box>
  )
}


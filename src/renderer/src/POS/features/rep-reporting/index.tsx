import React, { useState } from 'react'
import { Box, Paper, Tabs, Tab, Typography, Breadcrumbs, Link, Button, Alert } from '@mui/material'
import { Assessment as ReportIcon, Home as HomeIcon, History as HistoryIcon, Assessment as ReadingIcon } from '@mui/icons-material'
import PageLayout from '../../components/layout/page-layout'
import { useReport } from './hooks/use-report'
import { ShiftReportView } from './components/ShiftReportView'

const ReportingHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0)
  // Logic to get current shift ID from a global store or context would follow.
  // For now, we allow entering a Shift ID for testing manually.
  const [testShiftId, setTestShiftId] = useState<number | null>(1) 
  
  const { useXReading } = useReport()
  const { data, isLoading, error } = useXReading(activeTab === 0 ? testShiftId! : undefined)

  return (
    <PageLayout title="Reporting Hub">
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" sx={{ display: 'flex', alignItems: 'center' }} color="inherit" href="/">
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography sx={{ display: 'flex', alignItems: 'center' }} color="text.primary">
            <ReportIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Reports
          </Typography>
        </Breadcrumbs>
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_e, val) => setActiveTab(val)}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 1 }}
        >
          <Tab icon={<ReadingIcon />} iconPosition="start" label="X-Reading (Live)" />
          <Tab icon={<HistoryIcon />} iconPosition="start" label="Audit Trail" disabled />
          <Tab icon={<ReportIcon />} iconPosition="start" label="Sales Reports" disabled />
        </Tabs>

        <Box sx={{ p: 1, minHeight: 'calc(100vh - 250px)' }}>
          {activeTab === 0 && (
            <Box>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <Typography variant="subtitle1" fontWeight="bold">Current Shift Breakdown</Typography>
                 <Button variant="outlined" size="small" onClick={() => window.print()} disabled={!data}>
                   Print Report
                 </Button>
              </Box>
              <ShiftReportView data={data} isLoading={isLoading} error={error} />
            </Box>
          )}

          {activeTab !== 0 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Alert severity="info">This reporting section is coming soon as part of the Phase 4 rollout.</Alert>
            </Box>
          )}
        </Box>
      </Paper>
    </PageLayout>
  )
}

export default ReportingHub

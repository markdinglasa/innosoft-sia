import { ExpandMore as ExpandMoreIcon, History as HistoryIcon } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import React from 'react'
import { useMasterfile } from '../../../hooks/use-masterfile'

export const AuditTrailList: React.FC = () => {
  const { useList } = useMasterfile('auditTrail')
  const { data, isLoading, isError } = useList({ limit: 50 })

  const auditLogs = (data as any)?.items || []

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (isError) {
    return <Typography color="error">Failed to load audit logs.</Typography>
  }

  const getActionColor = (action: string) => {
    if (action.includes('CREATE')) return 'success'
    if (action.includes('UPDATE')) return 'info'
    if (action.includes('DELETE')) return 'error'
    return 'default'
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <HistoryIcon /> Audit Trail (Recent 50 Actions)
      </Typography>
      
      <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 'calc(100vh - 300px)' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date/Time</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Module</TableCell>
              <TableCell>Record ID</TableCell>
              <TableCell>Data Changes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {auditLogs.map((log: any) => (
              <TableRow key={log.id} hover>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {new Date(log.auditDate).toLocaleString()}
                </TableCell>
                <TableCell>{log.userName || log.userId}</TableCell>
                <TableCell>
                  <Chip 
                    label={log.actionInformation} 
                    size="small" 
                    color={getActionColor(log.actionInformation) as any}
                    variant="outlined"
                    sx={{ fontWeight: 'bold' }}
                  />
                </TableCell>
                <TableCell>{log.tableInformation}</TableCell>
                <TableCell>{log.recordInformation}</TableCell>
                <TableCell>
                  {(log.oldData || log.newData) ? (
                    <Accordion variant="outlined" sx={{ '&:before': { display: 'none' } }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" />} sx={{ minHeight: 0, '.MuiAccordionSummary-content': { my: 0.5 } }}>
                        <Typography variant="caption">View Diffs</Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 1, bgcolor: 'grey.50' }}>
                        <Box component="pre" sx={{ fontSize: '0.65rem', margin: 0, overflow: 'auto', maxWidth: 300 }}>
                          {log.newData ? JSON.stringify(JSON.parse(log.newData), null, 2) : 'N/A'}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ) : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

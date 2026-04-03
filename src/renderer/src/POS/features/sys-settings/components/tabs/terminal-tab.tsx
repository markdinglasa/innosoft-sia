import { Box, Button, Card, CardContent, Divider, FormControlLabel, Grid, Skeleton, Switch, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useUpdateSettings } from '../../api/sys-settings.mutations'
import { useActiveTerminalId, useSysSettings } from '../../api/sys-settings.queries'

export const TerminalTab: React.FC = () => {
  const { data: activeTerminalId } = useActiveTerminalId()
  const { data: settings, isLoading } = useSysSettings(activeTerminalId || null)
  const updateSettings = useUpdateSettings()

  const [formState, setFormState] = useState<any>({})

  useEffect(() => {
    if (settings) {
      setFormState(settings)
    }
  }, [settings])

  const handleToggle = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked ? 1 : 0
    setFormState({ ...formState, [field]: newValue })
  }

  const handleSave = () => {
    updateSettings.mutate(formState)
  }

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
      </Box>
    )
  }

  const settingsGroups = [
    {
      title: 'Printing & Receipts',
      settings: [
        { key: 'isPartialPrint', label: 'Partial Print' },
        { key: 'isEjectDrawerOnPrint', label: 'Eject Drawer on Print' },
        { key: 'isAliasPrinting', label: 'Alias Printing' },
        { key: 'isAutoPrintKitchenReport', label: 'Auto-Print Kitchen Report' }
      ]
    },
    {
      title: 'Inventory & Sales',
      settings: [
        { key: 'isQuickInventory', label: 'Quick Inventory' },
        { key: 'isNegativeInventory', label: 'Negative Inventory' },
        { key: 'isPromptLogin', label: 'Prompt Login' },
        { key: 'isChangePrice', label: 'Allow Price Change' }
      ]
    },
    {
      title: 'Advanced Controls',
      settings: [
        { key: 'isCustomerDisplay', label: 'Enable Customer Display' },
        { key: 'isShowCollectedTab', label: 'Show Collected Tab' },
        { key: 'isAuditLogs', label: 'Enable Audit Logs' }
      ]
    }
  ]

  return (
    <Box>
      {settingsGroups.map((group, gIdx) => (
        <Card key={gIdx} variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
              {group.title}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {group.settings.map((s, sIdx) => (
                <Grid item xs={12} sm={6} key={sIdx}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={!!formState[s.key]} 
                        onChange={handleToggle(s.key)}
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="body2">{s.label}</Typography>}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          onClick={handleSave} 
          disabled={updateSettings.isPending}
          sx={{ minWidth: 120, borderRadius: 2 }}
        >
          {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </Box>
    </Box>
  )
}

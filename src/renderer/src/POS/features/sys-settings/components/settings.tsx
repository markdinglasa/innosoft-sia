import { Box, Button, Tab, Tabs } from '@mui/material'
import { useToggle } from '@shared/hooks'
import React, { memo, useState } from 'react'
import PageLayout from '../../../components/layout/page-layout'
import { AccountTab } from './tabs/account-tab'
import { TerminalTab } from './tabs/terminal-tab'
import { TerminalActivationModal } from './terminal-activation'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

function Settings() {
  const [value, setValue] = useState(0)
  const [openSwitchTerminalDialog, toggleSwitchTerminalDialog] = useToggle(false)
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <PageLayout
      title="Settings"
      actions={
        <Button variant="contained" onClick={toggleSwitchTerminalDialog}>
          Switch Terminal
        </Button>
      }
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="settings tabs">
          <Tab label="Account Settings" id="settings-tab-0" aria-controls="settings-tabpanel-0" />
          <Tab label="Terminal Settings" id="settings-tab-1" aria-controls="settings-tabpanel-1" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <AccountTab />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TerminalTab />
      </TabPanel>
      <TerminalActivationModal open={openSwitchTerminalDialog} close={toggleSwitchTerminalDialog} />
    </PageLayout>
  )
}

export default memo(Settings)


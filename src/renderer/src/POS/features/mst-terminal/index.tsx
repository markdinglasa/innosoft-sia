import { Add as AddIcon, Close, Search as SearchIcon } from '@mui/icons-material'
import { Box, Button, Drawer, IconButton, InputAdornment, Paper, TextField } from '@mui/material'
import { SystemPermissions } from '@shared/constants/permissions'
import { lazy, memo, Suspense } from 'react'
import PageLayout from '../../components/layout/page-layout'
import { useAccessControl } from '../../hooks'
import { TerminalFormSkeleton } from './components/terminal-form-skeleton'
import { TerminalList } from './components/terminal-list'
import { useTerminalHubStore } from './store/use-terminal-hub-store'

const TerminalForm = lazy(() => import('./components/terminal-form'))
function TerminalHub() {
  const { searchKeyword, setSearchKeyword, isFormOpen, setIsFormOpen, setSelectedId } =
    useTerminalHubStore()

  const handleCreate = () => {
    setSelectedId(null)
    setIsFormOpen(true)
  }

  // permissions
  const { hasPermission } = useAccessControl()
  const canAdd = hasPermission(SystemPermissions.TERMINAL_ADD)

  return (
    <PageLayout title="Terminals">
      <Box sx={{ mb: 3 }}>
        <Paper
          variant="outlined"
          sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', bgcolor: 'background.paper' }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search terminals..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 25 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchKeyword('')}
                    hidden={!searchKeyword}
                  >
                    <Close sx={{ fontSize: 25 }} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button
            disabled={!canAdd}
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: 25 }} />}
            onClick={handleCreate}
            sx={{ px: 3, whiteSpace: 'nowrap' }}
          >
            New Terminal
          </Button>
        </Paper>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <TerminalList />
      </Box>
      <Drawer
        anchor="right"
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400, md: 500 }, borderRadius: '12px 0 0 12px' }
        }}
      >
        <Suspense fallback={<TerminalFormSkeleton />}>
          <TerminalForm />
        </Suspense>
      </Drawer>
    </PageLayout>
  )
}
export default memo(TerminalHub)


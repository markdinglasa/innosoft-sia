import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Settings from './settings'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock the sub-components
vi.mock('./tabs/account-tab', () => ({
  AccountTab: () => <div>Account Content</div>
}))
vi.mock('./tabs/terminal-tab', () => ({
  TerminalTab: () => <div>Terminal Content</div>
}))

// Mock the queries (just in case they are needed for layout, though here the sub-components are mocked)
vi.mock('../api/sys-settings.queries', () => ({
  useActiveTerminalId: vi.fn(() => ({ data: 1, isLoading: false })),
  useSysSettings: vi.fn(() => ({ data: { id: 1, terminalId: 1 }, isLoading: false })),
}))

vi.mock('../api/sys-settings.mutations', () => ({
  useUpdateSettings: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}))

const queryClient = new QueryClient()

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('Settings Component', () => {
  it('renders correctly with tabs', () => {
    render(<Settings />, { wrapper })
    expect(screen.getByText('Account Settings')).toBeInTheDocument()
    expect(screen.getByText('Terminal Settings')).toBeInTheDocument()
  })

  it('switches between tabs', () => {
    render(<Settings />, { wrapper })
    const terminalTab = screen.getByText('Terminal Settings')
    fireEvent.click(terminalTab)
    expect(terminalTab).toHaveAttribute('aria-selected', 'true')
    // Verify content reflects terminal tab (mocked above as Terminal Content)
    expect(screen.getByText('Terminal Content')).toBeInTheDocument()
  })
})

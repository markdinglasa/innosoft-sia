import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TerminalTab } from './terminal-tab'

// Mock MUI to avoid heavy styling/layout that might hang jsdom
vi.mock('@mui/material', async () => {
  return {
    Box: ({ children }: any) => <div>{children}</div>,
    Grid: ({ children }: any) => <div>{children}</div>,
    Paper: ({ children }: any) => <div>{children}</div>,
    Card: ({ children }: any) => <div>{children}</div>,
    CardContent: ({ children }: any) => <div>{children}</div>,
    Divider: () => <hr />,
    Typography: ({ children }: any) => <span>{children}</span>,
    Skeleton: () => <div>Loading...</div>,
    Switch: (props: any) => <input type="checkbox" checked={props.checked} onChange={props.onChange} aria-label={props['aria-label']} />,
    Button: (props: any) => <button onClick={props.onClick} disabled={props.disabled}>{props.children}</button>,
    FormControlLabel: ({ control, label }: any) => <label>{control}{label}</label>,
    CircularProgress: () => <div>Loading...</div>,
  }
})

// Mock the queries and mutations
const mockUpdateMutate = vi.fn()
vi.mock('../../api/sys-settings.queries', () => ({
  useActiveTerminalId: vi.fn(() => ({ data: 1, isLoading: false, isError: false })),
  useSysSettings: vi.fn(() => ({ 
    data: { id: 1, terminalId: 1, isPartialPrint: 1 }, 
    isLoading: false,
    isError: false 
  })),
}))

vi.mock('../../api/sys-settings.mutations', () => ({
  useUpdateSettings: vi.fn(() => ({ 
    mutate: mockUpdateMutate, 
    isPending: false,
    isSuccess: false,
    isError: false
  })),
}))

describe('TerminalTab Component', () => {
  it('renders correctly with settings data', () => {
    render(<TerminalTab />)
    expect(screen.getByText('Printing & Receipts')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /Partial Print/i })).toBeChecked()
  })

  it('updates form state when a switch is toggled', () => {
    render(<TerminalTab />)
    const switchEl = screen.getByRole('checkbox', { name: /Partial Print/i })
    fireEvent.click(switchEl)
    expect(switchEl).not.toBeChecked()
  })
})

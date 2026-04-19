import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useSelector } from 'react-redux'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useMasterfile } from '../../../../hooks/use-masterfile'
import { useAuth } from '../../../authentication/hooks/use-auth'
import { useDisbursementHubStore } from '../../store/use-disbursement-hub-store'
import DisbursementForm from '../disbursement-form'

// Mock dependencies
vi.mock('../../store/use-disbursement-hub-store', () => ({
  useDisbursementHubStore: vi.fn()
}))

vi.mock('../../../../hooks/use-masterfile', () => ({
  useMasterfile: vi.fn()
}))

vi.mock('@pos/features/authentication/hooks/use-auth', () => ({
  useAuth: vi.fn()
}))

vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn()
}))

// Robust TextField mock that handles both regular inputs and select
vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material')
  return {
    ...actual,
    TextField: (props: any) => {
      const { select, label, helperText, error, children, ...rest } = props
      const id = rest.id || rest.name
      if (select) {
        return (
          <div>
            <label htmlFor={id}>{label}</label>
            <select
              {...rest}
              id={id}
              data-testid={`select-${rest.name}`}
              onChange={(e) => rest.onChange && rest.onChange(e.target.value)}
            >
              <option value="">Select...</option>
              {children}
            </select>
            {error && <span data-testid="error-message">{helperText}</span>}
          </div>
        )
      }
      return (
        <div>
          <label htmlFor={id}>{label}</label>
          <input
            {...rest}
            id={id}
            data-testid={`input-${rest.name}`}
            onChange={(e) => {
              if (rest.onChange) {
                // Handle both event and value for compatibility
                if (typeof e.target.value === 'string') rest.onChange(e)
              }
            }}
          />
          {error && <span data-testid="error-message">{helperText}</span>}
        </div>
      )
    },
    MenuItem: (props: any) => (
      <option {...props} value={props.value}>
        {props.children}
      </option>
    )
  }
})

vi.mock('@shared/utils', () => ({
  displayToast: vi.fn(),
  formatCurrency: (v: number) => `₱${v.toFixed(2)}`
}))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false }
  }
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('DisbursementForm', () => {
  const mockMutateAsync = vi.fn().mockResolvedValue({ success: true, data: { id: 1 } })

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAuth as any).mockReturnValue({
      user: { id: 1, name: 'Admin User' },
      isAuthenticated: true
    })
    ;(useSelector as any).mockImplementation((callback) =>
      callback({
        POS: {
          manager: {
            activeTerminal: { id: 1 },
            activeBranch: { id: 1 }
          }
        }
      })
    )
    ;(useDisbursementHubStore as any).mockReturnValue({
      selectedId: null,
      setSelectedId: vi.fn(),
      setIsFormOpen: vi.fn(),
      denominations: {},
      setDenominations: vi.fn()
    })
    ;(useMasterfile as any).mockReturnValue({
      useGet: vi.fn().mockReturnValue({ data: null, isLoading: false }),
      useSaveMutation: vi.fn().mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: false,
        isError: false
      }),
      useLookup: vi.fn().mockImplementation((type) => {
        if (type === 'user')
          return {
            data: [
              { id: 1, name: 'User 1' },
              { id: 2, name: 'User 2' },
              { id: 3, name: 'User 3' }
            ]
          }
        if (type === 'payType')
          return {
            data: [
              { id: 1, name: 'CASH' },
              { id: 2, name: 'CHECK' }
            ]
          }
        if (type === 'account') return { data: [{ id: 1, name: 'Travel Expense', code: '5001' }] }
        return { data: [] }
      })
    })
  })

  it('renders and auto-fills Prepared By', async () => {
    render(<DisbursementForm />, { wrapper })
    await waitFor(() => {
      const select = screen.getByTestId('select-preparedBy') as HTMLSelectElement
      expect(select.value).toBe('1')
    })
  })

  it('submits successfully when valid data is provided', async () => {
    render(<DisbursementForm />, { wrapper })

    fireEvent.change(screen.getByTestId('input-disbursementDate'), {
      target: { value: '2026-04-19' }
    })
    fireEvent.change(screen.getByTestId('input-payee'), { target: { value: 'Test Payee' } })
    fireEvent.change(screen.getByTestId('input-amount'), { target: { value: '1000' } })

    fireEvent.change(screen.getByTestId('select-payTypeId'), { target: { value: '1' } })
    fireEvent.change(screen.getByTestId('select-accountId'), { target: { value: '1' } })
    fireEvent.change(screen.getByTestId('select-preparedBy'), { target: { value: '1' } })
    fireEvent.change(screen.getByTestId('select-checkedBy'), { target: { value: '2' } })
    fireEvent.change(screen.getByTestId('select-approvedBy'), { target: { value: '3' } })

    fireEvent.click(screen.getByRole('button', { name: /Save Disbursement/i }))

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled()
    })
  })

  it('validates unique approvers', async () => {
    render(<DisbursementForm />, { wrapper })

    fireEvent.change(screen.getByTestId('input-payee'), { target: { value: 'Test' } })
    fireEvent.change(screen.getByTestId('input-amount'), { target: { value: '100' } })

    fireEvent.change(screen.getByTestId('select-payTypeId'), { target: { value: '1' } })
    fireEvent.change(screen.getByTestId('select-accountId'), { target: { value: '1' } })
    fireEvent.change(screen.getByTestId('select-preparedBy'), { target: { value: '1' } })
    fireEvent.change(screen.getByTestId('select-checkedBy'), { target: { value: '1' } })
    fireEvent.change(screen.getByTestId('select-approvedBy'), { target: { value: '1' } })

    fireEvent.click(screen.getByRole('button', { name: /Save Disbursement/i }))

    await waitFor(() => {
      expect(screen.getByText(/Approval users must be different/i)).toBeInTheDocument()
    })
  })
})


import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useMasterfile } from '../../../../hooks/use-masterfile'
import { useDisbursementHubStore } from '../../store/use-disbursement-hub-store'
import DisbursementForm from '../disbursement-form'

// Mock dependencies
vi.mock('../../store/use-disbursement-hub-store', () => ({
  useDisbursementHubStore: vi.fn()
}))

vi.mock('../../../../hooks/use-masterfile', () => ({
  useMasterfile: vi.fn()
}))

vi.mock('@shared/utils', () => ({
  displayToast: vi.fn(),
  formatCurrency: (v: number) => `₱${v.toFixed(2)}`
}))

vi.mock('@shared/types', () => ({
  ToastType: { error: 'error', success: 'success' },
  IpcChannel: { mstList: 'mst-list' }
}))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('DisbursementForm', () => {
  const mockSetIsFormOpen = vi.fn()
  const mockMutateAsync = vi.fn().mockResolvedValue({ success: true, data: { id: 1 } })

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useDisbursementHubStore as any).mockReturnValue({
      selectedId: null,
      setSelectedId: vi.fn(),
      setIsFormOpen: mockSetIsFormOpen,
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

  it('renders correctly', () => {
    render(<DisbursementForm />, { wrapper })
    expect(screen.getByText(/New Disbursement/i)).toBeInTheDocument()
  })

  it('submits successfully when valid data is provided', async () => {
    const { container } = render(<DisbursementForm />, { wrapper })

    // Fill standard fields
    fireEvent.input(screen.getByLabelText(/Date/i), { target: { value: '2026-04-19' } })
    fireEvent.input(screen.getByLabelText(/Payee Name/i), { target: { value: 'Test Payee' } })
    fireEvent.input(screen.getByLabelText(/Amount/i), { target: { value: '1000' } })

    // For selects, since MUI's hidden input is tricky, we'll try to trigger its change event directly
    // and also ensure we're matching the name exactly.
    const selects = {
      payTypeId: '2',
      expenseAccountId: '1',
      preparedById: '1',
      checkedById: '2',
      approvedById: '3'
    }

    Object.entries(selects).forEach(([name, value]) => {
      const input = container.querySelector(`input[name="${name}"]`)
      if (input) {
        fireEvent.change(input, { target: { value } })
        fireEvent.input(input, { target: { value } })
      }
    })

    const saveButton = screen.getByRole('button', { name: /Save Disbursement/i })
    fireEvent.click(saveButton)

    await waitFor(
      () => {
        expect(mockMutateAsync).toHaveBeenCalled()
      },
      { timeout: 3000 }
    )
  })

  it('validates unique approvers', async () => {
    const { container } = render(<DisbursementForm />, { wrapper })

    fireEvent.input(screen.getByLabelText(/Payee Name/i), { target: { value: 'Test' } })
    fireEvent.input(screen.getByLabelText(/Amount/i), { target: { value: '100' } })

    const selects = {
      preparedById: '1',
      checkedById: '1',
      approvedById: '1'
    }

    Object.entries(selects).forEach(([name, value]) => {
      const input = container.querySelector(`input[name="${name}"]`)
      if (input) fireEvent.change(input, { target: { value } })
    })

    const saveButton = screen.getByRole('button', { name: /Save Disbursement/i })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText(/Approval users must be different/i)).toBeInTheDocument()
    })
  })
})


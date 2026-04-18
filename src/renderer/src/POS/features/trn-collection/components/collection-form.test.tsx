import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useCollectionHubStore } from '../store/use-collection-hub-store'
import CollectionForm from './collection-form'

// Mock dependencies
vi.mock('../store/use-collection-hub-store', () => ({
  useCollectionHubStore: vi.fn()
}))

vi.mock('../../../hooks/use-masterfile', () => ({
  useMasterfile: vi.fn()
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

describe('CollectionForm Logic Verification', () => {
  const mockSetIsFormOpen = vi.fn()
  const mockMutateAsync = vi.fn().mockResolvedValue({ success: true })
  const mockLookupData = {
    period: [{ id: 1, name: 'April 2026' }],
    customer: [{ id: 1, name: 'Walk-in Customer' }],
    terminal: [{ id: 1, name: 'POS-01' }],
    payType: [{ id: 1, name: 'Cash' }, { id: 2, name: 'Check' }],
    account: [{ id: 1, code: '101', name: 'Cash in Hand' }]
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useCollectionHubStore as any).mockReturnValue({
      selectedId: null,
      setIsFormOpen: mockSetIsFormOpen,
      setSelectedId: vi.fn()
    })
    ;(useMasterfile as any).mockReturnValue({
      useGet: vi.fn().mockReturnValue({ data: null, isLoading: false }),
      useSaveMutation: vi.fn().mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: false
      }),
      useLookup: vi.fn().mockImplementation((type) => ({
        data: mockLookupData[type] || [],
        isLoading: false
      }))
    })
  })

  it('calculates total amount correctly when lines are added', async () => {
    render(<CollectionForm />, { wrapper })

    // Add a payment line
    const addButton = screen.getByText('Add Payment')
    fireEvent.click(addButton)

    // Wait for the line to appear
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Ref / Check info')).toBeInTheDocument()
    })

    // Find the amount input for the first line
    // Since it's a table, we target the number input
    const amountInput = screen.getByLabelText('') // This might be tricky, let's use display role or type
    const inputs = screen.getAllByRole('spinbutton')
    // Index 0 might be Tender Amount if it's rendered. Let's find by register name if possible or just order.
    // In our implementation, 'amount' is a display h5, 'tenderAmount' is 'spinbutton', line amounts are 'spinbutton'
    
    // Fill first line amount
    fireEvent.change(inputs[0], { target: { value: '100' } })

    // Check Total Amount display
    await waitFor(() => {
      expect(screen.getByText('100.00')).toBeInTheDocument()
    })
  })

  it('calculates change due correctly', async () => {
    render(<CollectionForm />, { wrapper })

    // Add payment line
    fireEvent.click(screen.getByText('Add Payment'))
    const inputs = screen.getAllByRole('spinbutton')
    fireEvent.change(inputs[0], { target: { value: '100' } }) // Line amount

    // Tender Amount input (usually the last spinbutton in our layout)
    const tenderAmountInput = screen.getByLabelText(/Tender Amount/i)
    fireEvent.change(tenderAmountInput, { target: { value: '150' } })

    await waitFor(() => {
      expect(screen.getByText('50.00')).toBeInTheDocument() // Change Due
    })
  })

  it('prevents submission if no payment lines exist', async () => {
    render(<CollectionForm />, { wrapper })

    const saveButton = screen.getByText('Save Collection')
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText('At least one payment line is required')).toBeInTheDocument()
      expect(mockMutateAsync).not.toHaveBeenCalled()
    })
  })

  it('successfully submits valid data', async () => {
    render(<CollectionForm />, { wrapper })

    // Fill header fields
    fireEvent.change(screen.getByLabelText(/Manual OR #/i), { target: { value: 'OR-123' } })
    fireEvent.change(screen.getByLabelText(/Collection #/i), { target: { value: 'COL-001' } })

    // Add line
    fireEvent.click(screen.getByText('Add Payment'))
    const inputs = screen.getAllByRole('spinbutton')
    fireEvent.change(inputs[0], { target: { value: '100' } })

    const saveButton = screen.getByText('Save Collection')
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled()
    })
  })
})

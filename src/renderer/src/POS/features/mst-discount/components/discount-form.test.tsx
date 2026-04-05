import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import DiscountForm from './discount-form'
import { useDiscountHubStore } from '../store/use-discount-hub-store'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock dependencies
vi.mock('../store/use-discount-hub-store', () => ({
  useDiscountHubStore: vi.fn()
}))

vi.mock('../../../hooks/use-masterfile', () => ({
  useMasterfile: vi.fn()
}))

vi.mock('@shared/utils', () => ({
  displayToast: vi.fn(),
}))

vi.mock('@shared/types', () => ({
  ToastType: { error: 'error', success: 'success' }
}))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('DiscountForm TDD', () => {
  const mockSetIsFormOpen = vi.fn()
  const mockSetSelectedId = vi.fn()
  const mockMutateAsync = vi.fn().mockResolvedValue({ success: true })

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useDiscountHubStore as any).mockReturnValue({
      selectedId: null,
      setIsFormOpen: mockSetIsFormOpen,
      setSelectedId: mockSetSelectedId
    })

    ;(useMasterfile as any).mockReturnValue({
      useGet: vi.fn().mockReturnValue({
        data: null,
        isLoading: false
      }),
      useSaveMutation: vi.fn().mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: false,
        isError: false,
        error: null
      })
    })
  })

  it('should render all required fields including new scheduling fields', async () => {
    render(<DiscountForm />, { wrapper })

    expect(screen.getByRole('textbox', { name: /^Discount$/i })).toBeInTheDocument()
    expect(screen.getByRole('spinbutton', { name: /Discount Rate/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/VAT Exempt/i)).toBeInTheDocument()
    
    expect(screen.getByLabelText(/Schedule by Date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Schedule by Time/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Schedule by Day/i)).toBeInTheDocument()
  })

  it('should submit form with all mandatory fields from DTO', async () => {
    render(<DiscountForm />, { wrapper })

    fireEvent.change(screen.getByRole('textbox', { name: /^Discount$/i }), { target: { value: 'Holiday Discount' } })
    fireEvent.change(screen.getByRole('spinbutton', { name: /Discount Rate/i }), { target: { value: '10' } })

    // Open scheduling sections to verify they work
    fireEvent.click(screen.getByLabelText(/Schedule by Date/i))
    
    await waitFor(() => {
        // MD usually renders type="date" and "time" as generic inputs or specialized ones;
        // let's try finding the label
        expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument()
    })

    const form = screen.getByLabelText('discount-form')
    fireEvent.submit(form)

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled()
    })
  })

  it('should pre-populate form and update existing record', async () => {
    const existingDiscount = {
      id: 1,
      name: 'Existing Discount',
      discountRate: 5,
      isVatExempt: true,
      isDateScheduled: false,
      dateStart: new Date(),
      dateEnd: new Date(),
      isTimeScheduled: false,
      timeStart: new Date(),
      timeEnd: new Date(),
      isDayScheduled: false,
      dayMon: false,
      dayTue: false,
      dayWed: false,
      dayThu: false,
      dayFri: false,
      daySat: false,
      daySun: false
    }

    ;(useDiscountHubStore as any).mockReturnValue({
      selectedId: 1,
      setIsFormOpen: mockSetIsFormOpen,
      setSelectedId: mockSetSelectedId,
      searchKeyword: '',
      setSearchKeyword: vi.fn()
    })

    ;(useMasterfile as any).mockReturnValue({
      useGet: vi.fn().mockReturnValue({
        data: existingDiscount,
        isLoading: false
      }),
      useSaveMutation: vi.fn().mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: false
      })
    })

    render(<DiscountForm />, { wrapper })

    await waitFor(() => {
        expect(screen.getByDisplayValue('Existing Discount')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByRole('textbox', { name: /^Discount$/i }), { target: { value: 'Updated Discount' } })
    
    const form = screen.getByLabelText('discount-form')
    fireEvent.submit(form)

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled()
    })
  })
})

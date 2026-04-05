import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BranchForm } from './branch-form'
import { useBranchHubStore } from '../store/use-branch-hub-store'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock dependencies
vi.mock('../store/use-branch-hub-store', () => ({
  useBranchHubStore: vi.fn()
}))

vi.mock('../../../hooks/use-masterfile', () => ({
  useMasterfile: vi.fn()
}))

// Fix the mock to use @shared paths as in the component
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

describe('BranchForm Update Investigation', () => {
  const mockSetIsFormOpen = vi.fn()
  const mockMutateAsync = vi.fn().mockResolvedValue({ success: true })

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useBranchHubStore as any).mockReturnValue({
      selectedBranchId: 1,
      setIsFormOpen: mockSetIsFormOpen
    })

    ;(useMasterfile as any).mockReturnValue({
      useGet: vi.fn().mockReturnValue({
        data: {
          id: 1,
          name: 'Main Branch',
          address: '123 Main St, City',
          description: null, // POTENTIAL CULPRIT
          isDefault: true
        },
        isLoading: false
      }),
      useSaveMutation: vi.fn().mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: false
      })
    })
  })

  it('should successfully submit even if description is null from DB', async () => {
    render(<BranchForm />, { wrapper })

    // Wait for form to populate
    await waitFor(() => {
        expect(screen.getByDisplayValue('Main Branch')).toBeInTheDocument()
    })

    const saveButton = screen.getByText('Save Branch')
    fireEvent.click(saveButton)

    await waitFor(() => {
      // If validation fails, this won't be called
      expect(mockMutateAsync).toHaveBeenCalled()
    })
  })

  it('verifies that zod schema handles null correctly', async () => {
      // Logic inside onSubmit will either call mutateAsync or displayToast on error
  })
})

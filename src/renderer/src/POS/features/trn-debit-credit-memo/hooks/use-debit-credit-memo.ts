import { TransactionIpcChannel } from '@shared/types'
import { PaginationOptionsDto } from '@shared/types/pagination'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const { ipcRenderer } = globalThis.electron

export const useDebitCreditMemos = (
  options?: PaginationOptionsDto & { searchKeyword?: string; take?: number }
) => {
  return useQuery({
    queryKey: ['debit-credit-memos', options],
    queryFn: () => ipcRenderer.invoke(TransactionIpcChannel.DEBIT_CREDIT_MEMO_LIST, options)
  })
}

export const useDebitCreditMemo = (id: number | null) => {
  return useQuery({
    queryKey: ['debit-credit-memo', id],
    queryFn: () => ipcRenderer.invoke(TransactionIpcChannel.DEBIT_CREDIT_MEMO_GET, id),
    enabled: !!id
  })
}

export const useCreateDebitCreditMemo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (variables: { payload: any; userId: number }) =>
      ipcRenderer.invoke(TransactionIpcChannel.DEBIT_CREDIT_MEMO_CREATE, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debit-credit-memos'] })
    }
  })
}

export const useUpdateDebitCreditMemo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (variables: { id: number; payload: any; userId: number }) =>
      ipcRenderer.invoke(TransactionIpcChannel.DEBIT_CREDIT_MEMO_UPDATE, variables),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['debit-credit-memos'] })
      queryClient.invalidateQueries({ queryKey: ['debit-credit-memo', variables.id] })
    }
  })
}

export const useDeleteDebitCreditMemo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) =>
      ipcRenderer.invoke(TransactionIpcChannel.DEBIT_CREDIT_MEMO_DELETE, { id, userId: 1 }), // Placeholder userId
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debit-credit-memos'] })
    }
  })
}

export const useProcessIso8583Memo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (variables: { message: any; userId: number }) =>
      ipcRenderer.invoke(TransactionIpcChannel.DEBIT_CREDIT_MEMO_PROCESS_ISO, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debit-credit-memos'] })
    }
  })
}


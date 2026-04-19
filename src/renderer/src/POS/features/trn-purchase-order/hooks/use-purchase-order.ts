import { TransactionIpcChannel } from '@shared/types'
import { PaginationOptionsDto } from '@shared/types/pagination'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const { ipcRenderer } = globalThis.electron

export const usePurchaseOrders = (options?: PaginationOptionsDto) => {
  return useQuery({
    queryKey: ['purchase-orders', options],
    queryFn: () => ipcRenderer.invoke(TransactionIpcChannel.PURCHASE_ORDER_LIST, options)
  })
}

export const usePurchaseOrder = (id: number | null) => {
  return useQuery({
    queryKey: ['purchase-order', id],
    queryFn: () => ipcRenderer.invoke(TransactionIpcChannel.PURCHASE_ORDER_GET, id),
    enabled: !!id
  })
}

export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (variables: { payload: any; userId: number }) =>
      ipcRenderer.invoke(TransactionIpcChannel.PURCHASE_ORDER_CREATE, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] })
    }
  })
}

export const useUpdatePurchaseOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (variables: { id: number; payload: any; userId: number }) =>
      ipcRenderer.invoke(TransactionIpcChannel.PURCHASE_ORDER_UPDATE, variables),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] })
      queryClient.invalidateQueries({ queryKey: ['purchase-order', variables.id] })
    }
  })
}

export const useSubmitPurchaseOrderApproval = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) =>
      ipcRenderer.invoke(TransactionIpcChannel.PURCHASE_ORDER_SUBMIT_APPROVAL, { id }),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] })
      queryClient.invalidateQueries({ queryKey: ['purchase-order', id] })
    }
  })
}

export const useApprovePurchaseOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (variables: { id: number; userId: number; comments?: string }) =>
      ipcRenderer.invoke(TransactionIpcChannel.PURCHASE_ORDER_APPROVE, variables),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] })
      queryClient.invalidateQueries({ queryKey: ['purchase-order', variables.id] })
    }
  })
}

export const useRejectPurchaseOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (variables: { id: number; userId: number; reason: string }) =>
      ipcRenderer.invoke(TransactionIpcChannel.PURCHASE_ORDER_REJECT, variables),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] })
      queryClient.invalidateQueries({ queryKey: ['purchase-order', variables.id] })
    }
  })
}

export const useDeletePurchaseOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) =>
      ipcRenderer.invoke(TransactionIpcChannel.PURCHASE_ORDER_DELETE, { id, userId: 1 }), // Placeholder userId
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] })
    }
  })
}

export const useReceivePurchaseOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (variables: { id: number; userId: number; data: any }) =>
      ipcRenderer.invoke(TransactionIpcChannel.PURCHASE_ORDER_RECEIVE, variables),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] })
      queryClient.invalidateQueries({ queryKey: ['purchase-order', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['stock-ins'] }) // Inventory update
    }
  })
}

export const useSupplierCatalog = (supplierId: number) => {
  return useQuery({
    queryKey: ['supplier-catalog', supplierId],
    queryFn: () => ipcRenderer.invoke(TransactionIpcChannel.SUPPLIER_CATALOG_LIST, { supplierId }),
    enabled: !!supplierId
  })
}

export const useImportSupplierCatalog = () => {
  const queryClient = useQueryClient()
  return useMutation<
    { imported: number; skipped: number },
    Error,
    { supplierId: number; csvContent: string }
  >({
    mutationFn: (variables) =>
      ipcRenderer.invoke(TransactionIpcChannel.SUPPLIER_CATALOG_IMPORT, variables),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['supplier-catalog', variables.supplierId] })
    }
  })
}


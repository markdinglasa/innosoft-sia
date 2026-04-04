import { IpcChannel } from '@shared/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { calculateOrderSummary } from '../../../../../../shared/utils/calculation-engine'
import { useOrderHubStore } from '../store/use-order-hub-store'

export const useOrder = () => {
  const queryClient = useQueryClient()
  const { cart, selectedCustomerId, setSummary } = useOrderHubStore()

  /**
   * Effect to auto-calculate totals whenever the cart or customer changes.
   * Ensures UI summary is always in sync with deterministic engine logic.
   */
  useEffect(() => {
    const summary = calculateOrderSummary(cart as any)
    setSummary({
      subtotal: summary.subtotal,
      totalTax: summary.totalTax,
      totalDiscount: summary.totalDiscount,
      totalAmount: summary.totalAmount
    })
  }, [cart, selectedCustomerId, setSummary])

  /**
   * List recent orders.
   */
  const useList = (params?: any) => useQuery({
    queryKey: ['orders', params],
    queryFn: async () => {
      const response = await (window as any).electron.ipc.invoke(IpcChannel.orderList, params)
      if (!response.success) throw new Error(response.message)
      return response.data
    }
  })

  /**
   * Mutation to save (finalize) an order.
   */
  const useSaveMutation = () => useMutation({
    mutationFn: async (orderData: any) => {
      const response = await (window as any).electron.ipc.invoke(IpcChannel.orderSave, orderData)
      if (!response.success) throw new Error(response.message)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    }
  })

  return { useList, useSaveMutation }
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IpcChannel } from "@shared/types";

/**
 * Generic hook for interacting with Masterfile Hub services.
 * Features:
 * - Centralized Query Key management
 * - Automatic cache invalidation on mutations
 * - Dynamic service routing via IPC
 * 
 * @param serviceName The unique name of the masterfile service (e.g., 'item', 'user', 'branch')
 */
export const useMasterfile = (serviceName: string) => {
  const queryClient = useQueryClient();
  const baseKey = ['masterfile', serviceName];

  /**
   * Fetch a list of entities with optional search and pagination.
   */
  const useList = (options?: { 
    page?: number; 
    take?: number; 
    searchKeyword?: string; 
    status?: string[];
  }) => {
    return useQuery({
      queryKey: [...baseKey, 'list', options],
      queryFn: async () => {
        const response = await (window as any).electron.ipc.invoke(IpcChannel.mstList, { serviceName, options });
        if (!response.success) throw new Error(response.message);
        return response.data;
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  /**
   * Fetch a single entity by ID.
   */
  const useGet = (id: any, options?: any) => {
    return useQuery({
      queryKey: [...baseKey, 'get', id, options],
      queryFn: async () => {
        const response = await (window as any).electron.ipc.invoke(IpcChannel.mstGet, { serviceName, id, options });
        if (!response.success) throw new Error(response.message);
        return response.data;
      },
      enabled: !!id,
    });
  };

  /**
   * Save or Update an entity (supports Parent-Child sync).
   */
  const useSaveMutation = () => {
    return useMutation({
      mutationFn: async (payload: any) => {
        const response = await (window as any).electron.ipc.invoke(IpcChannel.mstSave, { serviceName, payload });
        if (!response.success) throw new Error(response.message);
        return response;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: baseKey });
      },
    });
  };

  /**
   * Delete an entity by ID.
   */
  const useDeleteMutation = () => {
    return useMutation({
      mutationFn: async (id: any) => {
        const response = await (window as any).electron.ipc.invoke(IpcChannel.mstDelete, { serviceName, id });
        if (!response.success) throw new Error(response.message);
        return response;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: baseKey });
      },
    });
  };

  /**
   * Fetch a minimal list of entities for lookups/dropdowns.
   * Uses more aggressive caching for static data.
   */
  const useLookup = (options?: any) => {
    return useQuery({
      queryKey: [...baseKey, 'lookup', options],
      queryFn: async () => {
        const response = await (window as any).electron.ipc.invoke(IpcChannel.mstList, { 
          serviceName, 
          options: { ...options, limit: 1000 } // Larger limit for lookups
        });
        if (!response.success) throw new Error(response.message);
        return response.data.items || [];
      },
      staleTime: 1000 * 60 * 10, // 10 minutes (Lookups are relatively static)
    });
  };

  return {
    useList,
    useGet,
    useLookup,
    useSaveMutation,
    useDeleteMutation
  };
};


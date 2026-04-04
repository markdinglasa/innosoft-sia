import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IpcChannel } from "@shared/types";

export const useShift = (userId?: number, terminalId?: number) => {
  const queryClient = useQueryClient();
  const queryKey = ['shift', userId, terminalId];

  /**
   * Status of the current shift.
   */
  const useStatus = () => useQuery({
    queryKey,
    queryFn: async () => {
      if (!userId || !terminalId) return null;
      const response = await (window as any).electron.ipc.invoke(IpcChannel.shiftStatus, { userId, terminalId });
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: !!userId && !!terminalId,
  });

  /**
   * Opens a new shift.
   */
  const useOpenMutation = () => useMutation({
    mutationFn: async (startingCash: number) => {
      const response = await (window as any).electron.ipc.invoke(IpcChannel.shiftOpen, { 
        userId, 
        terminalId, 
        startingCash 
      });
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  /**
   * Closes an active shift.
   */
  const useCloseMutation = () => useMutation({
    mutationFn: async ({ shiftId, endingCash, remarks }: { shiftId: number, endingCash: number, remarks?: string }) => {
      const response = await (window as any).electron.ipc.invoke(IpcChannel.shiftClose, { 
        shiftId, 
        endingCash, 
        remarks 
      });
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return { useStatus, useOpenMutation, useCloseMutation };
};

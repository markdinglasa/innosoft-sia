import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, logout, verifySession } from "./auth-api";
import { authKeys } from "./query-keys";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(authKeys.session(), null);
    },
  });
};

export const useSessionQuery = () => {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: verifySession,
    staleTime: Infinity,
  });
};

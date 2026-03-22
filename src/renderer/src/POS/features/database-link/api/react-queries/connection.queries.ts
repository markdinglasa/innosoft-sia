import { DBConfig, SqlChannel } from '@shared/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { setActivePage } from '../../../../store/manager'
import { POSPages } from '../../../../types/pages'
import { connectionKeys } from '../query-keys/connection.keys'

export const useGetConnections = () => {
  return useQuery({
    queryKey: connectionKeys.lists(),
    queryFn: async () => {
      const response = await window.electron.sql.get(SqlChannel.getConnections)
      if (response.IsSomething) {
        return response.Data as DBConfig[]
      }
      throw new Error(response.Message || 'Failed to fetch connections')
    }
  })
}

export const useActivateConnection = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await window.electron.sql.post(SqlChannel.activateConnection, id)
      if (!response.IsSomething)
        throw new Error(response.Message || 'Failed to activate connection')
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectionKeys.lists() })
    }
  })
}

export const useDeleteConnection = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await window.electron.sql.post(SqlChannel.deleteConnection, id)
      if (!response.IsSomething) throw new Error(response.Message || 'Failed to delete connection')
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectionKeys.lists() })
    }
  })
}

export const useTestConnection = () => {
  return useMutation({
    mutationFn: async (data: DBConfig) => {
      const response = await window.electron.sql.post(SqlChannel.testConnection, data)
      if (!response.IsSomething) throw new Error(response.Message || 'Connection test failed')
      return response
    }
  })
}

export const useSaveConnection = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: DBConfig) => {
      const response = await window.electron.sql.post(SqlChannel.saveConnection, data)
      if (!response.IsSomething)
        throw new Error(response.Message || 'Failed to save database connection')
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectionKeys.lists() })
    }
  })
}

export const useSyncSchema = () => {
  const dispatch = useDispatch()
  return useMutation({
    mutationFn: async () => {
      const response = await window.electron.sql.post(SqlChannel.syncSchema)
      if (!response.IsSomething)
        throw new Error(response.Message || 'Failed to synchronize database schema')
      return response
    },
    onSuccess: () => {
      dispatch(setActivePage(POSPages.LOGIN))
    }
  })
}


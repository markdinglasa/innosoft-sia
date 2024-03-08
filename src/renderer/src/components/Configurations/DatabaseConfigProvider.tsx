import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiMessage } from './LicenseKeyProvider'
const DatabaseConfigContext = createContext({} as DatabaseConfigProviderValue)

export function useDatabaseConfig() {
  return useContext<DatabaseConfigProviderValue>(DatabaseConfigContext)
}

export interface DatabaseConfigProviderProps {
  children: string | any | React.ReactElement | React.ReactNode
}

export interface DatabaseConfigProviderValue {
  checkDatabaseConfig: () => Promise<apiMessage>
  handleDatabaseConfig: (config: any) => Promise<apiMessage>
}

export const DatabaseConfigProvider = ({ children }: DatabaseConfigProviderProps) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const checkDatabaseConfig = useCallback(async (): Promise<apiMessage> => {
    const connection = await window.api.get('get-connected')
    if (!connection) {
      return {
        error: true,
        success: false,
        errorMessage: 'Database not connected'
      }
    }

    return {
      error: false,
      success: true,
      errorMessage: ''
    }
  }, [])

  const handleDatabaseConfig = async (config: any): Promise<apiMessage> => {
    if (!config) {
      return {
        error: true,
        success: false,
        errorMessage: 'All fields are required.'
      }
    }
    try {
      const response = await window.api.post('set-connection', config)
      if (!response.connection) {
        return {
          error: true,
          success: false,
          errorMessage: `${response.message}`
        }
      }
      return {
        error: false,
        success: true,
        errorMessage: 'Database connected'
      }
    } catch (error) {
      // console.error('Error activating license key:', error);
      return {
        error: true,
        success: false,
        errorMessage: 'Something went wrong'
      }
    }
  }

  useEffect(() => {
    const call = async () => {
      const response = await checkDatabaseConfig()
      if (response.error) {
        console.log(response.errorMessage)
        navigate('/')
      }
      setTimeout(() => {
        navigate('/license')
      }, 3000)
    }

    call()
  }, [checkDatabaseConfig, navigate])

  const value = {
    checkDatabaseConfig,
    handleDatabaseConfig
  }

  return <DatabaseConfigContext.Provider value={value}>{children}</DatabaseConfigContext.Provider>
}

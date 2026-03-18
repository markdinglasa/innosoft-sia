"use client"

import { memo, ReactNode } from "react"
import { Provider as ReduxProvider } from "react-redux"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import store from "@shared/store" // Assuming this is the main store

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
})

interface ProvidersProps {
  children: ReactNode
}

function Providers({ children }: ProvidersProps) {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        {/* Add authentication, theme, and other providers here */}
        {children}
      </QueryClientProvider>
    </ReduxProvider>
  )
}

export default memo(Providers)

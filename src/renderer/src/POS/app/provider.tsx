"use client"

import store from "@shared/store"; // Assuming this is the main store
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { memo, ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Provider as ReduxProvider } from "react-redux";
import ErrorPage from "./error";

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
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          {/* Add authentication, theme, and other providers here */}
          {children}
        </QueryClientProvider>
      </ReduxProvider>
    </ErrorBoundary>
  )
}

export default memo(Providers)

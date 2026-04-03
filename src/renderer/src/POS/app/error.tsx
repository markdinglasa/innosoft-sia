"use client"

import { useEffect, memo } from "react"
import { FallbackProps } from "react-error-boundary"

function ErrorPage({ error, resetErrorBoundary }: FallbackProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  const errorMessage = error instanceof Error ? error.message : String(error)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h2 className="mb-4 text-2xl font-bold text-red-600">Something went wrong!</h2>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        {errorMessage || "An unexpected error occurred."}
      </p>
      {resetErrorBoundary && (
        <button
          onClick={() => resetErrorBoundary()}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  )
}

export default memo(ErrorPage)

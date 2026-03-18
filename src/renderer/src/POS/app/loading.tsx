import { memo } from "react"

function LoadingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  )
}

export default memo(LoadingPage)

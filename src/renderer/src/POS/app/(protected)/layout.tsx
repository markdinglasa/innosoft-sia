"use client"

import { POSLayout } from "@/POS/components/layout/pos-layout"
import { memo } from "react"
// import { useAuth } from "@/features/authentication/hooks/useAuth" // Placeholder for auth hook
// import { redirect } from "next/navigation" // Or whatever routing logic is used

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  // const { isAuthenticated, isLoading } = useAuth()

  // if (isLoading) return <LoadingPage /> // Assuming LoadingPage is accessible
  
  // if (!isAuthenticated) {
  //   redirect("/login")
  //   return null
  // }

  return (
    <POSLayout>
      {children}
    </POSLayout>
  )
}

export default memo(ProtectedLayout)

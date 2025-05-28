// frontend/app/page.tsx

"use client" // Enables client-side rendering for this component

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import Dashboard from "@/components/dashboard"
import AuthForms from "@/components/auth-forms"

// Top-level wrapper that provides authentication context
export default function Home() {
  return (
    <AuthProvider>
      <HomePage />
    </AuthProvider>
  )
}

// Core homepage logic — renders either the dashboard or auth forms
function HomePage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  // Revalidates router state when auth status changes
  useEffect(() => {
    if (!loading) {
      router.refresh()
    }
  }, [isAuthenticated, loading, router])

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Show dashboard if authenticated, otherwise show login/register forms
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {isAuthenticated ? <Dashboard /> : <AuthForms />}
    </main>
  )
}

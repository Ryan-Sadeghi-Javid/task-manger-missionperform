// frontend/lib/auth-context.ts

"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { api } from "@/lib/api"

// Define the shape of a user object
interface User {
  id: string
  username: string
}

// Define the shape of the authentication context
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
  error: string | null
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// AuthProvider wraps the app and provides authentication state and functions
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null) // currently logged in user
  const [loading, setLoading] = useState(true) // loading state for async actions
  const [error, setError] = useState<string | null>(null) // error message from auth actions

  // On initial load, check if a token exists and set user state
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      api.setToken(token)
      // For demo purposes, we're not verifying token with backend
      setUser({ id: "user-id", username: localStorage.getItem("username") || "user" })
    }
    setLoading(false)
  }, [])

  // Login function to authenticate user and set token
  const login = async (username: string, password: string) => {
    try {
      setError(null)
      setLoading(true)

      const response = await api.post("/auth/login", { username, password })
      const { token } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("username", username)
      api.setToken(token)

      setUser({ id: "user-id", username })
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Register function to create a new account and log in immediately
    const register = async (username: string, password: string) => {
    try {
        setError(null)
        setLoading(true)

        await api.post("/auth/register", { username, password })

        // Only login if registration succeeded
        await login(username, password)
    } catch (err: any) {
        const message = err.response?.data?.message || "Registration failed. Please try again."

        if (
        err.response?.status === 400 &&
        message.toLowerCase().includes("username")
        ) {
        setError("Username already exists. Please choose a different one.")
        throw new Error("Username already exists. Please choose a different one.")
        } else {
        setError(message)
        throw new Error(message)
        }


        // 👇 Prevent further execution
        return
    } finally {
        setLoading(false)
    }
    }


  // Logout function to clear user data and token
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    api.setToken(null)
    setUser(null)
  }

  // Provide context values to children components
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to consume the AuthContext
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// frontend/components/theme-provider.tsx

"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

// Define the type of allowed theme values
type Theme = "dark" | "light" | "system"

// Props expected by the ThemeProvider component
type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

// Shape of the theme context state
type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

// Default state value used to initialize the context
const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

// Create the context with the default state
const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

// ThemeProvider component that wraps your app and manages theme state
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "task-manager-theme",
  ...props
}: ThemeProviderProps) {
  // Store the current theme in state
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  // On mount, retrieve the saved theme from localStorage or fallback to system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme | null

    if (savedTheme) {
      setTheme(savedTheme) // Use saved theme if available
    } else if (defaultTheme === "system") {
      // Detect system theme if default is "system"
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      setTheme(systemTheme)
    }
  }, [defaultTheme, storageKey])

  // On theme change, update the root <html> class for Tailwind's dark mode support
  useEffect(() => {
    const root = window.document.documentElement

    // Remove any existing theme class
    root.classList.remove("light", "dark")

    if (theme === "system") {
      // Recalculate system theme dynamically
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      // Apply the selected theme
      root.classList.add(theme)
    }
  }, [theme])

  // Context value that includes both current theme and a setter function
  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme) // Persist user preference
      setTheme(theme)
    },
  }

  // Provide the context to child components
  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

// Custom hook to access the theme context from anywhere in the app
export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
// frontend/app/layout.tsx

// Import React types and Next.js types
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

// Load the Inter font from Google Fonts
const inter = Inter({ subsets: ["latin"] })

// App metadata used by Next.js
export const metadata: Metadata = {
  title: "Task Management App",
  description: "A simple task management application",
}

// Root layout component wrapping the entire app
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="task-manager-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

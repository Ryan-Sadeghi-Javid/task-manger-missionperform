// frontend/components/theme-toggle.tsx

"use client"

import { Moon, Sun, Laptop } from "lucide-react" // Icons for theme options
import { useTheme } from "@/components/theme-provider" // Custom hook to access theme context
import { Button } from "@/components/ui/button" // Reusable button component
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu" // Components for dropdown functionality

// Component to toggle between Light, Dark, and System themes
export function ThemeToggle() {
  const { theme, setTheme } = useTheme() // Get current theme and setter from context

  return (
    <DropdownMenu>
      {/* The button that triggers the dropdown menu */}
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          {/* Sun icon for light mode - visible when in light mode */}
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />

          {/* Moon icon for dark mode - visible when in dark mode */}
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />

          {/* Hidden screen reader text for accessibility */}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      {/* Dropdown menu content */}
      <DropdownMenuContent align="end">
        {/* Light theme option */}
        <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>

        {/* Dark theme option */}
        <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>

        {/* System theme option (follows OS preference) */}
        <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
          <Laptop className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
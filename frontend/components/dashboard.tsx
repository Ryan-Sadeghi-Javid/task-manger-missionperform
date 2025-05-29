// frontend/components/dashboard.tsx

"use client" // This directive enables React Server Components to opt into client-side interactivity

// React and necessary hooks
import { useState } from "react"

// Custom authentication context
import { useAuth } from "@/lib/auth-context"

// Task context provider wraps components that need task state
import { TaskProvider } from "@/lib/task-context"

// Task-related UI components
import TaskList from "@/components/task-list"
import TaskForm from "@/components/task-form"

// UI elements
import { Button } from "@/components/ui/button"
import { PlusCircle, LogOut } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// Dark mode toggle component
import { ThemeToggle } from "@/components/theme-toggle"

export default function Dashboard() {
  // Get logout method and current user info from auth context
  const { logout, user } = useAuth()

  // Local state for modals and mobile UI toggles
  const [isCreating, setIsCreating] = useState(false) // Controls the Create Task modal
  const [editingTask, setEditingTask] = useState<string | null>(null) // Controls the Edit Task modal

  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sticky header with branding and action buttons */}
        <header className="sticky top-0 z-10 border-b bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
          <div className="container flex h-16 items-center justify-between px-4 md:px-6">
            {/* Left side of header: menu button and app name */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">Task Manager</h1>
            </div>

            {/* Right side of header: theme toggle, add task, and logout */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {/* Only show this button on screens larger than small (sm) */}
              <Button onClick={() => setIsCreating(true)} className="hidden sm:flex">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Task
              </Button>
              <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="container px-4 py-6 md:px-6 md:py-8">
          {/* Small-screen header for mobile */}
          <div className="mb-6 flex items-center justify-between sm:hidden">
            <h2 className="text-lg font-semibold">Your Tasks</h2>
            <Button onClick={() => setIsCreating(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>

          {/* Modal for creating a task */}
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogContent className="sm:max-w-[500px] dark:bg-gray-800 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-xl">Create New Task</DialogTitle>
                <DialogDescription>Add a new task to your list. Fill out the details below.</DialogDescription>
              </DialogHeader>
              <TaskForm onSuccess={() => setIsCreating(false)} />
            </DialogContent>
          </Dialog>

          {/* Modal for editing an existing task */}
          <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
            <DialogContent className="sm:max-w-[500px] dark:bg-gray-800 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-xl">Edit Task</DialogTitle>
                <DialogDescription>Make changes to your task. Click update when you're done.</DialogDescription>
              </DialogHeader>
              {editingTask && <TaskForm taskId={editingTask} onSuccess={() => setEditingTask(null)} />}
            </DialogContent>
          </Dialog>

          {/* Task list with edit callback */}
          <TaskList onEdit={setEditingTask} />
        </main>
      </div>
    </TaskProvider>
  )
}

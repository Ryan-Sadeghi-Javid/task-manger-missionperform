// frontend/lib/task-context.ts

"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

// Define the structure of a task
export interface Task {
  _id: string
  title: string
  description?: string
  status: "To Do" | "In Progress" | "Done"
  createdAt: string
}

// Define what the task context will provide
interface TaskContextType {
  tasks: Task[]
  loading: boolean
  error: string | null
  fetchTasks: () => Promise<void>
  createTask: (task: Omit<Task, "_id" | "createdAt">) => Promise<void>
  updateTask: (id: string, task: Partial<Omit<Task, "_id" | "createdAt">>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

// Create the context
const TaskContext = createContext<TaskContextType | undefined>(undefined)

// Context provider component that wraps children and provides task state/functions
export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])          // List of current tasks
  const [loading, setLoading] = useState(false)           // Loading state for async operations
  const [error, setError] = useState<string | null>(null) // Error messages from API calls
  const { isAuthenticated } = useAuth()                   // Check if the user is logged in

  // Fetch tasks from the backend if authenticated
  const fetchTasks = async () => {
    if (!isAuthenticated) return

    try {
      setLoading(true)
      setError(null)
      const response = await api.get("/tasks")
      setTasks(response.data) // Set fetched tasks into state
    } catch (err: unknown) {
      const message = (err as any)?.response?.data?.message || "Failed to fetch task"
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Create a new task and add it to the current list
  const createTask = async (task: Omit<Task, "_id" | "createdAt">) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.post("/tasks", task)
      setTasks((prevTasks) => [...prevTasks, response.data]) // Append new task to list
    } catch (err: unknown) {
      const message = (err as any)?.response?.data?.message || "Failed to create task"
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update an existing task by its ID
  const updateTask = async (id: string, task: Partial<Omit<Task, "_id" | "createdAt">>) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.put(`/tasks/${id}`, task)
      // Replace the updated task in the task list
      setTasks((prevTasks) => prevTasks.map((t) => (t._id === id ? { ...t, ...response.data } : t)))
    } catch (err: unknown) {
      const message = (err as any)?.response?.data?.message || "Failed to update task"
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete a task by its ID
  const deleteTask = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await api.delete(`/tasks/${id}`)
      // Remove the task from the list
      setTasks((prevTasks) => prevTasks.filter((t) => t._id !== id))
    } catch (err: unknown) {
      const message = (err as any)?.response?.data?.message || "Failed to update task"
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Automatically fetch tasks whenever authentication state becomes valid
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks()
    }
  }, [isAuthenticated])

  // Provide all task-related state and functions to children
  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

// Custom hook to access the task context easily in components
export function useTasks() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider")
  }
  return context
}

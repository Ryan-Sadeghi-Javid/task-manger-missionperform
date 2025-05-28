// frontend/components/task-form.tsx

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTasks, type Task } from "@/lib/task-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CalendarIcon, CheckCircle2, Sparkles, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"

interface TaskFormProps {
  taskId?: string
  onSuccess?: () => void
}

export default function TaskForm({ taskId, onSuccess }: TaskFormProps) {
  const { tasks, createTask, updateTask, loading } = useTasks()

  // Initialize form data
  const [formData, setFormData] = useState<Omit<Task, "_id" | "createdAt">>({
    title: "",
    description: "",
    status: "To Do",
  })

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [generatingDescription, setGeneratingDescription] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)

  // Load existing task data if editing
  useEffect(() => {
    if (taskId) {
      const task = tasks.find((t) => t._id === taskId)
      if (task) {
        setFormData({
          title: task.title,
          description: task.description || "",
          status: task.status,
        })
      }
    }
  }, [taskId, tasks])

  // Handle form submission for create or update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    try {
      if (!formData.title.trim()) {
        setError("Title is required")
        return
      }

      if (taskId) {
        await updateTask(taskId, formData)
        setSuccess(true)
        setTimeout(() => {
          if (onSuccess) onSuccess()
        }, 1000)
      } else {
        await createTask(formData)
        setSuccess(true)
        // Reset form after creation
        setFormData({
          title: "",
          description: "",
          status: "To Do",
        })
        setTimeout(() => {
          if (onSuccess) onSuccess()
        }, 1000)
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    }
  }

  // Generate task description using AI
  const generateDescription = async () => {
    if (!formData.title.trim()) {
      setGenerationError("Please enter a task title first")
      setTimeout(() => setGenerationError(null), 3000)
      return
    }

    try {
      setGeneratingDescription(true)
      setGenerationError(null)

      const response = await api.post("/ai/generate-description", { title: formData.title })
      const { description } = response.data

      setFormData((prev) => ({ ...prev, description }))
    } catch (err: any) {
      setGenerationError(err.response?.data?.message || "Failed to generate description. Please try again.")
      setTimeout(() => setGenerationError(null), 5000)
    } finally {
      setGeneratingDescription(false)
    }
  }

  // Return Tailwind className for current status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "text-blue-500 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800"
      case "In Progress":
        return "text-yellow-500 bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800"
      case "Done":
        return "text-green-500 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
      default:
        return "text-gray-500 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      {/* Task Title Input */}
      <div className="space-y-1">
        <Label htmlFor="title" className="text-base font-medium">
          Task Title
        </Label>
        <div className="flex gap-2">
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter a clear, specific task title"
            className="h-12 text-base"
            required
          />
          {/* AI Description Generator Button */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-12 w-12 flex-shrink-0 text-primary hover:text-primary hover:bg-primary/10"
            onClick={generateDescription}
            disabled={generatingDescription || !formData.title.trim()}
            title="Generate description using AI"
          >
            {generatingDescription ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Description Input */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label htmlFor="description" className="text-base font-medium">
            Description
          </Label>
          {generatingDescription && (
            <span className="text-xs text-muted-foreground animate-pulse">Generating with AI...</span>
          )}
        </div>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Add details, requirements, or any additional information"
          className="min-h-[120px] text-base resize-none"
          rows={4}
        />
        {/* AI generation error message */}
        {generationError && (
          <p className="text-sm text-destructive mt-1 flex items-center">
            <AlertCircle className="h-3.5 w-3.5 mr-1" />
            {generationError}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1 flex items-center">
          <Sparkles className="h-3 w-3 mr-1" />
          Click the sparkle button to generate a description with AI
        </p>
      </div>

      {/* Task Status Dropdown */}
      <div className="space-y-1">
        <Label htmlFor="status" className="text-base font-medium">
          Status
        </Label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value as "To Do" | "In Progress" | "Done" })}
        >
          <SelectTrigger id="status" className="h-12 text-base">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="To Do" className="flex items-center">
              <div className="flex items-center">
                <div className={cn("w-2 h-2 rounded-full mr-2 bg-blue-500")} />
                To Do
              </div>
            </SelectItem>
            <SelectItem value="In Progress">
              <div className="flex items-center">
                <div className={cn("w-2 h-2 rounded-full mr-2 bg-yellow-500")} />
                In Progress
              </div>
            </SelectItem>
            <SelectItem value="Done">
              <div className="flex items-center">
                <div className={cn("w-2 h-2 rounded-full mr-2 bg-green-500")} />
                Done
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Footer: Status Chip + Date + Alerts + Submit */}
      <div className="pt-2">
        <div className="flex items-center gap-2 mb-4">
          {/* Colored status chip */}
          <div className={cn("px-3 py-1 rounded-full text-sm border", getStatusColor(formData.status))}>
            {formData.status}
          </div>
          {/* Current date */}
          <div className="text-sm text-muted-foreground flex items-center">
            <CalendarIcon className="h-3.5 w-3.5 mr-1" />
            {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Validation/Error alert */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success alert */}
        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
            <AlertDescription>Task successfully {taskId ? "updated" : "created"}!</AlertDescription>
          </Alert>
        )}

        {/* Submit button */}
        <div className="flex gap-3">
          <Button type="submit" className="w-full h-12 text-base font-medium" disabled={loading}>
            {loading ? "Saving..." : taskId ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </div>
    </form>
  )
}
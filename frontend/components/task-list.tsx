// frontend/components/task-list.tsx

"use client"

import { useState, useEffect } from "react"
import { useTasks, type Task } from "@/lib/task-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, RefreshCw, ArrowUpDown, Filter, Calendar, SortAsc, SortDesc } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TaskListProps {
  onEdit: (taskId: string) => void
}

type SortField = "createdAt" | "title" | "status"
type SortOrder = "asc" | "desc"

export default function TaskList({ onEdit }: TaskListProps) {
  // Local states for filtering and sorting tasks
  const { tasks, loading, error, fetchTasks, updateTask, deleteTask } = useTasks()
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("createdAt")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])

  // Apply filters and sorting whenever tasks or settings change
  useEffect(() => {
    let result = [...tasks]

    // Filter tasks by status if a specific status is selected
    if (statusFilter !== "all") {
      result = result.filter((task) => task.status === statusFilter)
    }

    // Sort tasks based on selected field and order
    result.sort((a, b) => {
      if (sortField === "createdAt") {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA
      } else if (sortField === "title") {
        return sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      } else if (sortField === "status") {
        const statusOrder = { "To Do": 1, "In Progress": 2, Done: 3 }
        return sortOrder === "asc"
          ? statusOrder[a.status] - statusOrder[b.status]
          : statusOrder[b.status] - statusOrder[a.status]
      }
      return 0
    })

    setFilteredTasks(result)
  }, [tasks, statusFilter, sortField, sortOrder])

  // Handle status update from dropdown
  const handleStatusChange = async (taskId: string, status: "To Do" | "In Progress" | "Done") => {
    await updateTask(taskId, { status })
  }

  // Handle task deletion with confirmation
  const handleDelete = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(taskId)
    }
  }

  // Return appropriate Tailwind classes for status badge
  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 status-badge to-do"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800 status-badge in-progress"
      case "Done":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800 status-badge done"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Return icon based on the current sort field
  const getSortIcon = () => {
    if (sortField === "createdAt") return <Calendar className="h-4 w-4" />
    if (sortField === "title") return <ArrowUpDown className="h-4 w-4" />
    if (sortField === "status") return <Filter className="h-4 w-4" />
    return <ArrowUpDown className="h-4 w-4" />
  }

  // Toggle between ascending and descending sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  return (
    <div className="space-y-6">
      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Status Filter Tabs */}
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="To Do">To Do</TabsTrigger>
              <TabsTrigger value="In Progress">In Progress</TabsTrigger>
              <TabsTrigger value="Done">Done</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Sort Controls */}
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10">
                  <span className="mr-2">Sort by</span>
                  {getSortIcon()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortField("createdAt")}>
                  <Calendar className="mr-2 h-4 w-4" /> Date Created
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortField("title")}>
                  <ArrowUpDown className="mr-2 h-4 w-4" /> Title
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortField("status")}>
                  <Filter className="mr-2 h-4 w-4" /> Status
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" className="h-10" onClick={toggleSortOrder}>
              {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Refresh Button */}
        <Button variant="outline" size="sm" onClick={fetchTasks} disabled={loading} className="h-10">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading Spinner or Empty State */}
      {loading && tasks.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center dark:border-gray-700">
          <h3 className="mb-2 text-xl font-medium">No tasks found</h3>
          <p className="text-sm text-muted-foreground">
            {tasks.length === 0 ? "Create your first task to get started" : "No tasks match the current filter"}
          </p>
        </div>
      ) : (
        // Render the filtered and sorted list of tasks
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <Card key={task._id} className="overflow-hidden task-card">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-1 text-lg">{task.title}</CardTitle>
                  <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Created {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                </p>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {task.description || "No description provided"}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3 dark:border-gray-700 dark:bg-gray-800/30">
                {/* Status update dropdown */}
                <Select
                  defaultValue={task.status}
                  onValueChange={(value) => handleStatusChange(task._id, value as "To Do" | "In Progress" | "Done")}
                >
                  <SelectTrigger className="h-8 w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectContent>
                </Select>

                {/* Edit and delete buttons */}
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(task._id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(task._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
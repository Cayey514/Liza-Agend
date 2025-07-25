"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Trash2, Search, Filter } from "lucide-react"
import type { Task } from "../page"

interface TaskListProps {
  tasks: Task[]
  onToggleTask: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
}

export function TaskList({ tasks, onToggleTask, onDeleteTask }: TaskListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "completed" && task.completed) ||
      (filterStatus === "pending" && !task.completed)
    const matchesCategory = filterCategory === "all" || task.category === filterCategory

    return matchesSearch && matchesPriority && matchesStatus && matchesCategory
  })

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    return a.dueDate.getTime() - b.dueDate.getTime()
  })

  const isOverdue = (task: Task) => {
    return !task.completed && task.dueDate < new Date()
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar tareas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="completed">Completadas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="assignment">Tareas</SelectItem>
                <SelectItem value="exam">Exámenes</SelectItem>
                <SelectItem value="project">Proyectos</SelectItem>
                <SelectItem value="reading">Lecturas</SelectItem>
                <SelectItem value="other">Otros</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setFilterPriority("all")
                setFilterStatus("all")
                setFilterCategory("all")
              }}
            >
              Limpiar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <div className="space-y-4">
        {sortedTasks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No se encontraron tareas con los filtros aplicados.</p>
            </CardContent>
          </Card>
        ) : (
          sortedTasks.map((task) => (
            <Card
              key={task.id}
              className={`${task.completed ? "opacity-75" : ""} ${isOverdue(task) ? "border-red-200 bg-red-50 dark:bg-red-900/10" : ""}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Checkbox checked={task.completed} onCheckedChange={() => onToggleTask(task.id)} className="mt-1" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3
                          className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-900 dark:text-gray-100"}`}
                        >
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{task.subject}</p>
                        {task.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">{task.description}</p>
                        )}
                        {task.estimatedTime && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Tiempo estimado: {task.estimatedTime} minutos
                          </p>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteTask(task.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2 flex-wrap gap-2">
                        <Badge
                          variant={
                            task.priority === "high"
                              ? "destructive"
                              : task.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Media" : "Baja"}
                        </Badge>

                        <Badge variant="outline">
                          {task.category === "assignment"
                            ? "Tarea"
                            : task.category === "exam"
                              ? "Examen"
                              : task.category === "project"
                                ? "Proyecto"
                                : task.category === "reading"
                                  ? "Lectura"
                                  : "Otro"}
                        </Badge>

                        {isOverdue(task) && <Badge variant="destructive">Vencida</Badge>}

                        {task.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <p
                        className={`text-sm ${isOverdue(task) ? "text-red-600 font-medium" : "text-gray-500 dark:text-gray-400"}`}
                      >
                        {task.dueDate.toLocaleDateString("es-ES", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

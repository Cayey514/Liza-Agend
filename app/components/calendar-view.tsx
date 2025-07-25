"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import type { Task } from "../page"

interface CalendarViewProps {
  tasks: Task[]
}

export function CalendarView({ tasks }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getTasksForDate = (date: Date | null) => {
    if (!date) return []
    return tasks.filter((task) => {
      const taskDate = new Date(task.dueDate)
      return taskDate.toDateString() === date.toDateString()
    })
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const days = getDaysInMonth(currentDate)
  const today = new Date()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Calendario de Tareas
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold min-w-[150px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dayTasks = getTasksForDate(day)
              const isToday = day && day.toDateString() === today.toDateString()
              const isCurrentMonth = day !== null

              return (
                <div
                  key={index}
                  className={`min-h-[100px] p-2 border rounded-lg ${
                    isCurrentMonth ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"
                  } ${isToday ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""}`}
                >
                  {day && (
                    <>
                      <div
                        className={`text-sm font-medium mb-2 ${isToday ? "text-blue-600" : "text-gray-900 dark:text-gray-100"}`}
                      >
                        {day.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayTasks.slice(0, 3).map((task) => (
                          <div
                            key={task.id}
                            className={`text-xs p-1 rounded truncate ${
                              task.completed
                                ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                                : task.priority === "high"
                                  ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                                  : task.priority === "medium"
                                    ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300"
                                    : "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300"
                            }`}
                            title={`${task.title} - ${task.subject}`}
                          >
                            {task.title}
                          </div>
                        ))}
                        {dayTasks.length > 3 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            +{dayTasks.length - 3} más
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tasks for selected month */}
      <Card>
        <CardHeader>
          <CardTitle>
            Tareas de {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks
              .filter((task) => {
                const taskDate = new Date(task.dueDate)
                return (
                  taskDate.getMonth() === currentDate.getMonth() && taskDate.getFullYear() === currentDate.getFullYear()
                )
              })
              .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
              .map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div>
                    <h4
                      className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-900 dark:text-gray-100"}`}
                    >
                      {task.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{task.subject}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {task.dueDate.toLocaleDateString("es-ES", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"
                      }
                    >
                      {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Media" : "Baja"}
                    </Badge>
                    {task.completed && (
                      <Badge
                        variant="outline"
                        className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                      >
                        Completada
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

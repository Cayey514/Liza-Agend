"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Bell, AlertTriangle, Clock, CheckCircle2 } from "lucide-react"
import type { Task } from "../page"

interface NotificationCenterProps {
  tasks: Task[]
  onClose: () => void
}

export function NotificationCenter({ tasks, onClose }: NotificationCenterProps) {
  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const overdueTasks = tasks.filter((task) => !task.completed && task.dueDate < now)
  const dueTomorrow = tasks.filter((task) => !task.completed && task.dueDate <= tomorrow && task.dueDate > now)
  const dueThisWeek = tasks.filter((task) => !task.completed && task.dueDate <= nextWeek && task.dueDate > tomorrow)

  const notifications = [
    ...overdueTasks.map((task) => ({
      id: task.id,
      type: "overdue" as const,
      title: "Tarea vencida",
      message: `${task.title} venció el ${task.dueDate.toLocaleDateString("es-ES")}`,
      task,
      priority: "high" as const,
    })),
    ...dueTomorrow.map((task) => ({
      id: task.id,
      type: "due-tomorrow" as const,
      title: "Vence mañana",
      message: `${task.title} vence mañana`,
      task,
      priority: "medium" as const,
    })),
    ...dueThisWeek.map((task) => ({
      id: task.id,
      type: "due-week" as const,
      title: "Vence esta semana",
      message: `${task.title} vence el ${task.dueDate.toLocaleDateString("es-ES")}`,
      task,
      priority: "low" as const,
    })),
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "overdue":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "due-tomorrow":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "due-week":
        return <Bell className="h-5 w-5 text-blue-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getNotificationColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50 dark:bg-red-900/20"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
      case "low":
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20"
      default:
        return "border-l-gray-500 bg-gray-50 dark:bg-gray-800"
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Centro de Notificaciones
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">¡Todo al día!</h3>
              <p className="text-gray-600 dark:text-gray-400">No tienes notificaciones pendientes en este momento.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Notificaciones ({notifications.length})
                </h3>
                <div className="flex space-x-2">
                  {overdueTasks.length > 0 && <Badge variant="destructive">{overdueTasks.length} vencidas</Badge>}
                  {dueTomorrow.length > 0 && <Badge variant="default">{dueTomorrow.length} mañana</Badge>}
                  {dueThisWeek.length > 0 && <Badge variant="secondary">{dueThisWeek.length} esta semana</Badge>}
                </div>
              </div>

              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border-l-4 ${getNotificationColor(notification.priority)}`}
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">{notification.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {notification.task.subject}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge
                            variant={
                              notification.task.priority === "high"
                                ? "destructive"
                                : notification.task.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {notification.task.priority === "high"
                              ? "Alta"
                              : notification.task.priority === "medium"
                                ? "Media"
                                : "Baja"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {notification.task.category === "assignment"
                              ? "Tarea"
                              : notification.task.category === "exam"
                                ? "Examen"
                                : notification.task.category === "project"
                                  ? "Proyecto"
                                  : notification.task.category === "reading"
                                    ? "Lectura"
                                    : "Otro"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

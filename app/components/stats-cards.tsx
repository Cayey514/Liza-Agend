"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Clock, AlertTriangle, BookOpen } from "lucide-react"
import type { Task } from "../page"

interface StatsCardsProps {
  tasks: Task[]
}

export function StatsCards({ tasks }: StatsCardsProps) {
  const completedTasks = tasks.filter((task) => task.completed).length
  const pendingTasks = tasks.filter((task) => !task.completed).length
  const overdueTasks = tasks.filter((task) => !task.completed && task.dueDate < new Date()).length
  const totalSubjects = [...new Set(tasks.map((task) => task.subject))].length

  const stats = [
    {
      title: "Tareas Completadas",
      value: completedTasks,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Tareas Pendientes",
      value: pendingTasks,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Tareas Vencidas",
      value: overdueTasks,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Materias Activas",
      value: totalSubjects,
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-2 md:p-3 rounded-full flex-shrink-0`}>
                <stat.icon className={`h-4 w-4 md:h-5 md:w-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

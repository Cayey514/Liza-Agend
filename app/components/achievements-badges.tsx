"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Target, BookOpen, Clock, Zap } from "lucide-react"
import type { Task, UserProfile } from "../page"

interface AchievementsBadgesProps {
  tasks: Task[]
  profile: UserProfile
}

export function AchievementsBadges({ tasks, profile }: AchievementsBadgesProps) {
  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const achievements = [
    {
      id: "first_task",
      title: "Primera Tarea",
      description: "Completaste tu primera tarea",
      icon: Star,
      earned: completedTasks >= 1,
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      id: "task_master",
      title: "Maestro de Tareas",
      description: "Completaste 10 tareas",
      icon: Trophy,
      earned: completedTasks >= 10,
      color: "bg-gold-100 text-gold-800",
    },
    {
      id: "goal_setter",
      title: "Establecedor de Metas",
      description: "Estableciste tus primeras metas",
      icon: Target,
      earned: profile.goals.length >= 1,
      color: "bg-green-100 text-green-800",
    },
    {
      id: "organized",
      title: "Súper Organizada",
      description: "Mantén un 80% de tareas completadas",
      icon: BookOpen,
      earned: completionRate >= 80,
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: "dedicated",
      title: "Estudiante Dedicada",
      description: "Estudias más de 20 horas por semana",
      icon: Clock,
      earned: profile.studyHours >= 20,
      color: "bg-purple-100 text-purple-800",
    },
    {
      id: "perfectionist",
      title: "Perfeccionista",
      description: "Completa todas tus tareas",
      icon: Zap,
      earned: totalTasks > 0 && completionRate === 100,
      color: "bg-pink-100 text-pink-800",
    },
  ]

  const earnedAchievements = achievements.filter((achievement) => achievement.earned)
  const availableAchievements = achievements.filter((achievement) => !achievement.earned)

  if (earnedAchievements.length === 0 && availableAchievements.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
          Logros y Reconocimientos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Earned Achievements */}
          {earnedAchievements.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">🎉 Logros Obtenidos</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {earnedAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 border-dashed ${achievement.color} border-opacity-50`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${achievement.color}`}>
                        <achievement.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h5 className="font-medium text-sm">{achievement.title}</h5>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Achievements */}
          {availableAchievements.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">🎯 Próximos Logros</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableAchievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50 opacity-75">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-gray-200">
                        <achievement.icon className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <h5 className="font-medium text-sm text-gray-700">{achievement.title}</h5>
                        <p className="text-xs text-gray-500">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Summary */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Progreso de Logros</h4>
                <p className="text-sm text-gray-600">
                  Has desbloqueado {earnedAchievements.length} de {achievements.length} logros
                </p>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {Math.round((earnedAchievements.length / achievements.length) * 100)}%
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

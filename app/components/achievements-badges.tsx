"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Target, Zap, BookOpen, CheckCircle2 } from "lucide-react"
import type { Task, UserProfile } from "../page"

interface AchievementsBadgesProps {
  tasks: Task[]
  profile: UserProfile
}

export function AchievementsBadges({ tasks, profile }: AchievementsBadgesProps) {
  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const hasProfile = profile.name !== ""
  const hasGoals = profile.goals.length > 0
  const hasSchedule = profile.favoriteSubjects.length > 0

  const achievements = [
    {
      id: "first-task",
      title: "Primera Tarea",
      description: "Completa tu primera tarea",
      icon: CheckCircle2,
      unlocked: completedTasks >= 1,
      progress: Math.min(completedTasks, 1),
      maxProgress: 1,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      id: "task-master",
      title: "Maestro de Tareas",
      description: "Completa 10 tareas",
      icon: Trophy,
      unlocked: completedTasks >= 10,
      progress: Math.min(completedTasks, 10),
      maxProgress: 10,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      id: "organized",
      title: "Súper Organizado",
      description: "Completa tu perfil",
      icon: Star,
      unlocked: hasProfile,
      progress: hasProfile ? 1 : 0,
      maxProgress: 1,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      id: "goal-setter",
      title: "Establecedor de Metas",
      description: "Define tus metas académicas",
      icon: Target,
      unlocked: hasGoals,
      progress: hasGoals ? 1 : 0,
      maxProgress: 1,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      id: "productive",
      title: "Productivo",
      description: "Completa 5 tareas en una semana",
      icon: Zap,
      unlocked: completedTasks >= 5,
      progress: Math.min(completedTasks, 5),
      maxProgress: 5,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      id: "scholar",
      title: "Académico",
      description: "Agrega materias favoritas",
      icon: BookOpen,
      unlocked: hasSchedule,
      progress: hasSchedule ? 1 : 0,
      maxProgress: 1,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
  ]

  const unlockedAchievements = achievements.filter((achievement) => achievement.unlocked)
  const nextAchievements = achievements.filter((achievement) => !achievement.unlocked).slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base md:text-lg">
              <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
              Logros Desbloqueados ({unlockedAchievements.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {unlockedAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`${achievement.bgColor} p-4 rounded-lg border-2 border-opacity-20 border-current`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`${achievement.color} flex-shrink-0`}>
                      <achievement.icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base truncate">
                        {achievement.title}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {achievement.description}
                      </p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        ¡Completado!
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Achievements */}
      {nextAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base md:text-lg">
              <Target className="h-5 w-5 mr-2 text-gray-600" />
              Próximos Logros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {nextAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="text-gray-400 flex-shrink-0">
                      <achievement.icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm md:text-base truncate">
                        {achievement.title}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>Progreso</span>
                      <span>
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                    </div>
                    <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

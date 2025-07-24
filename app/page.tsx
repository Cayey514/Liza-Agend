"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Clock, Plus, BookOpen, Target, User, CalendarIcon } from "lucide-react"
import { TaskForm } from "./components/task-form"
import { TaskList } from "./components/task-list"
import { CalendarView } from "./components/calendar-view"
import { StatsCards } from "./components/stats-cards"
import { ProfileView } from "./components/profile-view"
import { ProfileForm } from "./components/profile-form"
import { ScheduleView } from "./components/schedule-view"
import { AchievementsBadges } from "./components/achievements-badges"

export interface Task {
  id: string
  title: string
  description: string
  subject: string
  priority: "low" | "medium" | "high"
  dueDate: Date
  completed: boolean
  category: "assignment" | "exam" | "project" | "reading" | "other"
}

export interface UserProfile {
  name: string
  email: string
  career: string
  semester: string
  university: string
  avatar: string
  bio: string
  goals: string[]
  studyHours: number
  favoriteSubjects: string[]
  gender: "female" | "male" | "other"
}

export interface ScheduleItem {
  id: string
  subject: string
  day: string
  startTime: string
  endTime: string
  classroom: string
  professor: string
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Ensayo de Historia",
    description: "Escribir ensayo sobre la Revolución Industrial",
    subject: "Historia",
    priority: "high",
    dueDate: new Date(2025, 0, 28),
    completed: false,
    category: "assignment",
  },
  {
    id: "2",
    title: "Examen de Matemáticas",
    description: "Capítulos 5-7: Álgebra lineal",
    subject: "Matemáticas",
    priority: "high",
    dueDate: new Date(2025, 0, 30),
    completed: false,
    category: "exam",
  },
  {
    id: "3",
    title: "Proyecto de Ciencias",
    description: "Experimento sobre fotosíntesis",
    subject: "Biología",
    priority: "medium",
    dueDate: new Date(2025, 1, 5),
    completed: false,
    category: "project",
  },
  {
    id: "4",
    title: "Lectura Capítulo 3",
    description: "Leer y resumir capítulo sobre literatura medieval",
    subject: "Literatura",
    priority: "low",
    dueDate: new Date(2025, 0, 26),
    completed: true,
    category: "reading",
  },
]

const initialProfile: UserProfile = {
  name: "",
  email: "",
  career: "",
  semester: "",
  university: "",
  avatar: "",
  bio: "",
  goals: [],
  studyHours: 0,
  favoriteSubjects: [],
  gender: "female",
}

const initialSchedule: ScheduleItem[] = [
  {
    id: "1",
    subject: "Matemáticas",
    day: "Lunes",
    startTime: "08:00",
    endTime: "10:00",
    classroom: "Aula 101",
    professor: "Dr. García",
  },
  {
    id: "2",
    subject: "Historia",
    day: "Martes",
    startTime: "10:00",
    endTime: "12:00",
    classroom: "Aula 205",
    professor: "Prof. Martínez",
  },
]

export default function LizaAgenda() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [profile, setProfile] = useState<UserProfile>(initialProfile)
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showProfileForm, setShowProfileForm] = useState(false)
  const [activeView, setActiveView] = useState<"dashboard" | "tasks" | "calendar" | "profile" | "schedule">("dashboard")

  const addTask = (newTask: Omit<Task, "id">) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
    }
    setTasks([...tasks, task])
    setShowTaskForm(false)
  }

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile)
    setShowProfileForm(false)
  }

  const upcomingTasks = tasks
    .filter((task) => !task.completed)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, 5)

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const todaySchedule = schedule.filter((item) => {
    const today = new Date().toLocaleDateString("es-ES", { weekday: "long" })
    return item.day.toLowerCase() === today.toLowerCase()
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Liza-Agenda
                </h1>
                <p className="text-sm text-gray-600">Tu compañera de estudios inteligente</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {profile.name && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{profile.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">¡Hola, {profile.name}!</span>
                </div>
              )}
              <Button
                onClick={() => setShowTaskForm(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Tarea
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { key: "dashboard", label: "Dashboard", icon: Target },
              { key: "tasks", label: "Mis Tareas", icon: CheckCircle2 },
              { key: "calendar", label: "Calendario", icon: CalendarIcon },
              { key: "schedule", label: "Horario", icon: Clock },
              { key: "profile", label: "Perfil", icon: User },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveView(key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeView === key
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === "dashboard" && (
          <div className="space-y-8">
            {/* Welcome Section */}
            {profile.name ? (
              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">
                        ¡{profile.gender === "male" ? "Bienvenido" : "Bienvenida"}, {profile.name}! 👋
                      </h2>
                      <p className="text-purple-100 mt-1">
                        {profile.career} - {profile.semester} | {profile.university}
                      </p>
                      <p className="text-purple-100 mt-2">{profile.bio}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-purple-100">Horas de estudio esta semana</p>
                      <p className="text-3xl font-bold">{profile.studyHours}h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardContent className="p-6 text-center">
                  <h2 className="text-2xl font-bold mb-4">¡Bienvenida a Liza-Agenda! 🎓</h2>
                  <p className="text-purple-100 mb-4">Completa tu perfil para personalizar tu experiencia de estudio</p>
                  <Button
                    onClick={() => setShowProfileForm(true)}
                    className="bg-white text-purple-600 hover:bg-gray-100"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Crear Mi Perfil
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Stats Cards */}
            <StatsCards tasks={tasks} />

            {/* Achievements */}
            <AchievementsBadges tasks={tasks} profile={profile} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Progress Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-purple-600" />
                    Progreso General
                  </CardTitle>
                  <CardDescription>
                    Has completado {completedTasks} de {totalTasks} tareas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso de tareas</span>
                      <span>{Math.round(completionRate)}%</span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                  </div>
                  {profile.goals.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Mis Metas:</h4>
                      <div className="space-y-1">
                        {profile.goals.slice(0, 3).map((goal, index) => (
                          <div key={index} className="text-sm text-gray-600 flex items-center">
                            <Target className="h-3 w-3 mr-2 text-purple-500" />
                            {goal}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Today's Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    Horario de Hoy
                  </CardTitle>
                  <CardDescription>
                    {new Date().toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {todaySchedule.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>No tienes clases programadas para hoy</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {todaySchedule.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">{item.subject}</h4>
                            <p className="text-sm text-gray-600">{item.professor}</p>
                            <p className="text-xs text-gray-500">{item.classroom}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-blue-600">
                              {item.startTime} - {item.endTime}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-orange-600" />
                  Próximas Tareas
                </CardTitle>
                <CardDescription>Tareas pendientes ordenadas por fecha de vencimiento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <p>¡Excelente! No tienes tareas pendientes.</p>
                    </div>
                  ) : (
                    upcomingTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{task.title}</h4>
                          <p className="text-sm text-gray-600">{task.subject}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Vence:{" "}
                            {task.dueDate.toLocaleDateString("es-ES", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
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
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeView === "tasks" && <TaskList tasks={tasks} onToggleTask={toggleTask} onDeleteTask={deleteTask} />}
        {activeView === "calendar" && <CalendarView tasks={tasks} />}
        {activeView === "profile" && <ProfileView profile={profile} onEditProfile={() => setShowProfileForm(true)} />}
        {activeView === "schedule" && <ScheduleView schedule={schedule} setSchedule={setSchedule} />}
      </main>

      {/* Modals */}
      {showTaskForm && <TaskForm onSubmit={addTask} onClose={() => setShowTaskForm(false)} />}
      {showProfileForm && (
        <ProfileForm profile={profile} onSubmit={updateProfile} onClose={() => setShowProfileForm(false)} />
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle2,
  Clock,
  Plus,
  BookOpen,
  Target,
  User,
  CalendarIcon,
  Menu,
  Moon,
  Sun,
  Bell,
  Timer,
  Calculator,
  FileText,
  Download,
  Palette,
} from "lucide-react"
import { TaskForm } from "./components/task-form"
import { TaskList } from "./components/task-list"
import { CalendarView } from "./components/calendar-view"
import { StatsCards } from "./components/stats-cards"
import { ProfileView } from "./components/profile-view"
import { ProfileForm } from "./components/profile-form"
import { ScheduleView } from "./components/schedule-view"
import { AchievementsBadges } from "./components/achievements-badges"
import { NotesView } from "./components/notes-view"
import { PomodoroTimer } from "./components/pomodoro-timer"
import { GradeCalculator } from "./components/grade-calculator"
import { ResourcesView } from "./components/resources-view"
import { NotificationCenter } from "./components/notification-center"
import { ThemeCustomizer } from "./components/theme-customizer"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"

export interface Task {
  id: string
  title: string
  description: string
  subject: string
  priority: "low" | "medium" | "high"
  dueDate: Date
  completed: boolean
  category: "assignment" | "exam" | "project" | "reading" | "other"
  tags: string[]
  estimatedTime?: number
  actualTime?: number
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
  gpa?: number
  targetGPA?: number
  notifications: boolean
  theme: string
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

export interface Note {
  id: string
  title: string
  content: string
  subject: string
  createdAt: Date
  updatedAt: Date
  tags: string[]
}

export interface Resource {
  id: string
  title: string
  type: "book" | "website" | "video" | "document" | "other"
  url?: string
  description: string
  subject: string
  rating: number
  completed: boolean
}

export interface Grade {
  id: string
  subject: string
  assignment: string
  grade: number
  maxGrade: number
  weight: number
  date: Date
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
    tags: ["ensayo", "historia"],
    estimatedTime: 180,
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
    tags: ["examen", "álgebra"],
    estimatedTime: 120,
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
    tags: ["proyecto", "experimento"],
    estimatedTime: 300,
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
    tags: ["lectura", "resumen"],
    estimatedTime: 60,
    actualTime: 45,
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
  gpa: 0,
  targetGPA: 0,
  notifications: true,
  theme: "default",
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

// Utility functions for localStorage
const saveToLocalStorage = (key: string, data: any) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  }
}

const loadFromLocalStorage = (key: string, defaultValue: any) => {
  if (typeof window !== "undefined") {
    try {
      const item = localStorage.getItem(key)
      if (item) {
        const parsed = JSON.parse(item)
        // Convert date strings back to Date objects
        if (key === "liza-agenda-tasks" && Array.isArray(parsed)) {
          return parsed.map((task: any) => ({
            ...task,
            dueDate: new Date(task.dueDate),
          }))
        }
        if (key === "liza-agenda-notes" && Array.isArray(parsed)) {
          return parsed.map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
          }))
        }
        if (key === "liza-agenda-grades" && Array.isArray(parsed)) {
          return parsed.map((grade: any) => ({
            ...grade,
            date: new Date(grade.date),
          }))
        }
        return parsed
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error)
    }
  }
  return defaultValue
}

export default function LizaAgenda() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [profile, setProfile] = useState<UserProfile>(initialProfile)
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showProfileForm, setShowProfileForm] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false)
  const [activeView, setActiveView] = useState<
    "dashboard" | "tasks" | "calendar" | "profile" | "schedule" | "notes" | "pomodoro" | "grades" | "resources"
  >("dashboard")
  const [isLoaded, setIsLoaded] = useState(false)
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTasks = loadFromLocalStorage("liza-agenda-tasks", initialTasks)
    const savedProfile = loadFromLocalStorage("liza-agenda-profile", initialProfile)
    const savedSchedule = loadFromLocalStorage("liza-agenda-schedule", initialSchedule)
    const savedNotes = loadFromLocalStorage("liza-agenda-notes", [])
    const savedResources = loadFromLocalStorage("liza-agenda-resources", [])
    const savedGrades = loadFromLocalStorage("liza-agenda-grades", [])

    setTasks(savedTasks)
    setProfile(savedProfile)
    setSchedule(savedSchedule)
    setNotes(savedNotes)
    setResources(savedResources)
    setGrades(savedGrades)
    setIsLoaded(true)
  }, [])

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      saveToLocalStorage("liza-agenda-tasks", tasks)
    }
  }, [tasks, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      saveToLocalStorage("liza-agenda-profile", profile)
    }
  }, [profile, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      saveToLocalStorage("liza-agenda-schedule", schedule)
    }
  }, [schedule, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      saveToLocalStorage("liza-agenda-notes", notes)
    }
  }, [notes, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      saveToLocalStorage("liza-agenda-resources", resources)
    }
  }, [resources, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      saveToLocalStorage("liza-agenda-grades", grades)
    }
  }, [grades, isLoaded])

  // Simple notification system
  useEffect(() => {
    if (!profile.notifications || !isLoaded) return

    const checkDueTasks = () => {
      const now = new Date()
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

      tasks.forEach((task) => {
        if (!task.completed && task.dueDate <= tomorrow && task.dueDate > now) {
          toast({
            title: "Tarea próxima a vencer",
            description: `${task.title} vence mañana`,
          })
        }
      })
    }

    const interval = setInterval(checkDueTasks, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [tasks, profile.notifications, isLoaded, toast])

  const addTask = (newTask: Omit<Task, "id">) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
    }
    setTasks([...tasks, task])
    setShowTaskForm(false)
    toast({
      title: "Tarea creada",
      description: `${task.title} ha sido agregada exitosamente`,
    })
  }

  const toggleTask = (taskId: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const updatedTask = { ...task, completed: !task.completed }
          if (updatedTask.completed) {
            toast({
              title: "¡Tarea completada!",
              description: `Has completado: ${task.title}`,
            })
          }
          return updatedTask
        }
        return task
      }),
    )
  }

  const deleteTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    setTasks(tasks.filter((task) => task.id !== taskId))
    if (task) {
      toast({
        title: "Tarea eliminada",
        description: `${task.title} ha sido eliminada`,
        variant: "destructive",
      })
    }
  }

  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile)
    setShowProfileForm(false)
    toast({
      title: "Perfil actualizado",
      description: "Tu información ha sido guardada exitosamente",
    })
  }

  const exportData = () => {
    const data = {
      tasks,
      profile,
      schedule,
      notes,
      resources,
      grades,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `liza-agenda-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Datos exportados",
      description: "Tu información ha sido descargada exitosamente",
    })
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

  const overdueTasks = tasks.filter((task) => !task.completed && task.dueDate < new Date()).length

  const NavigationItems = () => (
    <>
      {[
        { key: "dashboard", label: "Dashboard", icon: Target },
        { key: "tasks", label: "Mis Tareas", icon: CheckCircle2 },
        { key: "calendar", label: "Calendario", icon: CalendarIcon },
        { key: "schedule", label: "Horario", icon: Clock },
        { key: "notes", label: "Notas", icon: FileText },
        { key: "pomodoro", label: "Pomodoro", icon: Timer },
        { key: "grades", label: "Calificaciones", icon: Calculator },
        { key: "resources", label: "Recursos", icon: BookOpen },
        { key: "profile", label: "Perfil", icon: User },
      ].map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setActiveView(key as any)}
          className={`w-full py-3 px-4 border-b-2 md:border-b-2 md:py-4 md:px-1 font-medium text-sm flex items-center space-x-2 transition-colors ${
            activeView === key
              ? "border-purple-500 text-purple-600 bg-purple-50 md:bg-transparent dark:bg-purple-900/20"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50 md:hover:bg-transparent dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </button>
      ))}
    </>
  )

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Cargando Liza-Agenda...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Liza-Agenda
                </h1>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                  Tu compañera de estudios inteligente
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-3">
              {profile.name && (
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center overflow-hidden">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar || "/placeholder.svg"}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm font-medium">{profile.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:inline">
                    ¡Hola, {profile.name}!
                  </span>
                </div>
              )}

              {/* Notification Bell */}
              <Button variant="ghost" size="sm" onClick={() => setShowNotifications(true)} className="relative">
                <Bell className="h-4 w-4" />
                {overdueTasks > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {overdueTasks}
                  </span>
                )}
              </Button>

              {/* Theme Toggle */}
              <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              {/* Theme Customizer */}
              <Button variant="ghost" size="sm" onClick={() => setShowThemeCustomizer(true)}>
                <Palette className="h-4 w-4" />
              </Button>

              {/* Export Data */}
              <Button variant="ghost" size="sm" onClick={exportData}>
                <Download className="h-4 w-4" />
              </Button>

              <Button
                onClick={() => setShowTaskForm(true)}
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Nueva Tarea</span>
              </Button>

              {/* Mobile Navigation */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="md:hidden bg-transparent">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                  <div className="py-4">
                    <div className="flex items-center space-x-3 mb-6 pb-4 border-b">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          Liza-Agenda
                        </h2>
                      </div>
                    </div>
                    <nav className="space-y-1">
                      <NavigationItems />
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Navigation */}
      <nav className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            <NavigationItems />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {activeView === "dashboard" && (
          <div className="space-y-6 md:space-y-8">
            {/* Welcome Section */}
            {profile.name ? (
              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                        {profile.avatar ? (
                          <img
                            src={profile.avatar || "/placeholder.svg"}
                            alt={profile.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-lg md:text-2xl font-bold">
                            {profile.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-xl md:text-2xl font-bold truncate">
                          ¡{profile.gender === "male" ? "Bienvenido" : "Bienvenida"}, {profile.name}! 👋
                        </h2>
                        <p className="text-purple-100 mt-1 text-sm md:text-base">
                          {profile.career} {profile.semester && `- ${profile.semester}`}
                        </p>
                        {profile.university && <p className="text-purple-100 text-sm">{profile.university}</p>}
                        {profile.bio && <p className="text-purple-100 mt-2 text-sm line-clamp-2">{profile.bio}</p>}
                      </div>
                    </div>
                    <div className="text-center sm:text-right flex-shrink-0">
                      <p className="text-sm text-purple-100">Horas de estudio esta semana</p>
                      <p className="text-2xl md:text-3xl font-bold">{profile.studyHours}h</p>
                      {profile.gpa && (
                        <div className="mt-2">
                          <p className="text-sm text-purple-100">GPA Actual</p>
                          <p className="text-lg font-bold">{profile.gpa.toFixed(2)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardContent className="p-4 md:p-6 text-center">
                  <h2 className="text-xl md:text-2xl font-bold mb-4">¡Bienvenida a Liza-Agenda! 🎓</h2>
                  <p className="text-purple-100 mb-4 text-sm md:text-base">
                    Completa tu perfil para personalizar tu experiencia de estudio
                  </p>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {/* Progress Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base md:text-lg">
                    <Target className="h-5 w-5 mr-2 text-purple-600" />
                    Progreso General
                  </CardTitle>
                  <CardDescription className="text-sm">
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
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mis Metas:</h4>
                      <div className="space-y-1">
                        {profile.goals.slice(0, 3).map((goal, index) => (
                          <div key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <Target className="h-3 w-3 mr-2 text-purple-500 flex-shrink-0" />
                            <span className="line-clamp-1">{goal}</span>
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
                  <CardTitle className="flex items-center text-base md:text-lg">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    Horario de Hoy
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {new Date().toLocaleDateString("es-ES", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {todaySchedule.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No tienes clases programadas para hoy</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {todaySchedule.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                        >
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">{item.subject}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{item.professor}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 truncate">{item.classroom}</p>
                          </div>
                          <div className="text-right flex-shrink-0 ml-2">
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
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
                <CardTitle className="flex items-center text-base md:text-lg">
                  <Clock className="h-5 w-5 mr-2 text-orange-600" />
                  Próximas Tareas
                </CardTitle>
                <CardDescription className="text-sm">
                  Tareas pendientes ordenadas por fecha de vencimiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <p className="text-sm">¡Excelente! No tienes tareas pendientes.</p>
                    </div>
                  ) : (
                    upcomingTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2 sm:space-y-0"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">{task.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{task.subject}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Vence:{" "}
                            {task.dueDate.toLocaleDateString("es-ES", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                          {task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {task.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Badge
                            variant={
                              task.priority === "high"
                                ? "destructive"
                                : task.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Media" : "Baja"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
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
        {activeView === "notes" && <NotesView notes={notes} setNotes={setNotes} />}
        {activeView === "pomodoro" && <PomodoroTimer />}
        {activeView === "grades" && (
          <GradeCalculator grades={grades} setGrades={setGrades} profile={profile} setProfile={setProfile} />
        )}
        {activeView === "resources" && <ResourcesView resources={resources} setResources={setResources} />}
      </main>

      {/* Modals */}
      {showTaskForm && <TaskForm onSubmit={addTask} onClose={() => setShowTaskForm(false)} />}
      {showProfileForm && (
        <ProfileForm profile={profile} onSubmit={updateProfile} onClose={() => setShowProfileForm(false)} />
      )}
      {showNotifications && <NotificationCenter tasks={tasks} onClose={() => setShowNotifications(false)} />}
      {showThemeCustomizer && (
        <ThemeCustomizer profile={profile} setProfile={setProfile} onClose={() => setShowThemeCustomizer(false)} />
      )}
    </div>
  )
}

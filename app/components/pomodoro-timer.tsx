"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, RotateCcw, Timer, Coffee, Target, Volume2, VolumeX } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type TimerMode = "work" | "shortBreak" | "longBreak"

interface PomodoroSettings {
  workTime: number
  shortBreakTime: number
  longBreakTime: number
  longBreakInterval: number
}

export function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<TimerMode>("work")
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [settings, setSettings] = useState<PomodoroSettings>({
    workTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    longBreakInterval: 4,
  })
  const [soundEnabled, setSoundEnabled] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getInitialTime = (timerMode: TimerMode) => {
    switch (timerMode) {
      case "work":
        return settings.workTime * 60
      case "shortBreak":
        return settings.shortBreakTime * 60
      case "longBreak":
        return settings.longBreakTime * 60
      default:
        return settings.workTime * 60
    }
  }

  const playNotificationSound = () => {
    if (soundEnabled) {
      // Create a simple beep sound
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.value = 800
        oscillator.type = "sine"

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.5)
      } catch (error) {
        console.log("Audio not supported")
      }
    }
  }

  const switchMode = () => {
    if (mode === "work") {
      setCompletedPomodoros((prev) => prev + 1)
      const nextMode = (completedPomodoros + 1) % settings.longBreakInterval === 0 ? "longBreak" : "shortBreak"
      setMode(nextMode)
      setTimeLeft(getInitialTime(nextMode))

      toast({
        title: "¡Pomodoro completado! 🍅",
        description: nextMode === "longBreak" ? "Tiempo para un descanso largo" : "Tiempo para un descanso corto",
      })
    } else {
      setMode("work")
      setTimeLeft(getInitialTime("work"))

      toast({
        title: "Descanso terminado",
        description: "¡Hora de volver al trabajo!",
      })
    }

    playNotificationSound()
    setIsRunning(false)
  }

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            switchMode()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(getInitialTime(mode))
  }

  const changeMode = (newMode: TimerMode) => {
    setIsRunning(false)
    setMode(newMode)
    setTimeLeft(getInitialTime(newMode))
  }

  const updateSettings = (key: keyof PomodoroSettings, value: number) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    if (!isRunning) {
      setTimeLeft(getInitialTime(mode))
    }
  }

  const progress = ((getInitialTime(mode) - timeLeft) / getInitialTime(mode)) * 100

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Técnica Pomodoro</h2>
        <p className="text-gray-600 dark:text-gray-400">Mejora tu productividad con intervalos de trabajo enfocado</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timer */}
        <div className="lg:col-span-2">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center space-x-2 mb-4">
                <Button
                  variant={mode === "work" ? "default" : "outline"}
                  onClick={() => changeMode("work")}
                  className="flex items-center space-x-2"
                >
                  <Target className="h-4 w-4" />
                  <span>Trabajo</span>
                </Button>
                <Button
                  variant={mode === "shortBreak" ? "default" : "outline"}
                  onClick={() => changeMode("shortBreak")}
                  className="flex items-center space-x-2"
                >
                  <Coffee className="h-4 w-4" />
                  <span>Descanso</span>
                </Button>
                <Button
                  variant={mode === "longBreak" ? "default" : "outline"}
                  onClick={() => changeMode("longBreak")}
                  className="flex items-center space-x-2"
                >
                  <Coffee className="h-4 w-4" />
                  <span>Descanso Largo</span>
                </Button>
              </div>
              <CardTitle className="text-6xl md:text-8xl font-mono font-bold text-center">
                {formatTime(timeLeft)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Progress value={progress} className="h-3" />

              <div className="flex justify-center space-x-4">
                <Button
                  onClick={toggleTimer}
                  size="lg"
                  className={`${
                    isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                  } text-white`}
                >
                  {isRunning ? (
                    <>
                      <Pause className="h-5 w-5 mr-2" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Iniciar
                    </>
                  )}
                </Button>

                <Button onClick={resetTimer} variant="outline" size="lg">
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reiniciar
                </Button>

                <Button onClick={() => setSoundEnabled(!soundEnabled)} variant="outline" size="lg">
                  {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                </Button>
              </div>

              <div className="text-center">
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {mode === "work" ? "Tiempo de trabajo" : mode === "shortBreak" ? "Descanso corto" : "Descanso largo"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pomodoros completados: {completedPomodoros}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Timer className="h-5 w-5 mr-2" />
                Configuración
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tiempo de trabajo (minutos)
                </label>
                <Select
                  value={settings.workTime.toString()}
                  onValueChange={(value) => updateSettings("workTime", Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[15, 20, 25, 30, 45, 60].map((time) => (
                      <SelectItem key={time} value={time.toString()}>
                        {time} min
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descanso corto (minutos)</label>
                <Select
                  value={settings.shortBreakTime.toString()}
                  onValueChange={(value) => updateSettings("shortBreakTime", Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[3, 5, 10, 15].map((time) => (
                      <SelectItem key={time} value={time.toString()}>
                        {time} min
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descanso largo (minutos)</label>
                <Select
                  value={settings.longBreakTime.toString()}
                  onValueChange={(value) => updateSettings("longBreakTime", Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[15, 20, 30, 45].map((time) => (
                      <SelectItem key={time} value={time.toString()}>
                        {time} min
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Pomodoros antes del descanso largo
                </label>
                <Select
                  value={settings.longBreakInterval.toString()}
                  onValueChange={(value) => updateSettings("longBreakInterval", Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 3, 4, 5, 6].map((interval) => (
                      <SelectItem key={interval} value={interval.toString()}>
                        {interval}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas de Hoy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Pomodoros completados</span>
                <span className="font-semibold">{completedPomodoros}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tiempo enfocado</span>
                <span className="font-semibold">{completedPomodoros * settings.workTime} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Próximo descanso largo</span>
                <span className="font-semibold">
                  {settings.longBreakInterval - (completedPomodoros % settings.longBreakInterval)} pomodoros
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Consejos para la Técnica Pomodoro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Durante el trabajo:</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Enfócate en una sola tarea</li>
                <li>• Evita distracciones</li>
                <li>• No revises redes sociales</li>
                <li>• Mantén tu espacio organizado</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Durante el descanso:</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Levántate y camina</li>
                <li>• Estira tu cuerpo</li>
                <li>• Hidratate</li>
                <li>• Respira profundamente</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

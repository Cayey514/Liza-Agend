"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Calculator, TrendingUp, Target, Award } from "lucide-react"
import type { Grade, UserProfile } from "../page"

interface GradeCalculatorProps {
  grades: Grade[]
  setGrades: (grades: Grade[]) => void
  profile: UserProfile
  setProfile: (profile: UserProfile) => void
}

export function GradeCalculator({ grades, setGrades, profile, setProfile }: GradeCalculatorProps) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    subject: "",
    assignment: "",
    grade: "",
    maxGrade: "100",
    weight: "1",
  })

  const subjects = [...new Set(grades.map((grade) => grade.subject))].filter(Boolean)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.subject || !formData.assignment || !formData.grade) return

    const newGrade: Grade = {
      id: Date.now().toString(),
      subject: formData.subject,
      assignment: formData.assignment,
      grade: Number.parseFloat(formData.grade),
      maxGrade: Number.parseFloat(formData.maxGrade),
      weight: Number.parseFloat(formData.weight),
      date: new Date(),
    }

    setGrades([...grades, newGrade])
    setFormData({
      subject: "",
      assignment: "",
      grade: "",
      maxGrade: "100",
      weight: "1",
    })
    setShowForm(false)
  }

  const deleteGrade = (id: string) => {
    setGrades(grades.filter((grade) => grade.id !== id))
  }

  const calculateSubjectGPA = (subject: string) => {
    const subjectGrades = grades.filter((grade) => grade.subject === subject)
    if (subjectGrades.length === 0) return 0

    const totalWeightedPoints = subjectGrades.reduce((sum, grade) => {
      const percentage = (grade.grade / grade.maxGrade) * 100
      return sum + percentage * grade.weight
    }, 0)

    const totalWeight = subjectGrades.reduce((sum, grade) => sum + grade.weight, 0)
    const average = totalWeightedPoints / totalWeight

    // Convert percentage to 4.0 scale
    if (average >= 97) return 4.0
    if (average >= 93) return 3.7
    if (average >= 90) return 3.3
    if (average >= 87) return 3.0
    if (average >= 83) return 2.7
    if (average >= 80) return 2.3
    if (average >= 77) return 2.0
    if (average >= 73) return 1.7
    if (average >= 70) return 1.3
    if (average >= 67) return 1.0
    if (average >= 65) return 0.7
    return 0.0
  }

  const calculateOverallGPA = () => {
    if (subjects.length === 0) return 0
    const totalGPA = subjects.reduce((sum, subject) => sum + calculateSubjectGPA(subject), 0)
    return totalGPA / subjects.length
  }

  const updateTargetGPA = (target: string) => {
    setProfile({ ...profile, targetGPA: Number.parseFloat(target) || 0 })
  }

  const overallGPA = calculateOverallGPA()

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 80) return "text-blue-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) return "text-green-600"
    if (gpa >= 3.0) return "text-blue-600"
    if (gpa >= 2.5) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Calculadora de Calificaciones</h2>
          <p className="text-gray-600 dark:text-gray-400">Rastrea tu progreso académico y calcula tu GPA</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Calificación
        </Button>
      </div>

      {/* GPA Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Calculator className="h-5 w-5 mr-2 text-blue-600" />
              GPA Actual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className={`text-4xl font-bold ${getGPAColor(overallGPA)}`}>{overallGPA.toFixed(2)}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">de 4.0</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Target className="h-5 w-5 mr-2 text-green-600" />
              Meta GPA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Select value={profile.targetGPA?.toString() || ""} onValueChange={updateTargetGPA}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar meta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3.0">3.0 - Bueno</SelectItem>
                  <SelectItem value="3.5">3.5 - Muy Bueno</SelectItem>
                  <SelectItem value="3.7">3.7 - Excelente</SelectItem>
                  <SelectItem value="4.0">4.0 - Perfecto</SelectItem>
                </SelectContent>
              </Select>
              {profile.targetGPA && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{profile.targetGPA.toFixed(1)}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">objetivo</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
              Progreso
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.targetGPA ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Hacia tu meta</span>
                  <span>{Math.min(100, (overallGPA / profile.targetGPA) * 100).toFixed(0)}%</span>
                </div>
                <Progress value={Math.min(100, (overallGPA / profile.targetGPA) * 100)} className="h-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {overallGPA >= profile.targetGPA
                    ? "¡Meta alcanzada!"
                    : `Necesitas ${(profile.targetGPA - overallGPA).toFixed(2)} puntos más`}
                </p>
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                <p className="text-sm">Establece una meta para ver tu progreso</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Subject Breakdown */}
      {subjects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Calificaciones por Materia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((subject) => {
                const subjectGrades = grades.filter((grade) => grade.subject === subject)
                const subjectGPA = calculateSubjectGPA(subject)
                const averagePercentage =
                  subjectGrades.reduce((sum, grade) => {
                    return sum + (grade.grade / grade.maxGrade) * 100 * grade.weight
                  }, 0) / subjectGrades.reduce((sum, grade) => sum + grade.weight, 0)

                return (
                  <Card key={subject} className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{subject}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Promedio</span>
                          <span className={`font-semibold ${getGradeColor(averagePercentage)}`}>
                            {averagePercentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">GPA</span>
                          <span className={`font-semibold ${getGPAColor(subjectGPA)}`}>{subjectGPA.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Tareas</span>
                          <span className="text-sm font-medium">{subjectGrades.length}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grades List */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Calificaciones</CardTitle>
        </CardHeader>
        <CardContent>
          {grades.length === 0 ? (
            <div className="text-center py-8">
              <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No hay calificaciones registradas
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Comienza agregando tus primeras calificaciones para calcular tu GPA
              </p>
              <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-purple-600 to-pink-600">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primera Calificación
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {grades
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .map((grade) => {
                  const percentage = (grade.grade / grade.maxGrade) * 100
                  return (
                    <div
                      key={grade.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">{grade.subject}</Badge>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">{grade.assignment}</h4>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {grade.date.toLocaleDateString("es-ES")} • Peso: {grade.weight}x
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getGradeColor(percentage)}`}>
                            {grade.grade}/{grade.maxGrade}
                          </div>
                          <div className={`text-sm ${getGradeColor(percentage)}`}>{percentage.toFixed(1)}%</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteGrade(grade.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Agregar Calificación</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="subject">Materia *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Ej: Matemáticas"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="assignment">Tarea/Examen *</Label>
                  <Input
                    id="assignment"
                    value={formData.assignment}
                    onChange={(e) => setFormData({ ...formData, assignment: e.target.value })}
                    placeholder="Ej: Examen Parcial 1"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="grade">Calificación *</Label>
                    <Input
                      id="grade"
                      type="number"
                      step="0.1"
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      placeholder="85"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxGrade">Puntos Máximos</Label>
                    <Input
                      id="maxGrade"
                      type="number"
                      step="0.1"
                      value={formData.maxGrade}
                      onChange={(e) => setFormData({ ...formData, maxGrade: e.target.value })}
                      placeholder="100"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="weight">Peso (multiplicador)</Label>
                  <Select
                    value={formData.weight}
                    onValueChange={(value) => setFormData({ ...formData, weight: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">0.5x - Tarea menor</SelectItem>
                      <SelectItem value="1">1x - Tarea normal</SelectItem>
                      <SelectItem value="1.5">1.5x - Tarea importante</SelectItem>
                      <SelectItem value="2">2x - Examen parcial</SelectItem>
                      <SelectItem value="3">3x - Examen final</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Agregar Calificación
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setFormData({
                        subject: "",
                        assignment: "",
                        grade: "",
                        maxGrade: "100",
                        weight: "1",
                      })
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

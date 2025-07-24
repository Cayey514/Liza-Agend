"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Clock, MapPin, User, Trash2, Edit } from "lucide-react"
import type { ScheduleItem } from "../page"

interface ScheduleViewProps {
  schedule: ScheduleItem[]
  setSchedule: (schedule: ScheduleItem[]) => void
}

export function ScheduleView({ schedule, setSchedule }: ScheduleViewProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null)
  const [formData, setFormData] = useState({
    subject: "",
    day: "",
    startTime: "",
    endTime: "",
    classroom: "",
    professor: "",
  })

  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.subject || !formData.day || !formData.startTime || !formData.endTime) return

    if (editingItem) {
      setSchedule(schedule.map((item) => (item.id === editingItem.id ? { ...formData, id: editingItem.id } : item)))
      setEditingItem(null)
    } else {
      const newItem: ScheduleItem = {
        ...formData,
        id: Date.now().toString(),
      }
      setSchedule([...schedule, newItem])
    }

    setFormData({
      subject: "",
      day: "",
      startTime: "",
      endTime: "",
      classroom: "",
      professor: "",
    })
    setShowForm(false)
  }

  const handleEdit = (item: ScheduleItem) => {
    setFormData({
      subject: item.subject,
      day: item.day,
      startTime: item.startTime,
      endTime: item.endTime,
      classroom: item.classroom,
      professor: item.professor,
    })
    setEditingItem(item)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setSchedule(schedule.filter((item) => item.id !== id))
  }

  const getScheduleByDay = () => {
    const scheduleByDay: { [key: string]: ScheduleItem[] } = {}
    days.forEach((day) => {
      scheduleByDay[day] = schedule
        .filter((item) => item.day === day)
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
    })
    return scheduleByDay
  }

  const scheduleByDay = getScheduleByDay()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mi Horario de Clases</h2>
          <p className="text-gray-600">Organiza tu semana académica</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-purple-600 to-pink-600">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Clase
        </Button>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {days.map((day) => (
          <Card key={day} className="min-h-[300px]">
            <CardHeader className="pb-3">
              <CardTitle className="text-center text-sm font-medium text-gray-700">{day}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {scheduleByDay[day].length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <Clock className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-xs">Sin clases</p>
                </div>
              ) : (
                scheduleByDay[day].map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 group hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{item.subject}</h4>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(item)} className="h-6 w-6 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(item.id)}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-gray-600">
                        <Clock className="h-3 w-3 mr-1" />
                        {item.startTime} - {item.endTime}
                      </div>
                      {item.classroom && (
                        <div className="flex items-center text-xs text-gray-600">
                          <MapPin className="h-3 w-3 mr-1" />
                          {item.classroom}
                        </div>
                      )}
                      {item.professor && (
                        <div className="flex items-center text-xs text-gray-600">
                          <User className="h-3 w-3 mr-1" />
                          {item.professor}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Classes Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Clases de Hoy</CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const today = new Date().toLocaleDateString("es-ES", { weekday: "long" })
            const todayClasses = scheduleByDay[today.charAt(0).toUpperCase() + today.slice(1)] || []

            if (todayClasses.length === 0) {
              return (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No tienes clases programadas para hoy</p>
                </div>
              )
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {todayClasses.map((item) => (
                  <div key={item.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-gray-900">{item.subject}</h4>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {item.startTime} - {item.endTime}
                      </div>
                      {item.classroom && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {item.classroom}
                        </div>
                      )}
                      {item.professor && (
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          {item.professor}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          })()}
        </CardContent>
      </Card>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{editingItem ? "Editar Clase" : "Agregar Nueva Clase"}</CardTitle>
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
                  <Label>Día de la Semana *</Label>
                  <Select value={formData.day} onValueChange={(value) => setFormData({ ...formData, day: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un día" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Hora de Inicio *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">Hora de Fin *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="classroom">Aula/Salón</Label>
                  <Input
                    id="classroom"
                    value={formData.classroom}
                    onChange={(e) => setFormData({ ...formData, classroom: e.target.value })}
                    placeholder="Ej: Aula 101"
                  />
                </div>

                <div>
                  <Label htmlFor="professor">Profesor</Label>
                  <Input
                    id="professor"
                    value={formData.professor}
                    onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
                    placeholder="Ej: Dr. García"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingItem ? "Actualizar" : "Agregar"} Clase
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setEditingItem(null)
                      setFormData({
                        subject: "",
                        day: "",
                        startTime: "",
                        endTime: "",
                        classroom: "",
                        professor: "",
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

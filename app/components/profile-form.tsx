"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Upload, Camera } from "lucide-react"
import type { UserProfile } from "../page"

interface ProfileFormProps {
  profile: UserProfile
  onSubmit: (profile: UserProfile) => void
  onClose: () => void
}

export function ProfileForm({ profile, onSubmit, onClose }: ProfileFormProps) {
  const [formData, setFormData] = useState<UserProfile>(profile)
  const [newGoal, setNewGoal] = useState("")
  const [newSubject, setNewSubject] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Por favor selecciona un archivo de imagen válido")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen debe ser menor a 5MB")
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setFormData({ ...formData, avatar: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeAvatar = () => {
    setFormData({ ...formData, avatar: "" })
  }

  const addGoal = () => {
    if (newGoal.trim()) {
      setFormData({
        ...formData,
        goals: [...formData.goals, newGoal.trim()],
      })
      setNewGoal("")
    }
  }

  const removeGoal = (index: number) => {
    setFormData({
      ...formData,
      goals: formData.goals.filter((_, i) => i !== index),
    })
  }

  const addSubject = () => {
    if (newSubject.trim() && !formData.favoriteSubjects.includes(newSubject.trim())) {
      setFormData({
        ...formData,
        favoriteSubjects: [...formData.favoriteSubjects, newSubject.trim()],
      })
      setNewSubject("")
    }
  }

  const removeSubject = (index: number) => {
    setFormData({
      ...formData,
      favoriteSubjects: formData.favoriteSubjects.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-white dark:bg-gray-900 z-10 border-b">
          <CardTitle className="text-lg md:text-xl">{profile.name ? "Editar Perfil" : "Crear Mi Perfil"}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center overflow-hidden">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar || "/placeholder.svg"}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="h-8 w-8 md:h-12 md:w-12 text-white" />
                  )}
                </div>
                {formData.avatar && (
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Subir Foto</span>
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-500 text-center">Formatos: JPG, PNG, GIF. Máximo 5MB</p>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Tu nombre completo"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <Label>Género</Label>
              <Select
                value={formData.gender}
                onValueChange={(value: "female" | "male" | "other") => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Femenino</SelectItem>
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Academic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="career">Carrera *</Label>
                <Input
                  id="career"
                  value={formData.career}
                  onChange={(e) => setFormData({ ...formData, career: e.target.value })}
                  placeholder="Ej: Ingeniería en Sistemas"
                  required
                />
              </div>
              <div>
                <Label htmlFor="semester">Semestre/Año</Label>
                <Input
                  id="semester"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  placeholder="Ej: 5to Semestre"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="university">Universidad/Institución</Label>
              <Input
                id="university"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                placeholder="Nombre de tu universidad"
              />
            </div>

            <div>
              <Label htmlFor="bio">Biografía</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Cuéntanos un poco sobre ti, tus intereses académicos..."
                rows={3}
                className="resize-none"
              />
            </div>

            <div>
              <Label htmlFor="studyHours">Horas de Estudio por Semana</Label>
              <Input
                id="studyHours"
                type="number"
                min="0"
                max="168"
                value={formData.studyHours}
                onChange={(e) => setFormData({ ...formData, studyHours: Number.parseInt(e.target.value) || 0 })}
                placeholder="20"
              />
            </div>

            {/* Goals Section */}
            <div>
              <Label>Mis Metas Académicas</Label>
              <div className="space-y-2 mt-2">
                <div className="flex gap-2">
                  <Input
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder="Ej: Obtener promedio de 9.0"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addGoal())}
                    className="flex-1"
                  />
                  <Button type="button" onClick={addGoal} size="sm" className="flex-shrink-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.goals.map((goal, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1 text-xs">
                      <span className="truncate max-w-[200px]">{goal}</span>
                      <button
                        type="button"
                        onClick={() => removeGoal(index)}
                        className="ml-1 hover:text-red-600 flex-shrink-0"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Favorite Subjects */}
            <div>
              <Label>Materias Favoritas</Label>
              <div className="space-y-2 mt-2">
                <div className="flex gap-2">
                  <Input
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Ej: Matemáticas"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSubject())}
                    className="flex-1"
                  />
                  <Button type="button" onClick={addSubject} size="sm" className="flex-shrink-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.favoriteSubjects.map((subject, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1 text-xs">
                      <span className="truncate max-w-[150px]">{subject}</span>
                      <button
                        type="button"
                        onClick={() => removeSubject(index)}
                        className="ml-1 hover:text-red-600 flex-shrink-0"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
                {profile.name ? "Actualizar Perfil" : "Crear Perfil"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="sm:w-auto bg-transparent">
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
